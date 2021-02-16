const path = require('path');
const fs = require('fs');

module.exports = {

    index: async function (req, res) {
        //enter name, select which step:
        var edit = await Edits.findOne({ id: req.param('id') });
        
        console.log('Name: ' + req.param('name'));

        let withContrib=[],reviewed=[];

        if (req.method =='POST')
        {
            req.session.name = req.param('name');
            console.log(req.param('name'));
        }

        if (edit.transcription && edit.transcription.chunks)
        {
            withContrib = _.filter(edit.transcription.chunks,function(c){
                return (c.contributions)?c.contributions.length > 0:false;
            });

            reviewed = _.filter(edit.transcription.chunks,function(c){
                return (c.adoptedContribution)?c.adoptedContribution:false;
            });
        }

        let chunkLength = (edit.transcription && edit.transcription.chunks) ? edit.transcription.chunks.length : 0; 
        
        var progress = {
            stage1: (chunkLength > 0) ? 100 : 0,
            stage2: Math.round((withContrib.length / chunkLength)*100),
            stage3: Math.round((reviewed.length / chunkLength)*100)
        }


        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        console.log("Progress:");
        console.log(progress)
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

        if (!req.param('name'))
        {
            return res.redirect(`/transcribe/${req.param('id')}/?apikey=${res.locals.apikey}&name=${req.session.name}`);
        }

        return res.sendfile(path.join(__dirname, '..', '..', `assets/transcription/transcription/build/index.html`))
    },
    
    step1: function(req,res)
    {
        //chunking
        // return res.json({ok:'ok'});
        // var ff = path.join(__dirname,'..','..','/assets/transcription/step1/build/index.html');
        // var file = fs.readFileSync(ff);
        // console.log(file);

        if (!req.param('name'))
        {
            return res.redirect(`/transcribe/s1/${req.param('id')}/?apikey=${res.locals.apikey}&name=${req.session.name}`);
        }

        return res.sendfile(path.join(__dirname,'..','/assets/transcription/transcription/build/index.html'));
    },

    step2: function(req,res)
    {
        if (!req.param('name'))
        {
            return res.redirect(`/transcribe/s2/${req.param('id')}/?apikey=${res.locals.apikey}&name=${req.session.name}`);
        }

        //transcribe
        return res.sendfile(path.join(__dirname,'..','..','/assets/transcription/step2/build/index.html'));
    },

    step3: function(req,res)
    {
        if (!req.param('name'))
        {
            return res.redirect(`/transcribe/s3/${req.param('id')}/?apikey=${res.locals.apikey}&name=${req.session.name}`);
        }

        //review
        return res.sendfile(path.join(__dirname,'..','..','/assets/transcription/step3/build/index.html'));
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