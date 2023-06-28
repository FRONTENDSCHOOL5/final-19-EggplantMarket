setTimeout(() => {
    if (localStorage.getItem("user")) {
        location.href = "./html/home.html";
    } else {
        location.href = "./html/login.html"
    }
}, 2000)

//고대비 테마
const wrapper = document.querySelector('.splash');
const theme = window.localStorage.getItem('theme');
if (theme === 'highContrast') {
    wrapper.classList.add('highContrast');
    document.body.style.backgroundColor = '#000000';
    document.getElementById("symbol-image").src = "../assets/symbol-logo-hc.svg";
    document.getElementById("logo-image").src = "../assets/logo-hc.svg";

} else {
    wrapper.classList.remove('highContrast');
    document.body.style.backgroundColor = '#ffffff'; 
    
}