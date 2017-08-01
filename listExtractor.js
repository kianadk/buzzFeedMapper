var cheerio = require('cheerio');
var  rp = require('request-promise');

module.exports = async function(url){
  let html = await rp(url);
  try {
    let $ = cheerio.load(html);
    let places = []
    $('.subbuzz__number + .js-subbuzz__title-text').each((index, elem) => {
      places[index] = $(elem).children('a').text(); //TODO: deal with zero or multiple anchor tags
    })
    return places;
  }
  catch(e) {
    return e;
  }
}
