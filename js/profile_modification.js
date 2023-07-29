import { checkImageUrl, checkImageExtension } from "./common.js";
import { fetchApi, PostImage } from "./fetch/fetchRefact.js";

const submitButton = document.querySelector('.btn-save');
const inpsProfile = document.querySelectorAll('.profile-setting input');
const imgInp = document.querySelector('#btn-upload');
const userNameInp = document.querySelector('#username');
const acNameInp = document.querySelector('#userid');
const introInp = document.querySelector('#userinfo');

// 계정ID는 변경되지 않도록 고정
acNameInp.readOnly = true;

// 프로필 정보 불러오기
const userID = localStorage.getItem("user-accountname");

// 프로필 정보 저장
async function saveProfile() {
    const currentImageSrc = document.querySelector('.img-cover img').src;
    // 이미지 넣기
    const fileName = await postImg();
    const imageURL = `https://api.mandarin.weniv.co.kr/${fileName}`

    const data = {
        "user": {
            "username": userNameInp.value,
            "accountname": acNameInp.value,
            "intro": introInp.value,
            "image": imageURL,
        }
    };
    
    const updatedData = { ...data };
    if (currentImageSrc !== imageURL) {
        updatedData.user.image = currentImageSrc;
    }

    await fetchApi("/user", "PUT", updatedData, false)
}

async function postImg() {
    if (document.querySelector('#btn-upload').files[0]) {
        return PostImage(document.querySelector('#btn-upload').files[0])
    }
}

// 프로필 이미지 버튼
imgInp.addEventListener('change', async (e) => {
    
    const imageFile = e.target.files[0];
    if (checkImageExtension(imageFile)) {
        const filename = await PostImage(imageFile)
        const imageURL = "https://api.mandarin.weniv.co.kr/" + filename;

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
    e.target.disabled = true;
    await saveProfile();
    location.href = `./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`
});


// api 연동 

// 프로필 정보 가져오기
async function Load_userinfo(accountName) {
    return fetchApi(`/profile/${accountName}`, "GET");
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

async function run(accountName) {
    const profileData = await Load_userinfo(accountName);
    introUpdate(profileData.profile);
}

run(userID);