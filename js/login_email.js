// todo : 코드 리팩토링, sass 변수 가져오는 법, try catch 문
// 이메일로 회원가입 페이지 들어갔다가 다시 뒤로가기로 돌아오면 이메일value값 남아있음

const loginButton = document.querySelector('#login-btn');
const inps = document.querySelectorAll('input');
const email = document.querySelector('#email');
const pw = document.querySelector('#pw');

// 아이디 비밀번호 입력시 로그인 버튼 활성화
inps.forEach(item => {
    item.addEventListener('keyup', () => {
        if(item.id === 'email'){
            item.value = item.value.trim();
        }
        if (!email.validity.typeMismatch) {
            document.querySelector('.warning-msg-1').style.display = 'none';
            email.style.borderBottom = '1px solid #dbdbdb';
        };
        document.querySelector('.warning-msg-2').style.display = 'none';
        if (!email.validity.valueMissing && !pw.validity.valueMissing) {
            loginButton.disabled = false
        } else {
            loginButton.disabled = true
        }
    })

    item.addEventListener('focus', (e) => {
        const borderColor = document.querySelector('.warning-msg-1').style.display === 'block' ? 'red' : '#9747FF';
        e.target.style.borderBottom = `1px solid ${borderColor}`;
    })
    item.addEventListener('focusout', (e) => {
        e.target.style.borderBottom = '1px solid #DBDBDB';
    })
})



// 로그인 버튼 클릭시 이메일 형식 유효성 검사
loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    validate(email);
})

function validate(target) {
    if (target.validity.typeMismatch) {
        document.querySelector('.warning-msg-1').style.display = 'block'
        const theme = window.localStorage.getItem('theme');
        const borderColor = theme === 'highContrast' ? '#FFEB32' : 'red';
        email.style.borderBottom = `1px solid ${borderColor}`;
        email.focus()
    } else {
        login();
    }
}

// api 연동 
async function login() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/login/";
    console.log(email.value, pw.value)
    const loginData = {
        "user": {
            "email": email.value,
            "password": pw.value
        }
    }
    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...loginData })
    })
    const json = await res.json()
    console.log(json, "제이손입니다")

    if (json.status !== 422) { // 로그인 성공
        console.log(json.user.token)
        localStorage.setItem("user-token", json.user.token);
        localStorage.setItem("user-accountname", json.user.accountname);
        location.href = './home.html';
    } else {
        document.querySelector('.warning-msg-2').style.display = 'block';
    }
}



//sass 테마작업 진행중
const radioGroup = document.getElementsByName('colorSet');
const wrapper = document.querySelector('.login');

function colorChange(e) {
    if (e.target.id === 'highContrast') {
        window.localStorage.setItem('theme', 'highContrast');
        wrapper.classList.add('highContrast');
        document.body.style.backgroundColor = '#000000'; 
    } else {
        window.localStorage.setItem('theme', 'light');
        wrapper.classList.remove('highContrast');
        document.body.style.backgroundColor = '#ffffff'; 
    }
}

radioGroup.forEach((input) => {
    input.addEventListener('change', colorChange);
});

