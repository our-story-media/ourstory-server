const path = require("path");
const fs = require("fs");

const _ = require("lodash");
const padStart = require("lodash.padstart");

//CALCULATE TIME DIFF BETWEEN 2 STRING TIMES (SECONDS)
const calcTime = function (s_in, s_out) {
  // console.log(s_in);
  // console.log(s_out);
  s_in = s_in.split(":");
  let i_in =
    parseFloat(s_in[2]) + parseInt(s_in[1]) * 60 + parseInt(s_in[0]) * 3600;
  s_out = s_out.split(":");
  let i_out =
    parseFloat(s_out[2]) + parseInt(s_out[1]) * 60 + parseInt(s_out[0]) * 3600;

  // console.log(i_out);

  //in seconds
  return i_out - i_in;
};

const timecodeToTimestamp = function (s_in) {
  s_in = s_in.split(":");
  let i_in =
    parseInt(s_in[3]) / 100.0 +
    parseInt(s_in[2]) +
    parseInt(s_in[1]) * 60 +
    parseInt(s_in[0]) * 3600;

  //in seconds
  return calcTS(i_in);
};

//CONVERT FROM SECONDS TO PADDED STRING TIME (with decimal)
const calcTS = function (ts) {
  // console.log(ts);
  //ts in secs
  let hours = Math.floor(ts / 3600);
  let mins = Math.floor((ts - hours * 3600) / 60);
  let secs = Math.floor(ts % 60);
  let subs = ((ts % 60) - secs).toFixed(2);
  // console.log(hours, mins, secs, subs);
  return `${padStart(hours, 2, "0")}:${padStart(mins, 2, "0")}:${padStart(
    secs,
    2,
    "0"
  )}.${padStart(subs.substring(2, 4), 2, "0")}0`;
};

const getSubs = function (edit) {
  //Generate Subtitles:
  let to_burn = [];
  if (edit.transcription && edit.transcription.chunks) {
    // console.log(edit.transcription);

    edit.transcription.chunks.forEach((c) => {
      if (c.review !== undefined) {
        let obj = c.transcriptions.filter(
          (t) => c.review.selectedtranscription === t.id
        )[0];

        let chunks = [];

        if (obj && obj.content) {
          let text = obj.content;

          // console.log(`ss: ${c.starttimestamp}`);

          //mini-chunks:
          let length = calcTime(
            timecodeToTimestamp(c.starttimestamp),
            timecodeToTimestamp(c.endtimestamp)
          );
          // console.log(
          //   `length: ${length} from ${timecodeToTimestamp(
          //     c.starttimestamp
          //   )} to ${timecodeToTimestamp(c.endtimestamp)}`
          // );
          let start_time = calcTime(
            "00:00:00.00",
            timecodeToTimestamp(c.starttimestamp)
          );
          // console.log(`start: ${start_time}`);

          const SPLIT_LENGTH = 8.0;

          //if its more than 6 seconds:
          let words = text.split(" ");
          if (length < 6 || words.length < 8)
            //its less than 5 seconds:
            chunks.push({
              starts: timecodeToTimestamp(c.starttimestamp),
              ends: timecodeToTimestamp(c.endtimestamp),
              text: text,
            });
          else {
            // console.log(`words: ${words.length}`);

            //find a nice number that does not leave a remainder:

            let segments = Math.floor(words.length / SPLIT_LENGTH);
            // console.log(`segments: ${segments}`);

            //how many sub-segments
            // let minis = length / segments;

            // console.log(`minis: ${minis}`);

            // console.log(
            //   `mini: ${minis}, reminder: ${length % SPLIT_LENGTH}`
            // );

            // how many rounded sub-segments (floored)
            // let mini_round = Math.floor(minis);

            //split words into this many chunks:
            //how many words per sub-segment
            let words_per_block = Math.floor(words.length / segments);

            // let words_per_block =

            // console.log(`words: ${words_per_block}`);
            let counter = 0;
            let timer = 0;

            let new_adjuster = length / segments;

            // console.log(`new_adjuster: ${new_adjuster}`);

            // while (counter < words.length) {
            for (let loop = 0; loop < segments; loop++) {
              let subw = words.slice(counter, counter + words_per_block);

              counter += words_per_block;

              const starttime =
                Math.round((start_time + timer + Number.EPSILON) * 100) / 100;

              timer += new_adjuster;

              // console.log(start_time, timer);

              const endtime =
                Math.round((start_time + timer + Number.EPSILON) * 100) / 100;

              //if there is some remaining words (less than the segment):
              if (words.length - counter < SPLIT_LENGTH) {
                // console.log(
                //   `append ${
                //     words.length - counter
                //   } word to this one (${endtime})`
                // );
                let toadd = words.slice(counter - words.length);
                // console.log(`toadd: ${toadd}`);
                subw.push(...toadd);
              }

              chunks.push({
                starts: calcTS(starttime),
                ends: calcTS(endtime),
                text: subw.join(" "),
              });
            }
          }
        }

        for (let chunk of chunks) {
          to_burn.push({
            starts: chunk.starts,
            ends: chunk.ends,
            text: chunk.text,
          });
        }
      }
    });
  }
  return to_burn;
};

module.exports = {
  index: async function (req, res) {
    // console.log("id", req.params.id);
    // let apiurl = req.protocol + "://" + req.host + ":" + req.port;
    let apiurl = sails.config.master_url;
    // console.log(apiurl);
    return res.view("transcribe/index", {
      id: req.params.id,
      apiurl: encodeURIComponent(apiurl),
    });
    // return res.sendfile(
    //   path.join(__dirname, "..", "..", `transcription/build/index.html`)
    // );
  },

  vtt: async function (req, res) {
    try {
      var edit = await Edits.findOne(req.params.id);
      let subs = getSubs(edit);

      // console.log(subs);

      // //convert the transcription object to srt:
      // var lineNumber = 0;
      const subs_text = subs.map((c) => {
        //   lineNumber++;
        return `${c.starts} --> ${c.ends}\n${c.text}\n\n`;
      });

      if (req.query["download"])
        res.header(
          "Content-Disposition",
          'attachment; filename="subtitles.vtt"'
        );
      // res.header("Content-Type", 'text/vtt"');
      return res.send(`WEBVTT\n\n${subs_text.join("")}`);
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  },

  // srt: async function (req, res) {
  //   try {
  //     var edit = await Edits.findOne(req.params.id);
  //     var subs = edit.transcription || { chunks: [] };

  //     //convert the transcription object to srt:
  //     var lineNumber = 0;
  //     const subs_text = subs.chunks.map((c) => {
  //       lineNumber++;
  //       return c.review === undefined
  //         ? ""
  //         : `${lineNumber}\n${c.starttimestamp} --> ${c.endtimestamp}\n${
  //             c.transcriptions.filter(
  //               (t) => c.review.selectedtranscription === t.id
  //             )[0].content
  //           }\n\n`;
  //     });

  //     res.header("Content-Disposition", 'attachment; filename="subtitles.srt"');
  //     return res.send(subs_text.join(""));
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500);
  //   }
  // },
};
