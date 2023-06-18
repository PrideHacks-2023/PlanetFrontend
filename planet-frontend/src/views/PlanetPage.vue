<template>
    <NavBar />

    <h3 id="pageHeader">This is the Planet Support Page</h3>
    <canvas ref="globeCanvas" id='globe' width='500' height='500'></canvas>
    <div class="panel">


    </div>
</template>
  
<script>
import planetaryjs from 'planetary.js'

// Get the path to the json file, not the contents
// planet-frontend\public\static\world-110m.json

const jsonFilePath = require('file-loader!../../public/static/world-110m.json');

export default {
    name: "PlanetPage",
    components: {
    },
    mounted() {
        const planet = planetaryjs.planet();
        planet.loadPlugin(planetaryjs.plugins.earth({
            topojson: { file: jsonFilePath }
        }));
        planet.projection.scale(250).translate([250, 250]);
        const canvas = this.$refs.globeCanvas;
        planet.draw(canvas);
    }
};





</script>
  
<style scoped></style>