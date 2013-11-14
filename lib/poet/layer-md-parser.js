/**
 * Custom Showdown extension
 * Defines custom Layer specific markdown syntax
 */

var cheerio = require('cheerio');

(function() {

  var TARGET_BLANK = 'target="_blank" ',
      S3_BASE_URL = 'http://static.layer.com/';

  var layer = function() {
    return [

      // match HTML links, add target _blank if external
      { type: 'output',
        filter: function(text) {
          return text.replace(/<a[\S\s]*?<\/a>/gim, function(match) {
            return isUrlExternal(match) && !hasLayerDomain(match) ? match.substring(0, 3)+TARGET_BLANK+match.substring(3) : match;
          });
        }
      },

      // prefix self hosted image urls
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

  function replaceImgSrc(match) {
    var $ = cheerio.load(match);

    var src = $('img').attr('src');
    $('img').attr('src', S3_BASE_URL+src);
    
    return $.html('img');
  }

  if (typeof module !== 'undefined') module.exports = layer;
}());