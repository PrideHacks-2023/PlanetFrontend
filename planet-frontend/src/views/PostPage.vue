<template>
    <NavBar />

    <h3 id="pageHeader">This is the Post Page</h3>

    <div class="autocomplete-container" id="autocomplete"></div>


    <div class="panel">


    </div>
</template>
  
<script>
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';

// Get API key from env file
const apiKey = process.env.VUE_APP_GEOAPIFY_API_KEY;
// var axios = require('axios');

var lat = 0;
var lon = 0;
var locationName = "";

export default {
    name: "PostPage",
    components: {
    },
    mounted() {
        const autocomplete = new GeocoderAutocomplete(
            document.getElementById("autocomplete"),
            apiKey,
            { /* Geocoder options */ });

        autocomplete.on('select', (location) => {
            // check selected location here 
            console.log(location);
        });

        autocomplete.on('suggestions', (suggestions) => {
            // process suggestions here
            console.log(suggestions);
        });

    },
};


</script>
  
<style scoped>
.autocomplete-container {
    /*the container must be positioned relative:*/
    position: relative;
}

.autocomplete-container input {
    width: calc(100% - 43px);
    outline: none;

    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 10px;
    padding-right: 31px;
    font-size: 16px;
}

.autocomplete-items {
    position: absolute;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.1);
    border-top: none;
    background-color: #fff;

    z-index: 99;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
}

.autocomplete-items div {
    padding: 10px;
    cursor: pointer;
}

.autocomplete-items div:hover {
    /*when hovering an item:*/
    background-color: rgba(0, 0, 0, 0.1);
}

.clear-button {
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;

    position: absolute;
    right: 5px;
    top: 0;

    height: 100%;
    display: none;
    align-items: center;
}

.clear-button.visible {
    display: flex;
}

.clear-button:hover {
    color: rgba(0, 0, 0, 0.6);
}

.autocomplete-items .autocomplete-active {
    /*when navigating through the items using the arrow keys:*/
    background-color: rgba(0, 0, 0, 0.1);
}
</style>