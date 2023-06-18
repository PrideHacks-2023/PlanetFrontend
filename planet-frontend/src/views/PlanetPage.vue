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

            <!-- Display messages retrived from api -->
            <div id="messages">

                <!-- <div class="message">
                    <div class="message-header">
                        <h3 class="message-title">Message Title</h3>
                        <h4 class="message-location">Message Location</h4>
                    </div>
                    <div class="message-body">
                        <p class="message-content">Message Content</p>
                    </div>
                    <div class="message-footer">
                        <p class="message-time">Message timestamp</p>
                    </div>
                    
                </div> -->
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
import axios from 'axios'

// import the style from './PlanetPage.css'
import './PlanetPage.css'


const jsonFilePath = 'https://raw.githubusercontent.com/PrideHacks-2023/planetaryFiles/main/world-110m.json'

var messageInterval = null;

var numMessages = 0;

async function getMessages(planet) {
    // http://143.198.81.168:5000/msg
    // Do a http get request to the backend using axios
    // return the response

    await axios.get('http://143.198.81.168:5000/msg', {
        headers: {
        }
    }).then((response) => {
        if (response.data) {
            console.log(response.data)

            // Process the data into the locations array and the messages array
            var locations = []
            var messages = []

            numMessages = response.data.length;

            for (var i = 0; i < response.data.length; i++) {
                locations.push(response.data[i].location[1])

                var messageInfo = {
                    location: response.data[i].location[0],
                    messageText: response.data[i].text,
                    messageTitle: response.data[i].username,
                    messageTime: response.data[i].timestamp
                }

                messages.push(messageInfo)
            }

            console.log(messages)

            // At fixed intervals, show a new message in the messages container
            messageInterval = setInterval(() => {
                // Get a random message from the messages array
                var randomMessage = messages[Math.floor(Math.random() * messages.length)]

                // Create a new message div
                var newMessage = document.createElement('div')
                newMessage.classList.add('message')

                // // If not the first message, add a divider
                // if (numMessages != response.data.length) {
                //     var divider = document.createElement('hr')
                //     divider.classList.add('message-divider')
                //     newMessage.appendChild(divider)
                // }

                // Create the message header
                var newMessageHeader = document.createElement('div')
                newMessageHeader.classList.add('message-header')

                // Create the message title
                var newMessageTitle = document.createElement('h3')
                newMessageTitle.classList.add('message-title')
                newMessageTitle.innerHTML = randomMessage.messageTitle

                // Create the message location
                var newMessageLocation = document.createElement('h4')
                newMessageLocation.classList.add('message-location')
                newMessageLocation.innerHTML = randomMessage.location

                // Add the title and location to the header
                newMessageHeader.appendChild(newMessageTitle)
                newMessageHeader.appendChild(newMessageLocation)

                // Create the message body
                var newMessageBody = document.createElement('div')
                newMessageBody.classList.add('message-body')

                // Create the message content
                var newMessageContent = document.createElement('p')
                newMessageContent.classList.add('message-content')
                newMessageContent.innerHTML = randomMessage.messageText

                // Add the content to the body
                newMessageBody.appendChild(newMessageContent)

                // Create the message footer
                var newMessageFooter = document.createElement('div')
                newMessageFooter.classList.add('message-footer')

                // Create the message time
                var newMessageTime = document.createElement('p')
                newMessageTime.classList.add('message-time')
                newMessageTime.innerHTML = randomMessage.messageTime

                // Add the time to the footer
                newMessageFooter.appendChild(newMessageTime)

                // Add the header, body, and footer to the message
                newMessage.appendChild(newMessageHeader)
                newMessage.appendChild(newMessageBody)
                newMessage.appendChild(newMessageFooter)



                // Add the message to the messages container
                document.getElementById('messages').appendChild(newMessage)

                if (numMessages > 0) {
                    numMessages -= 1
                } else {
                    clearInterval(messageInterval)
                }
            }, 3000)

            console.log(locations)

            // var rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF']
            var rainbowColorsPastel = ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093', '#C71585', '#FFA07A']

            // At fixed intervals, ping a random location on the planet
            setInterval(() => {
                // Get a random location from the locations array
                var randomLocation = locations[Math.floor(Math.random() * locations.length)]

                // Ping the location
                planet.plugins.worldPings.add(randomLocation[1], randomLocation[0], {
                    color: rainbowColorsPastel[Math.floor(Math.random() * rainbowColorsPastel.length)],
                    ttl: 2000,
                    angle: Math.random() * 10
                })
            }, 400)

            // this.$refs.messagesContainer)

        }
    }).catch((error) => {
        console.log(error)
    })


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

        getMessages(planet);

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
    padding: 0px 20px 20px 20px;

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

    margin-bottom: 10px;
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
    height: 80%;
    overflow-y: scroll;
    overflow-x: hidden;
}

.message {
    padding-right: 10px;
    padding-left: 10px;
    width: 90%;
    margin-bottom: 10px;
    border-radius: 1rem;
    border-color: #35c5c5c3;
    border-style: solid;
    border-width: 1px 0px 1px 0px;
}

.message-divider {
    width: 90%;
    margin-bottom: 10px;
    border-radius: 1rem;
    border-color: #35c5c5c3;
    border-style: solid;
    border-width: 1px 0px 1px 0px;
}

.message:hover {
    background: #35c5c5c3;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
}

.message-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 5px;
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
    background: #60c7d1;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #187e87;
}
</style>