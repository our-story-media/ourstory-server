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
                    process.exit(3);
                })
            },5000);

            return cb();

        }
    }
}