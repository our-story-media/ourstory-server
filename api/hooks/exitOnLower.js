module.exports = function(sails){
    return {
        defaults:{
            __configKey__:{
                name:'exitOnLower',
                wait:10000,
                active: true
            }
        },
        initialize: function(cb){

            sails.on('lower',function(){
                setTimeout(function(){
                    process.exit(0);
                })
            },1000);

            return cb();

        }
    }
}