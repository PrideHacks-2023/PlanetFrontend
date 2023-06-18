<template>
    <h3 id="pageHeader">This is the Planet Support Page</h3>
    <canvas ref="globeCanvas" id='globe' width='500' height='500'></canvas>
</template>
  
<script>
import planetaryjs from 'planetary.js'
import d3 from 'd3'

const jsonFilePath = 'https://raw.githubusercontent.com/PrideHacks-2023/planetaryFiles/main/world-110m.json'

// async function getMessages() {
//     const response = await fetch('http://localhost:5000/messages');
//     const data = await response.json();
//     return data;
// }


export default {
    name: "PlanetPage",
    components: {
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

    }
};




</script>
  
<style scoped></style>