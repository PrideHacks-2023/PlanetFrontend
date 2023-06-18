<template>
    <div class="planetPage">
        <div class="center container">
            <div class="center">
                <h1 id="pageHeader">Welcome to the Planetary Support Page</h1>
                <canvas ref="globeCanvas" id='globe' width='500' height='500'></canvas>
            </div>
        </div>

        <div id="messages-container">
            <h2>Messages</h2>
            
            <!-- Top image -->
            <img id="topImage" src="../assets/top.png" alt="Top Image">

            <div id="messages">
                <div class="message">
                    <div class="message-header">
                        <h3 class="message-title">Message Title</h3>
                        <h4 class="message-location">Message Location</h4>
                    </div>
                    <div class="message-body">
                        <p class="message-content">Message Content</p>
                    </div>
                </div>
            </div>

            <!-- Bottom image -->
            <div id="bottomImageDiv">
                <img id="bottomImage" src="../assets/bottom.png" alt="Bottom Image">
            </div>
        </div>
    </div>
</template>
  
<script>
import planetaryjs from 'planetary.js'
import d3 from 'd3'
// import bottomImage from '../assets/bottom.png'
// import topImage from '../assets/top.png'
// import axios from 'axios'

const jsonFilePath = 'https://raw.githubusercontent.com/PrideHacks-2023/planetaryFiles/main/world-110m.json'

async function getMessages() {
    // // http://143.198.81.168:5000/msg
    // // Do a http get request to the backend using axios
    // // return the response

    // await axios.get('http://143.198.81.168:5000/msg', {
    //     headers: {
    //     }
    // }).then((response) => {
    //     if (response.data) {
    //         console.log(response.data)
    //     }
    // }).catch((error) => {
    //     console.log(error)
    // })

    // 

}

export default {
    name: "PlanetPage",
    components: {
    },
    methods: {

    },
    mounted() {
        const planet = planetaryjs.planet();

        // This plugin will automatically rotate the globe around its vertical
        // axis a configured number of degrees every second.
        function autorotate(degPerSec) {
            // Planetary.js plugins are functions that take a `planet` instance
            // as an argument...
            return function (planet) {
                var lastTick = null;
                var paused = false;
                planet.plugins.autorotate = {
                    pause: function () { paused = true; },
                    resume: function () { paused = false; }
                };
                // ...and configure hooks into certain pieces of its lifecycle.
                planet.onDraw(function () {
                    if (paused || !lastTick) {
                        lastTick = new Date();
                    } else {
                        var now = new Date();
                        var delta = now - lastTick;
                        // This plugin uses the built-in projection (provided by D3)
                        // to rotate the globe each time we draw it.
                        var rotation = planet.projection.rotate();
                        rotation[0] += degPerSec * delta / 1000;
                        if (rotation[0] >= 180) rotation[0] -= 360;
                        planet.projection.rotate(rotation);
                        lastTick = now;
                    }
                });
            };
        }

        function worldPings(config) {
            var pings = [];
            config = config || {};

            var addPing = function (lng, lat, options) {
                options = options || {};
                options.color = options.color || config.color || 'white';
                options.angle = options.angle || config.angle || 5;
                options.ttl = options.ttl || config.ttl || 2000;
                var ping = { time: new Date(), options: options };
                if (config.latitudeFirst) {
                    ping.lat = lng;
                    ping.lng = lat;
                } else {
                    ping.lng = lng;
                    ping.lat = lat;
                }
                pings.push(ping);
            };

            var drawPings = function (planet, context, now) {
                var newPings = [];
                for (var i = 0; i < pings.length; i++) {
                    var ping = pings[i];
                    var alive = now - ping.time;
                    if (alive < ping.options.ttl) {
                        newPings.push(ping);
                        drawPing(planet, context, now, alive, ping);
                    }
                }
                pings = newPings;
            };

            var drawPing = function (planet, context, now, alive, ping) {
                var alpha = 1 - (alive / ping.options.ttl);
                var color = d3.rgb(ping.options.color);
                color = "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
                context.strokeStyle = color;
                var circle = d3.geo.circle().origin([ping.lng, ping.lat])
                    .angle(alive / ping.options.ttl * ping.options.angle)();
                context.beginPath();
                planet.path.context(context)(circle);
                context.stroke();
            };

            return function (planet) {
                planet.plugins.worldPings = {
                    add: addPing,
                    testFn: function () { console.log("does it work"); },
                };

                planet.onDraw(function () {
                    var now = new Date();
                    planet.withSavedContext(function (context) {
                        drawPings(planet, context, now);
                    });
                });
            };
        }

        planet.loadPlugin(autorotate(10));

        planet.loadPlugin(planetaryjs.plugins.earth({
            topojson: { file: jsonFilePath },
            // // Default colors
            // oceans: { fill: '#000080' },
            // land: { fill: '#339966' },
            // borders: { stroke: '#008000' }
            // // Light colors
            // oceans: { fill: '#449AB3' },
            // land: { fill: '#4EB591' },
            // borders: { stroke: '#008000' }
            // // Dark colors
            oceans: { fill: '#091A66' },
            land: { fill: '#0B5936' },
            borders: { stroke: '#0C7A3D' }
        }));


        planet.loadPlugin(planetaryjs.plugins.drag({
            // Dragging the globe should pause the
            // automatic rotation until we release the mouse.
            onDragStart: function () {
                this.plugins.autorotate.pause();
            },
            onDragEnd: function () {
                this.plugins.autorotate.resume();
            }
        }));

        planet.projection.rotate([100, -10, 0]);
        planet.projection.scale(250);
        planet.projection.translate([250, 250]);


        planet.loadPlugin(worldPings({
            color: 'yellow', ttl: 5000, angle: 10
        }));

        const canvas = this.$refs.globeCanvas;

        planet.draw(canvas);


        // Every few hundred milliseconds, we'll draw another random ping.
        var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
        setInterval(function () {
            var lat = Math.random() * 170 - 85;
            var lng = Math.random() * 360 - 180;
            var color = colors[Math.floor(Math.random() * colors.length)];
            planet.plugins.worldPings.add(lng, lat, { color: color, ttl: 2000, angle: Math.random() * 10 });

        }, 200);

        getMessages();

    }
};




</script>
  
<style scoped>
/* Sci-fi techno hologram style */
#pageHeader {
    text-align: center;
    color: #6ccfcf;
    font-family: monospace;

}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
}

.planetPage {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

#messages-container {
    width: 30vw;
    height: 80vh;
    text-align: left;
    margin: 50px;
    padding: 20px;

    color: #6ccfcf;
    font-family: monospace;

    background: #043e624c;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    border-radius: 1rem;
}

#topImage {
    width: 20vw;
    height: 20px;
    /* border-radius: 1rem;
    background: #1404624c;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px); */
}

#bottomImageDiv {
    /* Right align */
    width: 30vw;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-direction: column;
    padding-top: 15px;
}

#bottomImage {
    width: 20vw;
    height: 20px;
}

#messages {
    height: 85%;
    overflow-y: scroll;
    overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #058ea0a4; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

.message {
    margin-bottom: 10px;
    border-radius: 1rem;
    border-color: #6ccfcf88;
}

</style>