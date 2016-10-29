/*!
 * Connect - Riak Sessions
 * Copyright(c) 2013 Randy Secrist <randy.secrist@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var riak = require('basho-riak-client')
  , debug = require('debug')('connect:riak')
  , async = require('async');

/**
 * Return the `RiakStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */

module.exports = function(connect){

  /**
   * Connect's Store.
   */

  var Store = connect.Store;

  /**
   * Initialize RiakStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function RiakStore(options) {
    var self = this;

    options = options || {};
    Store.call(this, options);
    this.bucket = null == options.bucket
      ? 'expressjs_sessions'
      : options.bucket;

    debug('USING %s', options.nodes);
    this.client = options.client || new riak.Client(options.nodes);
  };

  /**
   * Inherit from `Store`.
   */

  RiakStore.prototype.__proto__ = Store.prototype;

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */

  RiakStore.prototype.get = function(sid, fn){
    debug('GET "%s"', sid);
    // var my_obj = this.client.bucket(this.bucket).objects.new(sid);
    // my_obj.fetch(function(err, obj) {
    //   debug('GOT %s', obj.data);
    //   try {
    //     result = JSON.parse(obj.data);
    //   }
    //   catch (err) {
    //     result = null;
    //   }
    //   return fn(null, result);
    // });
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  RiakStore.prototype.set = function(sid, sess, fn){
    riak_client = this.client;
    session_bucket = this.bucket;

    try {
      var maxAge = sess.cookie.maxAge
        , ttl = this.ttl
        , sess = JSON.stringify(sess);

      ttl = ttl || ('number' == typeof maxAge
          ? maxAge / 1000 | 0
          : 86400); // oneDay in seconds

      debug('SET "%s" ttl:%s %s', sid, ttl, sess);
      var storeFuncs = [];
      storeFuncs.push(function (async_cb) {
        riak_client.storeValue({
            bucket: session_bucket,
            key: sid,
            value: sess
          },
          function(err, rslt) {
            async_cb(err, rslt);
          }
        );
      });
      async.parallel(storeFuncs, function (err, rslts) {
        if (err) {
          throw new Error(err);
        }
      });
    }
    catch (err) {
      fn && fn(err);
    }
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */

  RiakStore.prototype.destroy = function(sid, fn){
    debug('DESTROY "%s"', sid);
    // var my_obj = this.client.bucket(this.bucket).objects.new(sid);
    // my_obj.delete(function(err, obj) {
    //     debug('DESTROY complete');
    // });
  };

  /**
   * Shutdown the Riak client
   * @api public
   */

  RiakStore.prototype.shutdown = function(fn){
    this.client.stop(function (err, rslt) {
      process.exit();
    });
  };

  return RiakStore;
};
