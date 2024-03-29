import { fetchApi } from "./fetch/fetchRefact.js";

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
            if (document.activeElement == email) email.style.borderBottom = '1px solid #9747FF';
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

async function validate(target) {
    if (target.validity.typeMismatch) {
        document.querySelector('.warning-msg-1').style.display = 'block'
        const theme = window.localStorage.getItem('theme');
        const borderColor = theme === 'highContrast' ? '#FFEB32' : 'red';
        email.style.borderBottom = `1px solid ${borderColor}`;
        email.focus()
    } else {
        const json = await login();

        if (json.status !== 422) { // 로그인 성공
            localStorage.setItem("user-token", json.user.token);
            localStorage.setItem("user-accountname", json.user.accountname);
            location.href = './home.html';
        } else {
            document.querySelector('.warning-msg-2').style.display = 'block';
        }
    }
}

// login_email
// api 연동 
async function login() {
    const loginData = {
        "user": {
            "email": email.value,
            "password": pw.value
        }
    }
    
    return fetchApi({
        reqPath : "/user/login/", 
        method : "POST",
        bodyData : loginData,
        needToken : false})
}