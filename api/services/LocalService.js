var fivebeans = require('fivebeans');
var client = null;

module.exports = {

    transcode: function (file) {
        //trigger the transcode

        var payload = {
            input: file,
            output: 'preview_'+file
        };

        //spits out a file which is in the transcode folder, named preview_<path>
        console.log('Submitting transcode',file);
        if (client == null) {
            client = new fivebeans.client(sails.config.BEANSTALK_HOST, sails.config.BEANSTALK_PORT);
            client
                .on('connect', function () {
                    // client can now be used
                    client.use("edits", function (err, tubename) {
                        sails.winston.info("Using the [edits] beanstalk tube");
                        client.put(10, 0, 1000000000, JSON.stringify(['edits', { type: 'transcode', payload: payload }]), function (err, jobid) {
                            if (!err)
                                sails.winston.info("Transcode submitted");
                            else
                                sails.winston.error(err);
                        });
                    });
                })
                .on('error', function (err) {
                    // connection failure
                    sails.winston.error(err);
                })
                .on('close', function () {
                    // underlying connection has closed
                })
                .connect();
        }
        else {
            client.use("edits", function (err, tubename) {
                client.put(10, 0, 1000000000, JSON.stringify(['edits', { type: 'transcode', payload: payload }]), function (err, jobid) {
                    if (!err)
                        sails.winston.info("Transcode submitted");
                    else
                        sails.winston.error(err);
                });
            });
        }
    }

}