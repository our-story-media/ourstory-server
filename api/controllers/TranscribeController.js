const path = require("path");
const fs = require("fs");

module.exports = {
  index: async function (req, res) {
    // console.log("id", req.params.id);
    let apiurl = req.protocol + "://" + req.host + ":" + req.port;
    // console.log(apiurl);
    return res.view("transcribe/index", {
      id: req.params.id,
      apiurl: encodeURIComponent(apiurl),
    });
    // return res.sendfile(
    //   path.join(__dirname, "..", "..", `transcription/build/index.html`)
    // );
  },

  subs: async function (req, res) {
    try {
      var edit = await Edits.findOne(req.params.id);
      var subs = edit.transcription || { chunks: [] };

      //convert the transcription object to srt:
      var lineNumber = 0;
      const subs_text = subs.chunks.map((c) => {
        lineNumber++;
        return c.review === undefined
          ? ""
          : `${lineNumber}\n${c.starttimestamp} --> ${c.endtimestamp}\n${
              c.transcriptions.filter(
                (t) => c.review.selectedtranscription === t.id
              )[0].content
            }\n\n`;
      });

      res.header("Content-Disposition", 'attachment; filename="subtitles.srt"');
      return res.send(subs_text.join(""));
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  },
};
