
/**
 * Module dependencies.
 */

var assert = require('assert')
  , connect = require('express-session')
  , RiakStore = require('./')(connect);

var store = new RiakStore({
  bucket: 'randy_test',
  nodes: [ 'localhost:8087' ],
});

// #set()
store.set('123', { cookie: { maxAge: 2000 }, name: 'rks' }, function(err, ok){
  assert.ifError(err);
  assert.ok(!err, '#set() got an error');
  assert.ok(ok, '#set() is not ok');
  // #get()
  store.get('123', function(err, data){
    assert.ok(!err, '#get() got an error');
    // assert.deepEqual({ cookie: { maxAge: 2000 }, name: 'rks' }, data);

    // // #destroy()
    // store.destroy('123', function(){
    //   console.log('done');
    //   process.exit(0);
    // });

    throw new Error('Error in fn');
  });
});

// Give the tests time to run async
function shutdown_store() {
  store.shutdown();
};
setTimeout(shutdown_store, 6000);

process.once('uncaughtException', function (err) {
  assert.ok(err.message === 'Error in fn', err.message);
  shutdown_store();
});
