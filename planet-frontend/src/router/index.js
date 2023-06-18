import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import LandingPage from "@/views/LandingPage.vue";
import PlanetPage from "@/views/PlanetPage.vue";
import PostPage from "@/views/PostPage.vue";

// import About from "@/views/About.vue";
// import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: LandingPage,
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/planet",
    name: "Planet",
    component: PlanetPage,
  },
  {
    path: "/post",
    name: "Post",
    component: PostPage,
  },
//   {
//     path: "/about",
//     name: "About",
//     component: About,
//   },
//   {
//     path: '/:catchAll(.*)',
//     name: 'NotFound',
//     component: NotFound,
//   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;