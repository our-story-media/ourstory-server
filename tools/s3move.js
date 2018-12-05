const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const Sema = require('async-sema');
const queue = new Sema(20, { capactiy: 3000 })
const Util = require('util');
const _ = require('lodash');
let totalfail = 0;
let totaldone = 0;
let total = 0;
const s3 = new AWS.S3();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bootlegger');
const Media = mongoose.model('media', new mongoose.Schema({ event_id: String, thumb:String, path:String }));
const Edit = mongoose.model('edits', new mongoose.Schema({ shortlink: String }));


function copyFromS3(bucket, source, dest) {

    //move to a dir that is the event id:

    return new Promise(function (resolve, reject) {

        const params = {
            Bucket: bucket,
            CopySource: `${bucket}/${source}`,
            Key: dest
        };
        // console.log(params);
        
        s3.copyObject(params, (err, res) => {
            if (err) {
                // console.log("COPY-ERROR", err);
                reject(err);
            }
            else {
                // console.log("COPY-RESULT", res);
                resolve(res);
            }
        });
    });
}

function rmFromS3(bucket, source) {

    //move to a dir that is the event id:

    return new Promise(function (resolve, reject) {

        const params = {
            Bucket: bucket,
            Key: source
        };
        // console.log(params);
        
        s3.deleteObject(params, (err, res) => {
            if (err) {
                // console.log("COPY-ERROR", err);
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

        //EDIT
        // if (file.shortlink)
        // {
        //     let src = `upload/${file.shortlink}.mp4`;
        //     let dst = `upload/edits/${file.shortlink}.mp4`;
        //     console.log(`Moving ${src} to ${dst}...`);
        //     try {
        //         await copyFromS3('bootleggerlive', src, dst);
                
        //     } catch (error) {
                
        //     }
        //     try {
        //         await rmFromS3('bootleggerlive', src);
        //     } catch (error) {
        //         console.log(`File not found ${src}`);
                
        //     }
        //     console.log(`DONE Moving ${src} to ${dst}...`);
        // }

        // //EDIT TRANSCODE FILE
        // try {
            
        //     if (file.shortlink)
        //     {
        //         let src = `upload/${file.shortlink}.mp4`;
        //         let dst = `upload/edits/${file.shortlink}.mp4`;
        //         console.log(`Moving ${src} to ${dst}...`);
        //         try {
        //             await copyFromS3('bootleggertrans', src, dst);
        //         } catch (error) {
                    
        //         }
        //         try {
        //             await rmFromS3('bootleggertrans', src);
        //         } catch (error) {
        //             console.log(`File not found ${src}`);
                    
        //         }
        //         console.log(`DONE Moving ${src} to ${dst}...`);
        //     }
        // } catch (error) {
        //    // console.log(error);
               
        // }


        //MAIN FILE
        // if (file.path)
        // {
        //     let src = `upload/${file.path}`;
        //     let dst = `upload/${file.event_id}/${file.path}`;
        //     console.log(`Moving ${src} to ${dst}...`);
        //     try {
        //         await copyFromS3('bootleggerlive', src, dst);
                
        //     } catch (error) {
                
        //     }
        //     try {
        //         await rmFromS3('bootleggerlive', src);
        //     } catch (error) {
        //         console.log(`File not found ${src}`);
                
        //     }
        //     console.log(`DONE Moving ${src} to ${dst}...`);
        // }

        // // //TRANSCODE FILE
        try {
            
            if (file.path)
            {
                let src = `upload/archive/preview_${file.path}`;
                let dst = `upload/${file.event_id}/preview_${file.path}`;
                console.log(`Moving ${src} to ${dst}...`);
                try {
                    await copyFromS3('bootleggertrans', src, dst);
                } catch (error) {
                    
                }
                try {
                    await rmFromS3('bootleggertrans', src);
                } catch (error) {
                    console.log(`File not found ${src}`);
                    
                }
                console.log(`DONE Moving ${src} to ${dst}...`);
            }
        } catch (error) {
           // console.log(error);
               
        }
        
        // //THUMBNAIL
        // if (file.thumb)
        // {
        //     let src = `upload/${file.thumb}`;
        //     let dst = `upload/${file.event_id}/${file.thumb}`;
        //     // console.log(`Moving ${src} to ${dst}...`);
        //     try {
        //         await copyFromS3('bootleggerlive', src, dst);
                
        //     } catch (error) {
                
        //     }
        //     try {
        //         await rmFromS3('bootleggerlive', src);
        //     } catch (error) {
        //         console.log(`File not found ${src}`);
                
        //     }
        //     console.log(`DONE Moving ${src} to ${dst}...`);
        // }
        
        totaldone++;
    } catch (error) {
    // console.log(error);
    
        totalfail++;
    }
    
    //move to a dir that is the event id:
    console.log(`${totaldone+totalfail} of ${total} (${totalfail} failed)`);
    queue.release();
}

async function doProcess()
{
    let toprocess = [];

    //list all media:
    let media = await Media.find().limit(0);
    // let media = await Edit.find().limit(0);

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


console.log(require('dotenv').config());
// console.log(process.env);

// return;
doProcess();