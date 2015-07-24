/**
 * module dependencies
 */
var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

/**
 * do exports
 */
exports = module.exports = Bars;

function Bars(options) {
  if (!(this instanceof Bars)) {
    return new Bars(options);
  }

  // hold an instance of Handlebars
  this.handlebars = Handlebars.create();

  // in case `undefined`
  options = options || {};

  // enableCache
  // 显示指定 > NODE_ENV > 默认false
  if (typeof options.enableCache === 'boolean') {
    this.enableCache = enableCache;
  } else if (process.env.NODE_ENV === 'production') {
    this.enableCache = true;
  } else {
    this.enableCache = false;
  }

  // extname
  if (typeof options.extname === 'string') {
    if (options.extname[0] !== '.') {
      options.extname = '.' + options.extname;
    }
    this.extname = options.extname;
  } else {
    this.extname = '.html'
  }

  // helpers
  this.registerHelper();
};

/**
 * read a file
 */
Bars.prototype.read = function(file) {
  file = path.resolve(file);

  if (!path.extname(file)) {
    file += this.extname;
  }

  if (this.enableCache && this.cache && this.cache[file]) {
    return this.cache[file];
  }

  // ret: file content
  var ret = fs.readFileSync(file, 'utf8');

  // save to cache ?
  if (this.enableCache) {
    var cache = this.cache || (this.cache = {});
    cache[file] = ret;
  }

  return ret;
};

/**
 * render a string with given locals
 */
Bars.prototype.render = function(tmpl, locals) {
  return this.handlebars.compile(tmpl)(locals);
}

/**
 * renderFileSync
 */
Bars.prototype.renderFileSync = function(file, locals) {
  file = path.resolve(file);
  locals = locals || {};

  // special locals for view file
  locals.__dirname = path.dirname(file);
  locals.__filename = file;

  // do template
  var tmpl = this.read(file);
  return this.render(tmpl, locals);
};

Bars.prototype.registerHelper = function() {
  var bars = this;
  var handlebars = this.handlebars;

  /**
   * {{#extend 'layouts/simpleLayout'}}
   *   {{#content 'body'}}
   *     body
   *   {{/content}}
   * {{/extend}}
   */
  handlebars.registerHelper('extend', function(name, options) {
    // check name
    if (!name) {
      throw new Error('{{#extend name}} , name is required');
    }

    var ctx = this;
    // if `registry` not exists, init it
    var stack = ctx.$$stack || (ctx.$$stack = []);
    stack.push(options.fn);

    // find layout file
    var layoutFile = path.join(ctx.__dirname, name);

    // do template
    var tmpl = bars.read(layoutFile);
    return bars.render(tmpl, this);
  });

  handlebars.registerHelper('block', function(name, options) {
    // check name
    if (!name) {
      throw new Error('{{#block name}} , name is required');
    }

    var ctx = this;
    var blocks = ctx.$$blocks || (ctx.$$blocks = {});

    // apply previous extend
    while (ctx.$$stack.length) {
      ctx.$$stack.pop()(ctx);
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
  });

  handlebars.registerHelper('content', function(name, options) {
    // check name
    if (!name) {
      throw new Error('{{#extend name}} , name is required');
    }

    var ctx = this;
    var blocks = ctx.$$blocks;
    var block = ctx.$$blocks[name] || (ctx.$$blocks[name] = []);

    var currentBlock = {
      mode: options.hash && options.hash.mode || 'replace',
      text: options.fn(ctx)
    };

    block.push(currentBlock);
  });

  /**
   * {{include '_includes/header'}}
   */
  handlebars.registerHelper('include', function(name, options) {
    var ctx = this;
    var file = path.join(ctx.__dirname, name);
    return bars.renderFileSync(file, ctx);
  });
};