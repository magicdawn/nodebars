/**
 * module dependencies
 */

var Handlebars = require('handlebars');
var semver = require('semver');
var Bars = require('./lib/bars');

/**
 * export the default Bars instance
 */
exports = module.exports = new Bars();

/**
 * export `Bars` constructor
 */
exports.Bars = Bars.bind(null);

/**
 * export original Handlebars
 */
exports.Handlebars = Handlebars;


/**
 * use options to init express adapter
 *
 * @example
 *
 *  app.engine('.html',require('nodebars').express({
 *    enableCache: false
 *  }))
 */
exports.express = function(options) {
  var bars = new Bars(options);

  return function(file, locals, cb) {
    var err, res;

    try {
      res = bar.renderFileSync(file, locals);
    } catch (e) {
      err = e;
    }

    cb(err, res);
  };
};

/**
 * decide whether to load koa adapter
 * only when node verison > 1.0.0
 * load the koa adapter
 */
var v = process.version.substring(1); // v2.x.x -> 2.x.x
var iojs = semver.gt(v, '1.0.0')
if (iojs) {
  require('./lib/koa-adapter')(exports,Bars);
}