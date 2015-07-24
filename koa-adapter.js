var bars = require('./index');
var path = require('path');


/**
 * koa adapter
 *
 * var app = koa()
 * app.use(bars.koa({
 *   viewRoot: './views',
 *   extname: '.html', // default
 *   enableCache: false // default
 * }));
 * 
 */
bars.koa = function(options) {

  options = options || {};

  if (typeof options.enableCache === 'boolean') {
    bars.enableCache = options.enableCache;
  }

  if (typeof options.extname === 'string') {
    bars.extname(options.extname);
  }

  var viewRoot = path.resolve(options.viewRoot);

  return function * (next) {
    var ctx = this;
    ctx.render = function(file, locals) {
      file = path.join(viewRoot, file);
      ctx.body = bars.renderFileSync(file, locals);
    };

    yield next;
  };
};