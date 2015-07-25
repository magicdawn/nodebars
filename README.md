# nodebars
Handlebars on node.
![](https://img.shields.io/travis/magicdawn/nodebars/master.svg)
![](https://img.shields.io/coveralls/magicdawn/nodebars/master.svg)
![](https://img.shields.io/npm/v/nodebars.svg)
![](https://img.shields.io/npm/dm/nodebars.svg)
![](https://img.shields.io/npm/l/nodebars.svg)

## Install
```sh
npm i nodebars --save
```

## Example

```html
{{#extend "./layout"}}
  {{content "body" mode="append"}}
  {{/content}}
{{/entend}}
```

Following helpers are supported:

- extend/block/content
- include

it's same to [handlebars-layouts](https://github.com/shannonmoeller/handlebars-layouts). 
But you can just give a relative path for a layout file. like `./layout`. 
So that's the difference.

## API

### normal node application
```js
// the default Bars instance
var nodebars = require('nodebars');

// Bars class
var Bars = nodebars.Bars;

string result = Bars#renderFileSync(file,locals);
```

#### Bars class init options

- enableCache : whether enableCache for file reading
- extname : the default file extension, default to `.html`


### express
```js
var app = require('express')();
app.engine('.html',require('nodebars').express({
  enableCache: false,
  extname: '.html'
}));
```

### koa
```js
var app = koa()
app.use(bars.koa({
  viewRoot: './views',
  extname: '.html', // default
  enableCache: false // default
}));
```

## License

most code are taken from [handlebars-layouts](https://github.com/shannonmoeller/handlebars-layouts)

### handlebars-layouts License
```
MIT © 2015 Shannon Moeller me@shannonmoeller.com
```

### project License
```
MIT © 2015 Magicdawn http://magicdawn.mit-license.org
```