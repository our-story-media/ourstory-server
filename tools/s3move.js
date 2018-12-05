const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const Sema = require('async-sema');
const queue = new Sema(10, { capactiy: 3000 })
const Util = require('util');
const _ = require('lodash');
let totalfail = 0;
let totaldone = 0;
let total = 0;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bootlegger');
const Media = mongoose.model('media', new mongoose.Schema({ event_id: String, thumb:String, path:String }));

function copyFromS3(s3,bucket, source, dest) {

    //move to a dir that is the event id:

    return new Promise(function (resolve, reject) {

        const params = {
            Bucket: bucket,
            CopySource: `${source}`,
            Key: dest
        };
        s3.copyObject(params, (err, res) => {
            if (err) {
                console.log("COPY-ERROR", err);
                reject(err);
            }
            else {
                // console.log("COPY-RESULT", res);
                resolve(res);
            }
        });
    });
}

async function processFile(file)
{
    await queue.acquire();

    try {
        // console.log(file);
        // console.log(file);
        if (file.path)
        {
            let src = `${file.path}`;
            let dst = `${file.event_id}/${file.path}`;
            console.log(`Moving ${src} to ${dst}...`);

        }
        
        if (file.thumb)
        {
            let src1 = `${file.path}`;
            let dst1 = `${file.event_id}/${file.thumb}`;
            console.log(`Moving ${src1} to ${dst1}...`);
        }


        totaldone++;
    } catch (error) {
        totalfail++;
    }

    
    //move to a dir that is the event id:
    console.log(`${totaldone} of ${total} (${totalfail} failed)`);
    queue.release();
}

async function process()
{
    let toprocess = [];

    //list all media:
    let media = await Media.find();
    // console.log(media);
    total = media.length;

    for (let file of media)
    {
        toprocess.push(processFile(file));
    }

    var fails = await Promise.all(toprocess);
    console.log(_.compact(fails));
    console.log('COMPLETE!');
}

process();