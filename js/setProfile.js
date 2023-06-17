const submitButton = document.querySelector('#submit-btn');
const inpsProfile = document.querySelectorAll('.profile-setting input');
const imgInp = document.querySelector('#btn-upload')
const acNameInp = document.querySelector('#userid');
const userNameInp = document.querySelector('#username')
const introInp = document.querySelector('#userinfo');

// 이메일 비밀번호 입력 후 포커스 잃으면 형식 및 유효성 검사
let validAccountName = false;
let validUserName = false;

inpsProfile.forEach(item => {
    item.addEventListener('change', async () => {
        await validate(item);

        // 사용자이름 길이 맞고 && => 버튼 활성화
        if (validAccountName && validUserName) {
            console.log('다 통과했는디')
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    })
})

async function validate(target) {

    // 사용자이름 validation
    if (target.id === 'username') {
        if (!target.validity.tooShort && !target.validity.tooLong) {
            document.querySelector(`.warning-msg-username`).style.display = 'none'
            pw.style.borderBottom = '1px solid #f2f2f2';
            validUserName = true
        } else {
            document.querySelector(`.warning-msg-username`).style.display = 'block'
            pw.style.borderBottom = '1px solid red';
            validUserName = false;
        }
    }

    // 계정id validation
    if (target.id === 'userid') {

        // 1. pattern 검사
        console.log(target.validity.patternMismatch)
        if (target.validity.patternMismatch) {
            document.querySelector('.warning-msg-userid').textContent = '*영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.'
            document.querySelector('.warning-msg-userid').style.display = 'block';
        } else {
            // 2. 계정 중복 검사
            const msg = await validateUserId();

            document.querySelector('.warning-msg-userid').textContent = '*' + msg.message;
            document.querySelector('.warning-msg-userid').style.display = 'block';
            if (msg.message === '이미 가입된 계정ID 입니다.') {
                validAccountName = false;
            } else {
                validAccountName = true;
            }
        }
    }
}

// 다음버튼 누르면 프로필설정 폼으로 변경
submitButton.addEventListener('click', async (e) => {
    e.preventDefault()
    console.log('회원가입 완료')
    await SubmitJoinForm();
})


// api 연동 
async function validateUserId() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/accountnamevalid";
    const accountNameData = {
        "user": {
            "accountname": acNameInp.value
        }
    }
    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...accountNameData })
    })
    const json = await res.json();
    return json;
}

async function SubmitJoinForm() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user"

    const data = {
        "user": {
            "username": userNameInp.value,
            "email": email.value,
            "password": pw.value,
            "accountname": acNameInp.value,
            "intro": introInp.value,
            "image": '' // 예시) https://api.mandarin.weniv.co.kr/1641906557953.png
        }
    }

    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...data })
    })

    const json = await res.json();
    return json;
}