const fs = require("fs");
const util = require("util");
const copy = util.promisify(fs.copyFile);
const mkdir = util.promisify(fs.mkdir);
const exec = util.promisify(require("child_process").exec);
const realexec = require("child_process").exec;
const path = require("path");

exports.backuprunning = false;
exports.copyprogress = -1;

const collections = [
  "edits",
  "event",
  "eventtemplate",
  "media",
  "shot",
  "user",
];

exports.backup = async function () {
  try {
    this.backuprunning = true;

    let pp = path.join(__dirname, "..", "..", "upload");
    let mongolocation = path.join(pp);
    let redisfile = path.join(pp, "indaba.redis");

    // await exec(
    //   `mongodump --host mongo --db bootlegger --archive=${mongofile} --gzip`
    // );

    for (const collection of collections) {
      const loc = path.join(mongolocation, collection + ".json");
      await exec(
        `mongoexport --host mongo --db bootlegger --collection ${collection} --out=${loc}`
      );
    }

    //create redis dump:
    await exec(`tar cvf ${redisfile} /redis`);

    let dest = `/usbdrive/usb/indaba/${Date.now()}`;

    try {
      await mkdir(`/usbdrive/usb/indaba/`);
      await mkdir(dest);
    } catch (e) {
      console.error(e);
    }

    this.copyprogress = 0;

    //run rsync for media dirs:
    await new Promise((res, rej) => {
      let command = realexec(
        `rsync -a --info=progress2 ${path.join(
          __dirname,
          "..",
          "..",
          "upload"
        )} ${dest}`
      );
      command.stdout.on("data", (data) => {
        var re = new RegExp(/\s(\d*)%/);
        let prog = data.match(re);
        // console.log(prog);
        if (prog) {
          this.copyprogress = prog[1];
        }
      });
      command.stderr.on("data", (data) => {
        // let progress = data.split(' ');
        Log.error(data);
      });
      command.on("exit", (err) => {
        if (err) return rej(err);
        else return res();
      });
    });

    exports.copyprogress = 100;
  } catch (e) {
    console.error(e);
  } finally {
    this.backuprunning = false;
  }
};

exports.restore = async function (source) {
  try {
    this.backuprunning = true;

    for (const collection of collections) {
      await exec(
        `mongoimport --host mongo --db bootlegger --drop --collection ${collection} /usbdrive/usb/indaba/${source}/upload/${collection}.json`
      );
    }

    try {
      //this will throw on dev machine, as redis-server is not running inside the container
      await exec(`pkill redis-server`);
    } catch {}

    await exec(
      `cd /redis && tar xvf /usbdrive/usb/indaba/${source}/upload/indaba.redis --strip 1`
    );

    await exec(`redis-server --dir /redis --appendonly yes &`);

    this.copyprogress = 0;

    await new Promise((res, rej) => {
      let command = realexec(
        `rsync -a --info=progress2 /usbdrive/usb/indaba/${source}/upload/* ${path.join(
          __dirname,
          "..",
          "..",
          "upload"
        )}`
      );
      command.stdout.on("data", (data) => {
        // console.log(data);

        var re = new RegExp(/\s(\d*)%/);
        let prog = data.match(re);
        // console.log(prog);
        if (prog) {
          this.copyprogress = prog[1];
        }
      });
      command.stderr.on("data", (data) => {
        // let progress = data.split(' ');
        // console.log(data);
      });
      command.on("exit", (err) => {
        if (err) return rej(err);
        else return res();
      });
    });

    exports.copyprogress = 100;
  } catch (e) {
    console.error(e);
  } finally {
    this.backuprunning = false;
  }
};
