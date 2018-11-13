// Windy
import './libBoot.js';
// Leaflet
import 'leaf/leaflet'
import 'markercluster/leaflet.markercluster';
import 'awesomemarkers/leaflet.awesome-markers';

import './../scss/styles.scss';

(async () => {

	const options = {

    // Required: API key
    key: process.env.WKEY,

    // Put additional console output
    verbose: true,

    // Optional: Initial state of the map
    lat: 38.09998264736481,
    lon: -95.95458984375,
    zoom: 5,
	}

	windyInit( options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff

    const { map } = windyAPI
    // .map is instance of Leaflet map
    
    const { store } = windyAPI
    // All the params are stored in windyAPI.store

    store.set('overlay', 'rain')

		let markers = L.markerClusterGroup({

			maxClusterRadius: 70,
			animateAddingMarkers: true,
			disableClusteringAtZoom: 12,
			showCoverageOnHover: false,

			iconCreateFunction: (cluster) => {

				let a = [], b = [], c = '',
						count = cluster.getChildCount(),
						options = {html: '<div><span>' + count + '</span></div>'};

				$.each(cluster.getAllChildMarkers(), (key, val) => {
					a.push(val.feature.properties.status)
				});

				$.each(cluster.getAllChildMarkers(), (key, val) => {
					b.push(val.feature.properties.cellular)
				});
				
				if (a.includes('offline')) {
					c = 'cluster-red'
				} else if (a.includes('online') && !b.includes('Active')) {
					c = 'cluster-gre'
				} else if (!a.includes('offline') && b.includes('Active')) {
					c = 'cluster-yel'
				}

				if (count < 10 ) {

					options.className = 'cluster-marker cluster-small ' + c
					options.iconSize = new L.point(30, 30)
				} else if (count >= 10 && count <= 50) {

					options.className = 'cluster-marker cluster-medium ' + c
					options.iconSize = new L.point(45, 45)
				} else if (count > 50) {

					options.className = 'cluster-marker cluster-large ' + c
					options.iconSize = new L.point(65, 65)
				}

				return L.divIcon(options);
			}
		});

		$.getJSON('geo.json', (data) => {

			let geoJsonLayer = L.geoJson(data, {
	  
		    pointToLayer: (feature, latlng) => {

		    	let cellular = feature.properties.cellular,
		    			status = feature.properties.status.includes('offline'),
		    			options = {prefix: 'fa', icon: 'home'};

		    		if (status) {
			    		options.markerColor = 'red'
			    	} else if (!status && cellular !== 'Active') {
			    		options.markerColor = 'green'
			    	} else if (!status && cellular === 'Active') {
			    		options.markerColor = 'orange'
			    	}
		    		
		      return L.marker(latlng, {
		      	icon: L.AwesomeMarkers.icon(options)
		      }).on('click', (e) => {

		      	var popup = L.popup()
				    .setLatLng(e.latlng)
				    .setContent(
				    	feature.properties.storeName + `</br>` +
				    	feature.properties.address + `</br>` +
				    	feature.properties.status + `</br>` +
				    	feature.properties.serial + `</br>`
				    	)
				    .openOn(map);

		      })
		    }  
		  });

		  markers.addLayer(geoJsonLayer);
		  map.fitBounds(markers.getBounds());
		  map.addLayer(markers);
		});
  });
})();

/*
const accessToken = 'pk.eyJ1Ijoic2Vub2oiLCJhIjoiY2o4eDZha2N6MXcyMjM4bjV6czN5Z2tqbiJ9.t0gGMa732U8ZiGbeihYG4w'

let map = L.map('map');

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token=' + accessToken, {
			attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> &copy; <a href="http://mapbox.com">Mapbox</a>',
		  maxZoom: 25,
		  id: 'mapbox.streets-basic'
		}).addTo(map);

$.getJSON('geo.json', function(data) {

	let markers = L.markerClusterGroup({

		maxClusterRadius: 50,
		animateAddingMarkers: true,
		disableClusteringAtZoom: 20,

		iconCreateFunction: function (cluster) {

			const markers = cluster.getAllChildMarkers(),
						childCount = cluster.getChildCount();

			let a = [],
					c = ' marker-cluster-';

			$.each(markers, function(key, val) {

				a.push(Object.values(val.feature.properties.uplinks).includes('Active'))

			});

			a.includes(false) ? c += 'large' : c += 'small';

			return L.divIcon({ 
				html: '<div><span>' + childCount + '</span></div>', 
				className: 'marker-cluster' + c, 
				iconSize: new L.point(40, 40) 
			});
		}
	});
  
  let geoJsonLayer = L.geoJson(data, {
    
    pointToLayer: (feature, latlng) => {

    	let a = [],
					c = ' marker-point-';
    	
    	a.push(Object.values(feature.properties.uplinks).includes('Active'))
    	a.includes(false) ? c += 'large' : c += 'small';

      return L.marker(latlng, {
      	icon: L.divIcon({

	    		className: 'marker-cluster' + c,
	    		iconSize: new L.point(20, 20) 

	    	})
      }).on('click', (e) => {

    		if (map.getZoom() > 15) {
    			
    			//let offset = map.options.crs.latLngToPoint(e.latlng, map.getZoom())
	  			//offset.x = offset.x + $('#map').width() * 0.25
	  			//map.flyTo(map.options.crs.pointToLatLng(offset, map.getZoom()), map.getZoom())
	  			map.flyTo(e.latlng, map.getZoom()).once('zoomend', () => {

	  				//console.log(e.latlng)

	  				var popup = L.popup({
	  					//minWidth: $('#map').width() * 0.6,
	  					closeOnClick: false,
			      	//offset: new L.point($('#map').width() * 0.375, 0),
			      	className: 'card'
	  				})
				    .setLatLng(e.latlng)
				    .setContent(
				    	`<div class="card-content">
				    		<span class="card-title">` + feature.properties.site  + `</span>` + 
				    		JSON.stringify(feature.properties.uplinks) + `<br/>` +
				    		feature.geometry.coordinates +
				    	`</div>`
				    	)
				    .openOn(map);
	  			})

    		} else {

    			//let offset = map.options.crs.latLngToPoint(e.latlng, 15)
	  			//offset.x = offset.x + $('#map').width() * 0.25
	  			//offset = map.options.crs.pointToLatLng(offset, 15)

	  			map.flyTo(e.latlng, 15).once('zoomend', () => {

	  				var popup = L.popup({
	  					//minWidth: $('#map').width() * 0.6,
	  					closeOnClick: false,
			      	//offset: new L.point($('#map').width() * 0.375, 0),
			      	className: 'card'
	  				})
					    .setLatLng(e.latlng)
					    .setContent(
					    	`<div class="card-content">
					    		<span class="card-title">` + feature.properties.site  + `</span>` + 
					    		JSON.stringify(feature.properties.uplinks) + `<br/>` +
					    		feature.geometry.coordinates +
					    	`</div>`
					    	)
					    .openOn(map);
	  			})
    		}
    	})
    }  
  });

  markers.addLayer(geoJsonLayer);
  map.addLayer(markers);
  map.fitBounds(markers.getBounds());
  map.doubleClickZoom.disable();
});
*/
