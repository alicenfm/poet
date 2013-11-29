/**
 * Custom Showdown extension
 */

var cheerio = require('cheerio');

(function() {

  var S3_BASE_URL = 'http://static.layer.com/web/blog/';

  var layer = function() {
    return [

      // match HTML links, add target _blank if external
      { type: 'output',
        filter: function(text) {
          return text.replace(/<a[\S\s]*?<\/a>/gim, function(match) {
            return isUrlExternal(match) && !hasLayerDomain(match) ? targetBlank(match) : match;
          });
        }
      },

      // parse hosted image urls
      { type: 'output',
        filter: function(text) {
          return text.replace(/<img[\S\s]*?>/gim, function(match) {
            return !isUrlExternal(match) ? replaceImgSrc(match) : match;
          });
        }
      }
    ];
  };

  // check if link external, non layer.com
  function isUrlExternal(match) {
    return (match.indexOf('http://') !== -1 || match.indexOf('https://') !== -1);
  }
  // check if contains layer.com domain
  function hasLayerDomain(match) {
    return match.indexOf('layer.com') !== -1;
  }

  // add target _blank to link
  function targetBlank(match) {
    var $ = cheerio.load(match);
    $('a').attr('target', '_blank');
    return $.html('a');
  }
  // replace our own amazon hosted image src
  function replaceImgSrc(match) {
    var $ = cheerio.load(match);
    $('img').attr('src', S3_BASE_URL+$('img').attr('src'));
    return $.html('img');
  }

  if (typeof module !== 'undefined') module.exports = layer;
}());