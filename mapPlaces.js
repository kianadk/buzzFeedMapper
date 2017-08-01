var map;
var service;

function getPlaces(){
  //haven't put in a URL yet
  if(window.location.search === '') {
    return null;
  }

  url = '/extractList' + window.location.search; 
  return fetch(url).then( (response) => {
    return response.json();
  }).then( (places) => {
    return places;
  })
}

function createFillerContent() {
  var about = document.createElement('div');
  about.classList.add('about');
  var aboutText = document.createElement('p');
  about.appendChild(aboutText);
  aboutText.innerHTML = 'BuzzFeed lists can be overwhelming and hard to plan around. Use this handy tool to make your life easier! Just paste in the URL of the relevant article, click submit, and watch the magic happen.';
  document.getElementById('content').appendChild(about);

}

async function initMap() {
  var nyc = {lat: 40.713, lng: -74.001};

  map = new google.maps.Map(document.getElementById('map'), {
    center: nyc,
    zoom: 8
  });

  var places = await getPlaces();

  //no BuzzFeed article entered yet
  if(places === null) {
    createFillerContent();
    return;
  }

  var content = document.getElementById('content');
  content.classList.add('loader');

  service = new google.maps.places.PlacesService(map);

  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  var body = {data: places};
  console.log(body);
  var info = await fetch('/yelp', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });
  info = await info.json();
  console.log(info);
  createMarkers(info);
}

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById('content');
  var list = document.createElement('div');
  list.classList.add('list');

  for(var i = 0; i < places.length; i++) {
    var coords = {lat: places[i].coordinates.latitude, lng: places[i].coordinates.longitude}

    //set up tooltip
    let contentString = '<h4><a href="' + places[i].link + '">' + places[i].name + '</a></h4>';
    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    let marker = new google.maps.Marker({
      map: map,
      title: places[i].name,
      position: coords
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    })

    var listItem = createItem(places[i].name, (i + 1), places[i].link);
    listItem.addEventListener('mouseenter', function() {
      infowindow.open(map, marker);
    })
    listItem.addEventListener('mouseleave', function() {
      infowindow.close(map, marker);
    })

    list.appendChild(listItem);

    bounds.extend(coords);

    map.fitBounds(bounds);
  }

  placesList.classList.remove('loader');
  placesList.appendChild(list);
}

function createItem(name, index, yelpLink) {
  var listItem = document.createElement('div');
  listItem.classList.add('listItem');
  var label = document.createElement('h4');
  label.classList.add('listLabel');
  label.innerHTML = index + '. ' + name;
  listItem.appendChild(label);
  return listItem
}

