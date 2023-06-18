<template>
    <router-view />
</template>

<script>
export default {
  name: "App",
    components: {
  },
};

</script>

<style>
body {
  margin: 0;
  padding: 0;
  /* Repeating background image gif */
  background-image: url('https://thumbs.gfycat.com/CloudyOldAcaciarat.webp');
  background-repeat: repeat;
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;

}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background-color: aqua; */
}

</style>
