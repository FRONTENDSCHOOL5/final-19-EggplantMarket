setTimeout(() => {
    if (localStorage.getItem("user")) {
        location.href = "./html/home.html";
    } else {
        location.href = "./html/login.html"
    }
}, 2000)