module.exports = {

    LIVEMODE: false,
  
    LOCALONLY: true,

    LOGINCODE: '',
  
    name: 'Indaba',
    bootlegger: false,
    ifrc: false,
  
    FAKES3URL: 'http://10.10.10.1/upload/',

    FAKES3URL_TRANSCODE: 'http://10.10.10.1/upload/transcode/upload/',

    NOTRENDERTAGGED: true,
  
    port: 1337,
  
    beta: false,
  
    hostname: 'localhost',
  
    admin_email: ['localadmin@indaba.dev'],
  
    IOSLINK: 'https://itunes.apple.com/us/app/bootlegger/id1053074626?ls=1&mt=8',
  
    PLAYLINK: 'https://play.google.com/store/apps/details?id=uk.ac.ncl.di.bootlegger',
  
    SHOOT_LIMIT: 100,
  
    AWS_ACCESS_KEY_ID: '',
  
    AWS_SECRET_ACCESS_KEY: '',
  
    CURRENT_SYNCTRAY_KEY: 'replaceme',
  
    CURRENT_MOBILE_KEY_IOS: 'replaceme',
  
    CURRENT_MOBILE_KEY_PLAY: 'replaceme',
  
    CURRENT_EDIT_KEY: 'replaceme',
  
    central_url: 'http://localhost',
  
    master_url: 'http://10.10.10.1',
  
    S3_BUCKET: 'bootleggerlive',
  
    S3_BUCKET_TRANSCODE: 'bootleggertrans',
  
    S3_REGION: 'eu-west-1',
  
    // S3_CLOUD_URL: 'http://'+process.env.MYIP+'/upload/',
    S3_CLOUD_URL: '',
  
    // S3_TRANSCODE_URL: 'http://'+process.env.MYIP+'/upload/transcode/upload/',
    S3_TRANSCODE_URL: '',
  
    ELASTIC_PIPELINE: '1438958021173-91xlqc',
  
    HOMOG_PRESET: '1437577812457-m33jon',
  
    PREVIEW_PRESET: '1351620000001-000040',
  
    BEANSTALK_HOST: 'beanstalk',
  
    BEANSTALK_PORT: '11300',
  
    CLOUDFRONT_KEY: '',
  
    CLOUDFRONT_KEYFILE: '',
  
    email: {
      SENDGRID_ID: '',
      SENDGRID_TEMPLATE: ''
    },
  
    dropbox_clientid: '',
  
    dropbox_clientsecret: '',
  
    GOOGLE_ANALYTICS:'',
  
    google_clientid: '',
  
    google_clientsecret: '',
  
    GOOGLE_MAPS_KEY: '',
  
    connections: {
  
      mongodb: {
  
        adapter:
          'sails-mongo',
  
        url:
          'mongodb://mongo:27017/bootlegger',
  
        schema:
          false
      }
  
    },
  
    session: {
  
      secret:
        'replaceme',
  
      adapter:
        'redis',
  
      host:
        'redis',
  
      port:
        6379,
  
      db:
        0,
  
      ttl: 90 * 24 * 60 * 60 * 1000,
  
      disableTTL: true,
  
      url:
        'redis://redis/0',
  
      cookie: {
  
        maxAge:
          90 * 24 * 60 * 60 * 1000
  
      }
  
    },
  
    sockets: {
  
      transports: [
  
        'websocket'
  
      ],
  
      adapter:
        'socket.io-redis',
  
      host:
        'redis',
  
      port:
        6379,
  
      beforeConnect:
        false,
  
      origins:
        '*:*',
  
      heartbeats:
        true,
  
      'close timeout':
        20,
  
      'heartbeat timeout':
        16,
  
      'heartbeat interval':
        8,
  
      'polling duration':
        20,
  
      'flash policy port':
        10843,
  
      'destroy buffer size':
        '10E7',
  
      'destroy upgrade':
        true,
  
      'browser client':
        true,
  
      'browser client cache':
        true,
  
      'browser client minification':
        false,
  
      'browser client etag':
        false,
  
      'browser client expires':
        315360000,
  
      'browser client gzip':
        false,
  
      'browser client handler':
        false,
  
      'match origin protocol':
        false,
  
      resource:
        '/socket.io'
  
    },
  
    bootstrapTimeout: 5000
  
  }