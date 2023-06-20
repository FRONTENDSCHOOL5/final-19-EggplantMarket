const submitButton = document.querySelector('.btn-save');
const inpsProfile = document.querySelectorAll('.profile-setting input');
const imgInp = document.querySelector('#btn-upload');
const userNameInp = document.querySelector('#username');
const acNameInp = document.querySelector('#userid');
const introInp = document.querySelector('#userinfo');

// 프로필 정보 불러오기
const url = "https://api.mandarin.weniv.co.kr",
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTEzYWY5YjJjYjIwNTY2MzQ1M2NiNSIsImV4cCI6MTY5MjQyMzQ3NiwiaWF0IjoxNjg3MjM5NDc2fQ.qsUhukxADGoXTjs98N8h-NDWquskgMW3S03OFaEl5-U",
    userID = "ellie"

async function Load_userinfo(url, token, accountName) {
    try {
        const res = await fetch(url + `/profile/${accountName}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const resJson = await res.json();
        console.log(resJson);
        return resJson
    } catch (err) {
        console.error(err);
    }
}

// 프로필 정보 저장
async function saveProfile(url, token) {
    // 수정된 프로필 정보 가져오기
    const reqPath = "/user";

    // 이미지 넣기
    const fileName = await postImg();
    const imageURL = 'https://mandarin.api.weniv.co.kr/' + fileName;

    const data = {
        "user": {
            "username": userNameInp.value,
            "accountname": acNameInp.value,
            "intro": introInp.value,
            "image": imageURL,
        }
    };

    try {
        const currentImageSrc = document.querySelector('.img-cover img').src;

        // 이미지 데이터 저장할 변수 선언
        let updatedData;

        // 현재 이미지 소스와 다른 경우 데이터의 이미지 URL을 업데이트
        if (currentImageSrc !== imageURL) {
            updatedData = { ...data };
            updatedData.user.image = currentImageSrc;
        }

        const res = await fetch(url + reqPath, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedData || data)
        });

        const json = await res.json();
        console.log(json);
        // 성공적으로 저장되었을 때 추가적인 처리 가능
    } catch (error) {
        console.error(error);
        // 저장 실패 시 에러 처리
    }
}


async function postImg() {
    const file = imgInp.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const reqPath = "/image/uploadfile";
    if (document.querySelector('#btn-upload').files[0]) {
        formData.append("image", document.querySelector('#btn-upload').files[0])
        const res = await fetch("https://api.mandarin.weniv.co.kr" + reqPath, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
            body: formData
        });
        const json = await res.json();

        return json.filename;
    }
}

imgInp.addEventListener('change', async (e) => {
    const formData = new FormData();
    const imageFile = e.target.files[0];
    formData.append("image", imageFile);
    const res = await fetch("https://api.mandarin.weniv.co.kr/image/uploadfile", {
        method: "POST",
        body: formData
    });
    const json = await res.json();
    const imageURL = "https://api.mandarin.weniv.co.kr/" + json.filename;

    // 보여지는 이미지 업데이트
    const imageInput = document.querySelector('.img-cover img');
    imageInput.src = imageURL;
});

// 이메일 비밀번호 입력 후 포커스 잃으면 형식 및 유효성 검사
let validAccountName = false;
let validUserName = false;
let validInfo = false;
let validImage = false;

inpsProfile.forEach(item => {
    item.addEventListener('change', async () => {
        await validateProfile(item);

        // 사용자이름 길이 맞고 && 계정ID 형식 맞고 사용가능한 ID면 => 버튼 활성화
        // info 혹은 image만 변경해도 저장 가능하도록
        if (validAccountName || validUserName || validInfo || validImage) {
            console.log('다 통과했는디');
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    });
});

// 수정 시 사용자 이름과 계정 ID 설정
async function validateProfile(target) {

    // 사용자이름 validation
    if (target.id === 'username') {
        if (!target.validity.tooShort && !target.validity.tooLong) {
            document.querySelector(`.warning-msg-username`).style.display = 'none';
            validUserName = true;
        } else {
            document.querySelector(`.warning-msg-username`).style.display = 'block';
            validUserName = false;
        }
    }

    // 계정id validation
    if (target.id === 'userid') {
        // 1. pattern 검사
        console.log(target.validity.patternMismatch);
        if (target.validity.patternMismatch) {
            document.querySelector('.warning-msg-userid').textContent = '*영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.';
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

    // 소개 validation
    if (target.id === 'userinfo') {
        validUserName = true;
    }

    // 이미지 validation
    if (target.id === 'btn-upload'){
        validImage = true;
    }
}

// 다음버튼 누르면 프로필설정 폼으로 변경
submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await saveProfile(url, token);
    console.log('프로필 수정 완료');
});


// api 연동 
async function validateUserId() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/accountnamevalid";
    const accountNameData = {
        "user": {
            "accountname": acNameInp.value
        }
    };
    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(accountNameData)
    });
    const json = await res.json();
    return json;
}

function introUpdate(profileData) {
    const imageInput = document.querySelector('.img-cover img');
    const userNameInput = document.querySelector('#username');
    const accountNameInput = document.querySelector('#userid');
    const introInput = document.querySelector('#userinfo');

    // 프로필 이미지 보여주기
    const imageSrc = profileData.image;
    if(imageSrc) {
        imageInput.src = imageSrc;
    }
    userNameInput.value = profileData.username;
    accountNameInput.value = profileData.accountname;
    introInput.value = profileData.intro;
}

async function run(url, token, accountName) {
    const profileData = await Load_userinfo(url, token, accountName);
    introUpdate(profileData.profile);
}

run(url, token, userID);
