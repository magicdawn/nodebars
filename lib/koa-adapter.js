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

module.exports = function(default_exports, Bars) {

  default_exports.koa = function(options) {
    var b = new Bars(options);

    var viewRoot;
    if (options && typeof options.viewRoot === 'string') {
      viewRoot = options.viewRoot;
    } else {
      viewRoot = path.resolve('./views');
    }

    return function * (next) {
      
      var ctx = this;

      ctx.render = function(file, locals) {
        file = path.join(viewRoot, file);
        ctx.type = 'html';
        ctx.body = b.renderFileSync(file, locals);
      };

      yield next;
    };
  };
};