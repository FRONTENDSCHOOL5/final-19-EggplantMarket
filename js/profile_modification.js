const submitButton = document.querySelector('.btn-save');
const inpsProfile = document.querySelectorAll('.profile-setting input');
const imgInp = document.querySelector('#btn-upload');
const userNameInp = document.querySelector('#username');
const acNameInp = document.querySelector('#userid');
const introInp = document.querySelector('#userinfo');

// 계정ID는 변경되지 않도록 고정
acNameInp.readOnly = true;

// 프로필 정보 불러오기
const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem("user-token"),
    userID = localStorage.getItem("user-accountname");


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
        // 성공적으로 저장되었을 때 추가적인 처리 가능
    } catch (err) {
        console.error(err);
        location.href='./404.html'
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

// 프로필 이미지 버튼
imgInp.addEventListener('change', async (e) => {
    const formData = new FormData();
    const imageFile = e.target.files[0];
    if (checkImageExtension(imageFile)) {

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
    } else{
        alert('유효하지 않은 파일 입니다')
        e.target.value = '';
    }
});

// 이메일 비밀번호 입력 후 포커스 잃으면 형식 및 유효성 검사
let validUserName = true;
let validInfo = false;
let validImage = false;

inpsProfile.forEach(item => {
    item.addEventListener('change', async () => {
        if(item.id === 'username' || item.id === 'userid' || item.id ==='userinfo'){
            item.value = item.value.trim();
        }
        await validateProfile(item);

        if (validUserName || validInfo || validImage) {
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
        if (!target.validity.tooShort && !target.validity.tooLong && !target.validity.valueMissing) {
            document.querySelector(`.warning-msg-username`).style.display = 'none';
            validUserName = true;
        } else {
            document.querySelector(`.warning-msg-username`).style.display = 'block';
            validUserName = false;
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
    location.href = `./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`
});


// api 연동 

// 프로필 정보 가져오기
async function Load_userinfo(url, token, accountName) {
    try {
        const res = await fetch(url + `/profile/${accountName}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const resJson = await res.json();
        return resJson
    } catch (err) {
        console.error(err);
        location.href='./404.html'
    }
}

// 가져온 프로필 정보 화면에 보여주기
function introUpdate(profileData) {
    const imageInput = document.querySelector('.img-cover');
    const userNameInput = document.querySelector('#username');
    const accountNameInput = document.querySelector('#userid');
    const introInput = document.querySelector('#userinfo');

    // 프로필 이미지 보여주기
    const imageSrc = profileData.image;
    if(imageSrc) {
        imageInput.insertAdjacentHTML('beforeend',`<img src="${checkImageUrl(imageSrc,'profile')}" alt="기본 프로필 이미지">`)
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