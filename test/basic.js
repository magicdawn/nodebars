var should = require('should');
var bars = require('../');
bars.extname = '.hbs';
var cheerio = require('cheerio');

describe('basic functions & helpers', function() {

  it('Bars#render should be ok', function() {
    var s = bars.render('name = {{name}}, age = {{age}}', {
      name: 'foo',
      age: '18'
    });
    s.should.equal('name = foo, age = 18');
  });

  it('Bars#renderFileSync should be ok', function() {
    var s = bars.renderFileSync(__dirname + '/templates/basic.hbs', {
      name: 'foo',
      age: 18
    });

    var $ = cheerio.load(s);
    $('.name').text().should.equal('foo');
    $('.age').text().should.equal('18');
  });

  it('construct without new should be ok', function() {
    bars.Bars().should.exist;
  });
});

describe('include should be ok', function() {

  it('simple include should be ok', function() {
    var s = bars.renderFileSync(__dirname + '/templates/test_include', {
      a: 'hello',
      b: 'world'
    });

    s.should.equal('hello\nworld');
  });

  it('nest include should be ok too', function() {
    var s = bars.renderFileSync(__dirname + '/templates/nest_include', {
      a: 'hello',
      b: 'world'
    });

    s.should.equal('hello\nworld');
  });
});

describe('extend block/content should be ok', function() {
  it('simple extend should be ok', function() {
    var s = bars.renderFileSync(__dirname + '/templates/test_layout');
    var $ = cheerio.load(s);

    $('title').text().should.equal('test-layout - Awesome Site');
    $('body').children().length.should.equal(1);
  });

  it('nest layout should be ok', function() {
    var s = bars.renderFileSync(__dirname + '/templates/nest_layout');
    var $ = cheerio.load(s);

    $('title').text().should.equal('nest-layout - Awesome Site');
    $('body').children().length.should.equal(2);
  });
});

describe('express/koa support should be ok', function() {
  it('express support should be ok', function() {
    // TODO: add express test
  });

  it('koa support should be ok', function() {
    // TODO: add koa test
  });
});