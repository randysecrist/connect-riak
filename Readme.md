# Connect Riak

connect-riak is a Riak session store implemented as middleware for [connect](https://github.com/senchalabs/connect) & [expressjs](https://github.com/visionmedia/express) backed by [nodiak](https://github.com/nathanaschbacher/nodiak).  Any version of Riak will work.

For extra bang for your buck; see automatic key expiration using [bitcask](http://docs.basho.com/riak/latest/ops/advanced/backends/bitcask).

 connect-riak `>= 0.0.1` support only connect `>= 2.9.2`.

## Installation

	  $ npm install connect-riak

## Options
  
  - `client` An existing nodiak client object you normally get from `riak.getClient()`
  - `bucket` Riak bucket to use defaulting to `expressjs_sessions`
  - `scheme` Riak scheme ('http'|'https')
  - `host` Riak server hostname
  - `port` Riak server tcp port #
  - ...    Remaining options passed to the riak `getClient()` method.

## Usage

To use with Connect:

    var connect = require('connect'),
        RiakStore = require('connect-riak')(connect);

    connect().use(connect.session({
      secret: 'keyboard cat',
      store: new RiakStore(options)
    }));
 
To use with ExpressJS:
    
    var RiakStore = require('connect-riak')(express);
    
    // Configure Middleware
    app.use(express.session({
      store: new RiakSessionStore({
        bucket: 'app_session_bucket',
        scheme: 'http',
        host: 'localhost',
        port: 8098,
      }),
      secret: 'keyboard cat'
    }));
    
## API Docs



# License

  MIT
