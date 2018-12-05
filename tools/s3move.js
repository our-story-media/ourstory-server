const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const shared = require('./shared.js');
const Sema = require('async-sema');
const queue = new Sema(10, { capactiy: 3000 })
const Util = require('util');
const _ = require('lodash');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bootlegger');

async function process()
{
    await Promise.resolve();

    //list all media:




    //move to a dir that is the event id:



}

console.log(await process());