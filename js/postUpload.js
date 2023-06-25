const token = localStorage.getItem('user-token');

const writerImg = document.querySelector('.user-profile img');
const uploadButton = document.querySelector('#upload-btn');
const imglist = document.querySelector('.upload-imgs-list');
const contentInp = document.querySelector('textarea');
const imgInp = document.querySelector('#input-file');

// 작성자 프로필 이미지 가져오기
async function getMyImg() {
    const reqPath = "/user/myinfo";
    const res = await fetch("https://api.mandarin.weniv.co.kr" + reqPath, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const json = await res.json();

    return json.user.image;
}
(async function () {
    writerImg.src = await getMyImg();
})();

// textarea 작성 길이 조절
contentInp.addEventListener('keyup', (e) => {
    e.target.style.height = 0;
    e.target.style.height = e.target.scrollHeight + 'px';
})

// ---- start of 버튼 활성화 ----

let validContent = false;
let validImg = false;

// 텍스트 입력
contentInp.addEventListener('change', () => {
    contentInp.value = contentInp.value.trim();
    // 텍스트 입력되면 valid
    if (contentInp.value !== '') {
        validContent = true;
    } else {
        validContent = false;
    }
});

// 이미지 입력
(function () {
    imgInp.addEventListener('change', (e) => readURL(e.target));

    function readURL(input) {
        // 이미지 하나씩 여러개 추가할 수 있는 상태, 3개 한정은 아직 구현하지 않음
        if (input.files && input.files[0]) {

            if (checkImageExtension(input.files[0])) {
                // 이미지 입력되면 valid
                validImg = true;

                var reader = new FileReader();
                reader.addEventListener('load', function (e) {
                    const li = document.createElement('li');
                    li.innerHTML = `<div class="img-cover">
                    <img src=${e.target.result} alt="이미지 미리보기">
                    <button class="btn-remove"></button>
                </div>`;
                    imglist.append(li);
                });
                reader.readAsDataURL(input.files[0]);
            } else {
                alert('유효하지 않은 파일 입니다')
                input.value = '';
            }
            
        }
    }
})()

// 이미지 삭제
imglist.addEventListener('click', (e) => {
    e.preventDefault();
    // 이벤트 위임
    if (e.target.className === 'btn-remove') {
        e.target.closest('li').remove();

        if (imglist.children.length === 0) {
            // 이미지 추가한 거 다 삭제하면 invalid
            validImg = false;
            isValid()
        }
    }
})

// 이벤트 리스너 차례로 동작함
imgInp.addEventListener('change', isValid);
contentInp.addEventListener('change', isValid);

function isValid() {
    // console.log('contentInp : ', validContent, 'validImg : ', validImg);
    if (validImg || validContent) {
        // console.log('둘중하나는 입력됨');
        uploadButton.disabled = false;
    } else {
        // console.log('둘 다 입력안됨');
        uploadButton.disabled = true;
    }
}

// ---- end of 버튼 활성화 ----


// --- start of 게시글 작성하기 ---

uploadButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await submitPostForm();
    console.log('게시글 작성 완료');
    location.href=`./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`
})

// 작성 완료된 게시글 내용 post요청
async function submitPostForm() {
    const token = localStorage.getItem('user-token');

    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/post"

    // 서버에 이미지 저장하고 가져오기
    const fileName = await postImg();

    const data = {
        "post": {
            "content": contentInp.value,
            "image": fileName
        }
    }

    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const json = await res.json();
    return json;
}

// 입력된 이미지 서버에 올리기
async function postImg() {
    const formData = new FormData();
    const reqPath = "/image/uploadfile";
    if (document.querySelector('#input-file').files[0]) {
        formData.append("image", document.querySelector('#input-file').files[0])
        const res = await fetch("https://api.mandarin.weniv.co.kr" + reqPath, {
            method: "POST",
            body: formData
        });
        const json = await res.json();

        console.log(json.filename)

        return 'https://api.mandarin.weniv.co.kr/' + json.filename;
    } else {
        return '';
    }
}

// --- end of 게시글 작성하기 ---
