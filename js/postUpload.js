/*
TODO
- 이미지 입력 로직 정리
- 이미지 삭제버튼 이벤트
- api 함수들 정리
*/

const token = localStorage.getItem('user-token');

const uploadButton = document.querySelector('#upload-btn'),
    writerImg = document.querySelector('.user-profile img'),
    contentInp = document.querySelector('textarea'),
    imglist = document.querySelector('.upload-imgs-list'),
    imgInp = document.querySelector('#input-file');

const POSTID = new URLSearchParams(location.search).get('postId');
const METHOD = POSTID ? 'PUT' : 'POST';

// 페이지 로드 시
(async function () {
    // 게시글 업로드페이지 or 수정페이지 확인
    if (POSTID) {
        uploadButton.textContent = '수정';
        uploadButton.disabled = false; // 내용 수정 안해도 제출 가능
        getPostData();
    }

    // 작성자 프로필 이미지 가져오기
    writerImg.src = checkImageUrl(await getMyImg(), 'profile');

    // textarea 높이 조절 이벤트 등록
    contentInp.addEventListener('keyup', (e) => {
        e.target.style.height = 0;
        e.target.style.height = e.target.scrollHeight + 'px';
    })
})();

// 업로드/수정 버튼 클릭시
uploadButton.addEventListener('click', async (e) => {
    e.target.disabled = true
    e.preventDefault();
    await submitPostForm(METHOD);
    location.href = `./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`
})

// ---- 버튼 활성화를 위한 입력 유효성 검사 ----
let validContent = false;
let validImg = false;

function isValid() {
    if (validImg || validContent) { // 둘 중 하나 입력시 버튼 활성화
        uploadButton.disabled = false;
    } else {
        uploadButton.disabled = true;
    }
}

// 텍스트 입력되면 valid
contentInp.addEventListener('change', (e) => {
    if (e.target.value !== '') {
        validContent = true;
    } else {
        validContent = false;
    }
    isValid();
});

// 이미지 입력이 존재 && 유효한 이미지 파일이면 valid
imgInp.addEventListener('change', (e) => readURL(e.target));
function readURL(input) {
    if (input.files && input.files[0]) {

        [...input.files].forEach(item => {
            if (checkImageExtension(item)) {
                validImg = true;
                isValid();

                var reader = new FileReader();

                reader.addEventListener('load', function (e) {
                    const li = document.createElement('li');

                    const imgItem = document.createElement('div');
                    imgItem.className = 'img-cover';
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = '';
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'btn-remove';

                    // 삭제버튼 이벤트 바로 등록하기
                    removeBtn.addEventListener('click', function () {
                        // 파일 리스트에서 제거 및 미리보기에서 삭제
                    });

                    imgItem.append(img, removeBtn);
                    li.appendChild(imgItem);
                    imglist.append(li);
                });

                reader.readAsDataURL(item);
            } else {
                alert('유효하지 않은 파일 입니다')
                input.value = ''; // 다시보기
            }
        })
    } else {
        validImg = false;
        isValid()
    }
}
// ---- end of 버튼 활성화 ----


// --- API 함수들 ---

// GET 프로필 이미지
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

// GET 기존 게시글 내용
async function getPostData() {
    const res = await fetch(`https://api.mandarin.weniv.co.kr/post/${POSTID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json"
        }
    })
    const json = await res.json();

    if (json.post.content) {
        document.querySelector('textarea').value = json.post.content
    }
    if (json.post.image) {
        json.post.image.split(',').forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<div class="img-cover">
                <img src=${checkImageUrl(item, 'post')} alt="">
                <button class="btn-remove"></button>
            </div>`;
            imglist.append(li);
        })
    }

    return json
}

// POST/PUT 작성 완료된 게시글 내용
async function submitPostForm(METHOD) {
    const token = localStorage.getItem('user-token');

    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = METHOD=== "PUT" ? `/post/${POSTID}` : "/post"

    // 서버에 이미지 저장하고 가져오기
    let fileName;
    if(METHOD === "PUT" && !document.querySelector('#input-file').files[0]){
        if(document.querySelector('.img-cover img')){
            fileName = document.querySelector('.img-cover img').src
        }
    } else{
        console.log('POST!!!')
        fileName = await postImg();
    }

    console.log(METHOD,fileName)

    const data = {
        "post": {
            "content": contentInp.value.trim(),
            "image": fileName
        }
    }
    console.log(data)

    const res = await fetch(url + reqPath, {
        method: METHOD,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const json = await res.json();

    return json;
}

// POST 입력된 이미지 서버에 올리기
async function postImg() {
    const reqPath = "/image/uploadfile";
    if (document.querySelector('#input-file').files[0]) {
        const files = Array.from(imgInp.files);
    
        const uploadPromises = files.map(async (item) => {
            const formData = new FormData();
            formData.append("image", item);
        
            const res = await fetch("https://api.mandarin.weniv.co.kr" + reqPath, {
                method: "POST",
                body: formData
            });
        
            const json = await res.json();
        
            return json.filename;
        });
    
        const uploadedFiles = await Promise.all(uploadPromises);
        
        return uploadedFiles.join(',');
        } else {
            return '';
        }
    }
