var bars = require('../').Bars({
  extname: 'hbs'
});

var result = bars.renderFileSync(__dirname + '/index.hbs');

console.log(result);