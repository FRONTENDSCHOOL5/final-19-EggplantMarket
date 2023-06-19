const submitButton = document.querySelector('.btn-save');
const inpsProfile = document.querySelectorAll('.profile-setting input');
const imgInp = document.querySelector('#btn-upload');
const userNameInp = document.querySelector('#username');
const acNameInp = document.querySelector('#userid');
const introInp = document.querySelector('#userinfo');

// 프로필 정보 불러오기
const url = "https://api.mandarin.weniv.co.kr",
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OGZlODMxYjJjYjIwNTY2MzNiNGMwZSIsImV4cCI6MTY5MjM0NDQ0MiwiaWF0IjoxNjg3MTYwNDQyfQ.QvD05ZEqNtVekSCvBtLp8TNg9x-2vfiLtlpxOb8PD2U",
    userID = "asd_test"

async function Load_userinfo(url,token, accountName) { 
    try{
    const res = await fetch(url+`/profile/${accountName}`, {
                    method: "GET",
                    headers : {
                        "Authorization" : `Bearer ${token}`
                    }
                });
    const resJson = await res.json();
    console.log(resJson);
    return resJson
} catch(err){
    console.error(err);
}}

// 프로필 정보 저장
async function saveProfile(url, token) {
   // 수정된 프로필 정보 가져오기
    const reqPath = "/user"
  
    // 이미지 넣기
    const fileName = await postImg()

    const data = {
      "user": {
        "username": userNameInp.value,
        "accountname": acNameInp.value,
        "intro": introInp.value,
        // "image": imgInp.src
        "image": 'https://mandarin.api.weniv.co.kr/' + fileName
      }
    }
  
    try {
      const res = await fetch(url + reqPath, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
  
      const json = await res.json();
      console.log(json);
      // 성공적으로 저장되었을 때 추가적인 처리 가능
    } catch (error) {
      console.error(error);
      // 저장 실패 시 에러 처리
    }
  }

// 이메일 비밀번호 입력 후 포커스 잃으면 형식 및 유효성 검사
let validAccountName = false;
let validUserName = false;
let validInfo = false;

inpsProfile.forEach(item => {
    item.addEventListener('change', async () => {
        await validateProfile(item);

        // 사용자이름 길이 맞고 && 계정ID 형식 맞고 사용가능한 ID면 => 버튼 활성화
        if (validAccountName || validUserName || validInfo) {
            console.log('다 통과했는디')
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    })
})

// 수정 시 사용자 이름과 계정 ID 설정
async function validateProfile(target) {

    // 사용자이름 validation
    if (target.id === 'username') {
        if (!target.validity.tooShort && !target.validity.tooLong) {
            document.querySelector(`.warning-msg-username`).style.display = 'none'
            validUserName = true
        } else {
            document.querySelector(`.warning-msg-username`).style.display = 'block'
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

    // 소개 validation
    if (target.id === 'userinfo') {
        validUserName = true;
    }

}

// 다음버튼 누르면 프로필설정 폼으로 변경
submitButton.addEventListener('click', async (e) => {
    e.preventDefault()
    await saveProfile(url, token);
    console.log('프로필 수정 완료')
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

// async function SubmitJoinForm() {
//     const url = "https://api.mandarin.weniv.co.kr";
//     const reqPath = "/user"

//     // 이미지 넣기
//     const fileName = await postImg()

//     const data = {
//         "user": {
//             "username": userNameInp.value,
//             "email": email.value,
//             "password": pw.value,
//             "accountname": acNameInp.value,
//             "intro": introInp.value,
//             "image": 'https://mandarin.api.weniv.co.kr/' + fileName
//         }
//     }

//     const res = await fetch(url + reqPath, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     })

//     const json = await res.json();
//     return json;
// }
  
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

// (function () {
//     const uploadInp = document.querySelector('#btn-upload')
//     console.log(uploadInp.files);

//     uploadInp.addEventListener('change', (e) => readURL(e.target));

//     function readURL(input) {
//         if (input.files && input.files[0]) {
//             var reader = new FileReader();
//             reader.onload = function (e) {
//                 document.querySelector('.img-cover img').src = e.target.result;
//             };
//             reader.readAsDataURL(input.files[0]);
//         } else {
//             document.querySelector('.img-cover img').src = "../assets/basic-profile-img.png";
//         }
//     }
// })()

function introUpdate(profileData) {
    // const imgCover = document.querySelector('.img-cover img');
    const userNameInput = document.querySelector('#username');
    const accountNameInput = document.querySelector('#userid');
    const introInput = document.querySelector('#userinfo');

    // imgCover.src = profileData.image;
    userNameInput.value = profileData.username;
    accountNameInput.value = profileData.accountname;
    introInput.value = profileData.intro;
}

async function run(url, token, accountName) {
    const profileData = await Load_userinfo(url, token, accountName);
    await introUpdate(profileData.profile);
}

run(url, token, userID);