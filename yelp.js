'use strict';

const yelp = require('yelp-fusion');

const key = 'YELP_KEY';

const client = yelp.client(key);

module.exports = async function(names) {
  var results = [];
  for(var i = 0; i < names.length; i++) {
      const searchRequest = { term: names[i], location: 'new york city, NY'}
      results[i] = client.search(searchRequest).then(response => {
        const firstResult = response.jsonBody.businesses[0];
        return {coordinates: firstResult.coordinates, name: firstResult.name, link: firstResult.url}
      }).catch(e => {
        console.log(e);
      });  
  }
  var answer = await Promise.all(results);
  return answer;
}