import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Vue3Toasity from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App)
    .use(Vue3Toasity, {
        autoClose: 150,
        position: "top-center",
        theme: "dark",
        hideProgressBar: true,
        closeOnClick: true,
    })
    .mount("#app");
