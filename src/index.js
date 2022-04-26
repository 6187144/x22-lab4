import "./css/styles.css";
import layoutTemplate from "./hbs/layout.hbs";
import mapTemplate from "./hbs/map.hbs";


import module from "./js/module";


const appEl = document.getElementById("app");


const siteInfo = { title: "Click me to re-center" };
window.document.title = siteInfo.title;

appEl.innerHTML = layoutTemplate(siteInfo);
const contentEl = document.getElementById("content-pane");

contentEl.innerHTML = mapTemplate();


mapboxgl.accessToken = "pk.eyJ1IjoiNjE4NzE0NCIsImEiOiJjbDJhZmxldmYwMHdoM2NwN2cxNGZkcjVnIn0.nk5Yfg6OGIE8gS3F_XA0QQ";
let map;


let init = async function() {
    mapInit();

    document.getElementById("pop").addEventListener("click", () => {
        if (map != null) {
            map.appSettings.user.marker.togglePopup();
        }
    });
    document.getElementById("title").addEventListener("click", () => {
        if (map != null) {
            map.flyTo({ center: map.appSettings.user.position }, );
        }
    });
}

let mapInit = async function() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/6187144/cl2afv12m000c14p5qtma8qwz',
        center: [-75.765, 45.456],
        zoom: 10
    });

    map.appSettings = {
        user: {
            position: [0, 0]
        }
    };


    if ('permissions' in navigator) {
        let perm = await navigator.permissions.query({ name: 'geolocation' })
        if (perm.state == "granted") {
            if ('geolocation' in navigator) {
                // geo
                navigator.geolocation.getCurrentPosition(function(position) {
                    let pos = position.coords;
                    //console.log(pos.longitude, pos.latitude);

                    onLocateUser([pos.longitude, pos.latitude]);
                });


            } else {
                // no geo
                serverGeolocate();
            }
        } else {
            serverGeolocate();
        }
    } else {
        serverGeolocate();
    }


}


let serverGeolocate = async function() {
    let serverGeo = await (await fetch("http://localhost:3000/api/location")).json();
    //console.log(serverGeo);
    onLocateUser(
        [serverGeo.lng, serverGeo.lat]
    );
}

let onLocateUser = function(location) {
    map.appSettings.user.position = location;
    map.setCenter(location);
    map.appSettings.user.marker = new mapboxgl.Marker({ color: "#aa1acd" })
        .setLngLat(location)
        .setPopup(new mapboxgl.Popup().setHTML("<h3>Here I popped!</h3>"))
        .addTo(map);
}

init();