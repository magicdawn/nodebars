# nodebars
Handlebars on node.

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

it's same to [handlebars-layouts](https://github.com/shannonmoeller/handlebars-layouts). 
But you can just give a relative path for a layout file. like `./layout`. 
So that's the difference.

## API

### normal node application
### express
### koa

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