const token = localStorage.getItem('user-token');

const $uploadButton = document.querySelector('#upload-btn'),
    $writerImg = document.querySelector('.user-profile img'),
    $contentInp = document.querySelector('textarea'),
    $imglist = document.querySelector('.upload-imgs-list'),
    $imgInp = document.querySelector('#input-file');

const POSTID = new URLSearchParams(location.search).get('postId');
const METHOD = POSTID ? 'PUT' : 'POST';

let dataTransfer = new DataTransfer(); // 이미지 추가, 삭제 관리를 위한 전역변수
const tempImgUrls = []; // 이미지 미리보기에서 임시URL 생성 및 해제를 위한 전역변수

// 페이지 로드 시
(async function () {
    // 게시글 업로드페이지 or 수정페이지 확인
    if (POSTID) {
        $uploadButton.textContent = '수정';
        $uploadButton.disabled = false; // 내용 수정 안해도 제출 가능
        getPostData();
    }

    // 작성자 프로필 이미지 가져오기
    $writerImg.src = checkImageUrl(await getMyImg(), 'profile');

    // textarea 높이 조절 이벤트 등록
    $contentInp.addEventListener('keyup', (e) => {
        e.target.style.height = 0;
        e.target.style.height = e.target.scrollHeight + 'px';
    })
})();

// 업로드/수정 버튼 클릭시
$uploadButton.addEventListener('click', async (e) => {
    e.preventDefault();
    if (await submitPostForm(METHOD)) {
        e.target.disabled = true;
        tempImgUrls.forEach(item => URL.revokeObjectURL(item));
        location.href = `./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`
    }
})

// ---- 버튼 활성화를 위한 입력 유효성 검사 ----
let validContent = false;
let validImg = false;

function isValid() {
    if (validImg || validContent) { // 둘 중 하나 입력시 버튼 활성화
        $uploadButton.disabled = false;
    } else {
        $uploadButton.disabled = true;
    }
}

// 텍스트 입력되면 valid
$contentInp.addEventListener('change', (e) => {
    if (e.target.value !== '') {
        validContent = true;
    } else {
        validContent = false;
    }
    isValid();
});

// 이미지 입력이 존재 && 유효한 이미지 파일이면 valid
$imgInp.addEventListener('change', (e) => previewImg(e.target));
function previewImg(input) {
    if (input.files && input.files[0]) {
        const frag = document.createDocumentFragment();

        [...input.files].forEach(item => {
            if (checkImageExtension(item)) { // 유효 확장자 : PNG|JPG|png|svg|jpg|jpeg|gif|webp
                validImg = true;
                isValid();

                // 입력된 이미지 누적
                dataTransfer.items.add(item);

                // 이미지 미리보기
                const tempImgUrl = URL.createObjectURL(item);
                tempImgUrls.push(tempImgUrl);

                const li = document.createElement('li');

                const imgItem = document.createElement('div');
                imgItem.className = 'img-cover';
                const img = document.createElement('img');
                img.src = tempImgUrl;
                img.alt = '';
                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn-remove';

                // 이미지 삭제 이벤트
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const removeElIdx = [...$imglist.childNodes].indexOf(li);
                    const removeIdx = dataTransfer.files.length - $imglist.childNodes.length + removeElIdx;

                    // 새로운 DataTransfer 객체에 삭제할 파일빼고 담아서 교체
                    const files = [...dataTransfer.files]
                    files.splice(removeIdx, 1);

                    let newDataTransfer = new DataTransfer();
                    files.forEach(item => newDataTransfer.items.add(item));

                    dataTransfer = newDataTransfer;

                    // 미리보기 목록에서 삭제
                    $imglist.removeChild(li);

                    // 이미지 추가한 거 다 삭제하면 invalid
                    if ($imglist.childNodes.length === 0) {
                        validImg = false;
                        isValid();
                    }
                })

                imgItem.append(img, removeBtn);
                li.appendChild(imgItem);
                frag.appendChild(li);

            } else {
                alert('유효하지 않은 파일 입니다')
            }
        })

        $imglist.append(frag);

    } else {
        validImg = false;
        isValid();
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

    // 바로 게시글 입력창에 적용
    if (json.post.content) {
        $contentInp.value = json.post.content
    }
    if (json.post.image) {
        json.post.image.split(',').forEach(item => {
            const li = document.createElement('li');

            const imgItem = document.createElement('div');
            imgItem.className = 'img-cover';
            const img = document.createElement('img');
            img.src = checkImageUrl(item, 'post');
            img.alt = '';
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove';

            // 이미지 삭제 이벤트
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                $imglist.removeChild(li);

                // 이미지 추가한 거 다 삭제하면 invalid
                if ($imglist.childNodes.length === 0) {
                    validImg = false;
                    isValid();
                }
            })

            imgItem.append(img, removeBtn);
            li.append(imgItem);
            $imglist.append(li);
        })
    }

    return json
}

// POST/PUT 작성 완료된 게시글 내용
async function submitPostForm(METHOD) {

    // 1. 이미지는 3개까지 업로드 가능함
    if ($imglist.children.length <= 3) {
        let fileName = [];

        // 2. 
        if (METHOD === "PUT") {
            // 게시글 수정이면 기존 이미지 파일명 가져옴
            const $preImg = $imglist.querySelectorAll('img');
            const cnt = $preImg.length - dataTransfer.files.length; // 총 이미지 갯수에서 새로 추가된 이미지 갯수 빼기
            for (let i = 0; i < cnt; i++) {
                fileName.push($preImg[i].src.split('https://api.mandarin.weniv.co.kr/')[1])
            }
        }
        if ($imgInp.files[0]) {
            // 추가된 이미지가 있으면 새롭게 서버에 이미지 저장하고 가져오기
            const newImg = Array.from(dataTransfer.files).map(item => postImg(item));
            const newImgs = await Promise.all(newImg);
            fileName.push(...newImgs);
        }

        // 3. 게시물 내용 업로드/수정
        const reqPath = METHOD === "PUT" ? `/post/${POSTID}` : "/post"

        await fetch("https://api.mandarin.weniv.co.kr" + reqPath, {
            method: METHOD,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "post": {
                    "content": $contentInp.value.trim(),
                    "image": fileName.join(',')
                }
            })
        })

        return true;
    } else {
        alert('사진은 3개까지만 업로드 가능합니다 :(');
        return false;
    }
}

// POST 입력된 이미지 서버에 올리기 (한장씩)
async function postImg(item) {
    const formData = new FormData();
    formData.append("image", item);

    const res = await fetch("https://api.mandarin.weniv.co.kr" + "/image/uploadfile", {
        method: "POST",
        body: formData
    });

    const json = await res.json();

    return json.filename;
}