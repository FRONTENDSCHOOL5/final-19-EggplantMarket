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
        item.value = item.value.trim();
        await validateProfile(item);

        // 사용자이름 길이 맞고 && 계정ID 형식 맞고 사용가능한 ID면 => 버튼 활성화
        if (validAccountName && validUserName) {
            console.log('다 통과했는디')
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    })
})

async function validateProfile(target) {

    // 사용자이름 validation
    if (target.id === 'username') {
        if (!target.validity.tooShort && !target.validity.tooLong && !target.validity.valueMissing) {
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

// 가지마켓시작하기버튼 누르면 회원가입 완료 및 로그인 화면으로 이동
submitButton.addEventListener('click', async (e) => {
    e.preventDefault()
    await SubmitJoinForm();
    console.log('회원가입 완료')
    location.href = './login.html';
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
        body: JSON.stringify(accountNameData)
    })
    const json = await res.json();
    return json;
}

async function SubmitJoinForm() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user"

    // 이미지 넣기
    const fileName = await postImg()

    const data = {
        "user": {
            "username": userNameInp.value,
            "email": email.value,
            "password": pw.value,
            "accountname": acNameInp.value,
            "intro": introInp.value,
            "image": 'https://api.mandarin.weniv.co.kr/' + fileName
        }
    }

    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const json = await res.json();
    return json;
}

async function postImg() {
    const formData = new FormData();
    const reqPath = "/image/uploadfile";
    if (document.querySelector('#btn-upload').files[0]) {
        formData.append("image", document.querySelector('#btn-upload').files[0])
        const res = await fetch("https://api.mandarin.weniv.co.kr" + reqPath, {
            method: "POST",
            body: formData
        });
        const json = await res.json();

        return json.filename;
    } else {
        return "1687141773353.png";
        // 기본 이미지
    }
}

(function () {
    const uploadInp = document.querySelector('#btn-upload')
    console.log(uploadInp.files);

    uploadInp.addEventListener('change', (e) => readURL(e.target));

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.querySelector('.img-cover img').src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            document.querySelector('.img-cover img').src = "../assets/basic-profile-img.png";
        }
    }
})()
