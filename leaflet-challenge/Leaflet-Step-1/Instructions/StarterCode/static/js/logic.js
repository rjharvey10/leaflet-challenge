// API link stored as var 
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
function markerWidth(magnitude) {
    return magnitude*25000;
}
function markerColor(magnitude) {
    if (magnitude<1){
        return "#FFA500";
    }else if (magnitude<2) {
        return "#ffd700";
    }else if (magnitude<3) {
        return "#FFFF00";
    } else if (magnitude <4) {
        return "#9ACD32";
    } else if (magnitude<5) {
        return "#ADFF2F";
    } else {
        return "#FF0000";
    };
}
d3.json(link, function(data) {
    createFeatures(data.features);
  });
  function createFeatures(quakeData) {
    var quakes = L.geoJSON(quakeData, {
   eachFeature : function (feature, layer) {
  
      layer.bindPopup("<h2>" + feature.properties.place +
        "</h2><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.magnitude + "</p>")
      },     pointToLayer: function (feature, latlng) {
        return new L.circle(latlng,
          {radius: markerSize(feature.properties.magnitude),
          fillColor: markerColor(feature.properties.magnitude),
          fillOpacity: 1.5,
          stroke: false,
      })
    }
    });
    createMap(quakes);
}

function createMap(quakes) {
    var mapDark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
     var mapSatelite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  var mapBase = {
    "Satelite Map": mapSatelite,
    "Dark Map": mapDark
  };
  var mapOverlayTop = {
    Earthquakes: quakes
  };
  var myMap = L.map("map", {
    center: [34.0522,-118.2437],
    zoom: 4,
    layers: [mapSatelite, quakes]
  });
  L.control.layers(mapBase, mapOverlayTop, {
    collapsed: false
  }).addTo(myMap);
  var legend = L.control({position: 'topright'});
  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
      return div;
  };
  legend.addTo(myMap);
}