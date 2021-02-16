const path = require('path');
const fs = require('fs');

module.exports = {

    index: async function (req, res) {
        if (req.method =='POST')
        {
            req.session.name = req.param('name');
            console.log(req.param('name'));
        }

        if (!req.param('name'))
        {
            return res.redirect(`/transcribe/${req.param('id')}/?apikey=${res.locals.apikey}&name=${req.session.name}`);
        }

        return res.sendfile(path.join(__dirname, '..', '..', `assets/transcription/build/index.html`))
    },

    subs: async function (req, res) {
        try {
            var edit = await Edits.findOne(req.params.id);
            var subs = edit.transcription || { chunks: [] };

            //convert the transcription object to srt:
            const subs_text = subs.chunks.map((c) => {
                return c.review === undefined
                    ? ''
                    : `${c.starttimestamp} --> ${c.endtimestamp}\n${c.transcriptions.filter((t) => c.review.selectedtranscription === t.id)[0].content}\n`
            })

            res.header('Content-Disposition', 'attachment; filename="subtitles.srt"');
            return res.send(subs_text.join(''));
        }
        catch (e) {
            console.log(e);
            return res.status(500);
        }
    }

}