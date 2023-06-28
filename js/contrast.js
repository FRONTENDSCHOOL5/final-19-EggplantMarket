// profile_modification
// colorchange render함수
function colorChange() {
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
        if(!document.querySelector('.login')){
            document.querySelector('[class *= "wrapper"]').classList.add('highContrast');
        }else{
            document.querySelector('.login').classList.add('highContrast');
        }
        if(document.querySelector('[class *= "wrapper"]').classList.contains('login-wrapper')){
            document.body.style.backgroundColor = '#E4D6FF';
        }else{
            document.body.style.backgroundColor = '#000000'; 
        }

        if(imgBtn) imgBtn.src = "../assets/img-btn-hc.svg";
        if(imgUploadBtn) imgUploadBtn.src = "../assets/upload-file-hc.svg";
        if(symbol) symbol.src = "../assets/symbol-logo-hc.svg";
        if(logo) logo.src = "../assets/logo-hc.svg"
        if(search) search.src = "../assets/icon/icon-search-highContrast.svg";
        
        document.querySelectorAll('img').forEach(item=>{
            if(item.src === LightProfile) item.src=ContrastProfile
            if(item.src === LightPost) item.src=ContrastPost
        })
    } else {
        console.log('키키')
        window.localStorage.setItem('theme', 'light');
        if(!document.querySelector('.login')){
            document.querySelector('[class *= "wrapper"]').classList.remove('highContrast'); 
        }else{
            document.querySelector('.login').classList.add('highContrast');
        }
        if(document.querySelector('[class *= "wrapper"]').classList.contains('login-wrapper')){
            document.body.style.backgroundColor = '#635CA5'; 
        } else{
            document.body.style.backgroundColor = '#000000'; 
        }

        if(imgBtn) imgBtn.src = "../assets/img-button.svg";
        if(imgUploadBtn) imgUploadBtn.src = "../assets/upload-file.svg";
        if(symbol) symbol.src = "../assets/symbol-logo.svg";
        if(logo) logo.src = "../assets/logo.svg";
        if(search) search.src = "../assets/icon/icon-search.svg";

        console.log(document.querySelectorAll('img'))
        document.querySelectorAll('img').forEach(item=>{
            console.log('변경',item)
            if(item.src === ContrastProfile) item.src= LightProfile
            if(item.src === ContrastPost) item.src= LightPost
        })
    }
}