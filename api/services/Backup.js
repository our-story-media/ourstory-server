
const fs = require('fs');
const util = require('util');
const copy = util.promisify(fs.copyFile);
const mkdir = util.promisify(fs.mkdir);
const exec = util.promisify(require('child_process').exec);
const realexec = require('child_process').exec;
const path = require('path');


exports.backuprunning = false;
exports.copyprogress = -1;

exports.backup = async function () {
    try {
        this.backuprunning = true;

        let pp = path.join(__dirname, '..', '..', 'upload');
        let mongofile = path.join(pp, 'indaba.mongodb');
        let redisfile = path.join(pp, 'indaba.redis');

        await exec(`mongodump --host mongo --db bootlegger --archive=${mongofile} --gzip`);

        //create redis dump:
        await exec(`tar cvf ${redisfile} /redis`);

        let dest = `/usbdrive/usb0/indaba/${Date.now()}`;

        try {
            await mkdir(dest, { recursive: true });
        }
        catch (e) {

        }

        // await exec(`cp -R ${path.join(__dirname, '..', '..', "upload")} ${dest}`);

        await new Promise((res, rej) => {
            let command = realexec(`rsync -a --info=progress2 ${path.join(__dirname, '..', '..', "upload")} ${dest}`);
            command.stdout.on('data', (data) => {
                // console.log(data);

                var re = new RegExp(/\s(\d*)%/);
                let prog = data.match(re);
                // console.log(prog);
                if (prog)
                {
                    this.copyprogress = prog[1];
                }
            });
            command.stderr.on('data', (data) => {
                // let progress = data.split(' ');
                // console.log(data);
            });
            command.on('exit', (err) => {
                if (err)
                    return rej(err);
                else
                    return res();
            });
        });

        exports.copyprogress = 100;
    }
    catch (e) {
        throw e;
    }
    finally {
        this.backuprunning = false;
    }
}

exports.restore = async function (source) {
    try {
        
        this.backuprunning = true;

        await exec(`mongorestore --host mongo --db bootlegger --drop --archive=/usbdrive/usb0/indaba/${source}/upload/indaba.mongodb --gzip`);

        await exec(`pkill redis-server`);

        await exec(`cd /redis && tar xvf /usbdrive/usb0/indaba/${source}/upload/indaba.redis --strip 1`);

        await exec(`redis-server &`);

        await new Promise((res, rej) => {
            let command = realexec(`rsync -a --info=progress2 /usbdrive/usb0/indaba/${source}/upload/* ${path.join(__dirname, '..', '..', "upload")}`);
            command.stdout.on('data', (data) => {
                // console.log(data);

                var re = new RegExp(/\s(\d*)%/);
                let prog = data.match(re);
                // console.log(prog);
                if (prog)
                {
                    this.copyprogress = prog[1];
                }
            });
            command.stderr.on('data', (data) => {
                // let progress = data.split(' ');
                // console.log(data);
            });
            command.on('exit', (err) => {
                if (err)
                    return rej(err);
                else
                    return res();
            });
        });

        exports.copyprogress = 100;
    }
    catch (e) {
        throw e;
    }
    finally {
        this.backuprunning = false;
    }
}