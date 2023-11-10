import { applyTheme } from "./theme.js"
applyTheme();

setTimeout(() => {
    if (localStorage.getItem("user-token")) {
        location.href = "./html/home.html";
    } else {
        location.href = "./html/login.html"
    }
}, 2000)
