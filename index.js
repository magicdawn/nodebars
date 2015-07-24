/**
 * module dependencies
 */

var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var semver = require('semver');

/**
 * do exports
 */
var bars = module.exports;

// original Handlebars
bars.Handlebars = Handlebars;

/**
 * decide whether to enable cache
 */
bars.enableCache = false;
bars.cache = {};

var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  bars.enableCache = true; // only enable in production environment
}

/**
 * 后缀
 */
var _extname = '.html';
bars.extname = function(val) {
  if (val) { // set
    if (val[0] !== '.') {
      val = '.' + val;
    }
    _extname = val;
  } else { // get
    return _extname;
  }
};

/**
 * read/render/renderFileSync
 */
bars.read = function(file) {
  file = path.resolve(file);
  if (!path.extname(file)) {
    file += _extname;
  }

  if (bars.enableCache && bars.cache[file]) {
    return bars.cache[file];
  }

  // ret: file content
  var ret = fs.readFileSync(file, 'utf8');

  // save to cache ?
  if (bars.enableCache) {
    var cache = bars.cache || (bars.cache = {});
    cache[file] = ret;
  }

  return ret;
};

bars.render = function(tmpl, locals) {
  return Handlebars.compile(tmpl)(locals);
};

bars.renderFileSync = function(file, locals) {
  file = path.resolve(file);
  locals = locals || {};

  // special locals for view file
  locals.__dirname = path.dirname(file);
  locals.__filename = file;

  // do template
  var tmpl = bars.read(file);
  return bars.render(tmpl, locals);
};

/**
 * hepers
 */
Handlebars.registerHelper({
  extend: function(name, options) {
    var ctx = this;

    // if `registry` not exists, init it
    var stack = ctx._stack || (ctx._stack = []);
    stack.push(options.fn);

    // find layout file
    var layoutFile = path.join(ctx.__dirname, name);

    // do template
    var tmpl = bars.read(layoutFile);
    return bars.render(tmpl, this);
  },

  block: function(name, options) {
    var ctx = this;
    var blocks = ctx._blocks || (ctx._blocks = {});

    // apply previous extend
    while (ctx._stack.length) {
      ctx._stack.pop()(ctx);
    }

    // current block
    var ret = options.fn(ctx);

    return blocks[name].reduce(function(ret, item) {
      switch (item.mode) {
        case 'replace':
          return item.text;
        case 'prepend':
          return item.text + ret;
        case 'append':
          return ret + item.text;
        default:
          return ret;
      }
    }, ret);
  },

  content: function(name, options) {
    var ctx = this;
    var blocks = ctx._blocks;
    var block = ctx._blocks[name] || (ctx._blocks[name] = []);

    var currentBlock = {
      mode: options.hash && options.hash.mode || 'replace',
      text: options.fn(ctx)
    };

    block.push(currentBlock);
  }
});

/**
 * express adapter
 */
bars._express = function(file, locals, callback) {
  var ret, err;
  try {
    ret = bars.renderFileSync(file, locals);
  } catch (e) {
    err = e;
  }

  callback(err, ret);
};

/**
 * pass some options to express adapter
 */
bars.express = function(options) {
  options = options || {};

  if (typeof options.enableCache === 'boolean') {
    bars.enableCache = options.enableCache;
  }

  if (typeof options.extname === 'string') {
    bars.extname(options.extname);
  }

  return bars._express;
};

var v = process.version.substring(1);
var iojs = semver.gt(v, '1.0.0')
if (iojs) {
  require('./koa-adapter');
}