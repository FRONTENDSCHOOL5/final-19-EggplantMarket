// profile_modification
// colorchange render함수
export function applyTheme() {
    const LightProfile = 'https://api.mandarin.weniv.co.kr/1687141773353.png'
    const LightPost = 'https://api.mandarin.weniv.co.kr/1687742174893.png'
    const ContrastProfile = 'https://api.mandarin.weniv.co.kr/1687827693364.png'
    const ContrastPost = 'https://api.mandarin.weniv.co.kr/1687742585629.png'

    const imgBtn = document.getElementById("img-btn"),
        imgUploadBtn = document.getElementById("image-upload-btn"),
        symbol = document.getElementById("symbol-image"),
        logo = document.getElementById("logo-image"),
        search = document.getElementById("search-icon");

    if ( localStorage.getItem('theme') === 'highContrast' ) {
        window.localStorage.setItem('theme', 'highContrast');
        document.querySelector('.theme-wrapper').classList.add('highContrast');

        if(document.querySelector('.login-wrapper')){
            document.body.style.backgroundColor = '#E4D6FF';
        }else{
            document.body.style.backgroundColor = '#000000'; 
        }

        if (imgBtn) imgBtn.src = "../assets/icon/upload-file-hc.svg";
        if(imgUploadBtn) imgUploadBtn.src = "../assets/icon/upload-file-hc.svg";
        if (symbol) symbol.src = "../assets/symbol/hc-basic.svg";
        if(logo) logo.src = "../assets/logo/logo-hc.svg"
        if(search) search.src = "../assets/icon/icon-search-hc.svg";
        
        document.querySelectorAll('img').forEach(item=>{
            if(item.src === LightProfile) item.src=ContrastProfile
            if(item.src === LightPost) item.src=ContrastPost
        })
    } else {
        window.localStorage.setItem('theme', 'light');
        document.querySelector('.theme-wrapper').classList.remove('highContrast'); 

        if(document.querySelector('.login-wrapper')){
            document.body.style.backgroundColor = '#635CA5'; 
        } else{
            document.body.style.backgroundColor = '#ffffff'; 
        }

        if(imgBtn) imgBtn.src = "../assets/icon/img-button.svg";
        if(imgUploadBtn) imgUploadBtn.src = "../assets/icon/upload-file.svg";
        if(symbol) symbol.src = "../assets/symbol/light-basic.svg";
        if(logo) logo.src = "../assets/logo/logo.svg";
        if(search) search.src = "../assets/icon/icon-search.svg";

        document.querySelectorAll('img').forEach(item=>{
            if(item.src === ContrastProfile) item.src= LightProfile
            if(item.src === ContrastPost) item.src= LightPost
        })
    }
}