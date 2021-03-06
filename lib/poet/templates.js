var _ = require('underscore'),
    showdown = require('showdown'),
    jade = require('jade').compile;
  
var blogParser = require('./blog-md-parser'),
    parser = new showdown.converter({extensions: [blogParser]});

/**
 * Returns a fresh copy of default templates
 *
 * @returns {Object}
 */

function createTemplates () {
  return {
    jade: function (string) { return jade(string)(); },
    markdown: function (string) { return parser.makeHtml(string); },
    md: function (string) { return parser.makeHtml(string); }
  };
}
module.exports = createTemplates;
