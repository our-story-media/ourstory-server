const path = require('path');
const fs = require('fs');

module.exports = {

    index: function (req, res) {
        //enter name, select which step:
		return res.view({ id: req.param('id') });
    },
    
    step1: function(req,res)
    {
        //chunking
        // return res.json({ok:'ok'});
        // var ff = path.join(__dirname,'..','..','/assets/transcription/step1/build/index.html');
        // var file = fs.readFileSync(ff);
        // console.log(file);
        return res.sendfile(path.join(__dirname,'..','..','/assets/transcription/step1/build/index.html'));
    },

    step2: function(req,res)
    {
        //transcribe
        return res.view({ id: req.param('id'), _layoutFile: null });
    },

    step3: function(req,res)
    {
        //review
        return res.view({ id: req.param('id') , _layoutFile: null });
    },

    subs: async function (req, res) {
        try {
            var edit = await Edits.findOne(req.params.id);
            var subs = edit.transcription || { chunks: [] };

            // || {chunks:[
            // 	{
            // 		starttime: '00:45:23.560',
            // 		endtime: '00:45:27.560',
            // 		contributions:[
            // 			{
            // 				text: 'This is subtitle 1'
            // 			}
            // 		]
            // 	}
            // ]};
            //convert the transcription object to srt:

            var subs_text = "";

            var sequence = 0;

            var subs_text = _.map(subs.chunks, function (chunk) {
                sequence++;
                var text = chunk.contributions[0].text;
                var start = chunk.starttime.replace('.', ',');
                var end = chunk.endtime.replace('.', ',');

                return `${sequence}\n${start} --> ${end}\n${text}\n\n`;
            });

            res.header('Content-Disposition', 'attachment; filename="subtitles.srt"');
            return res.send(subs_text.join());
        }
        catch (e) {
            console.log(e);
            return res.status(500);
        }
    }

}