const token = localStorage.getItem('user-token');

const writerImg = document.querySelector('.user-profile img');
const uploadButton = document.querySelector('#upload-btn');
const imglist = document.querySelector('.upload-imgs-list');
const contentInp = document.querySelector('textarea');
const imgInp = document.querySelector('#input-file');

const pageUrl = new URL(window.location.href);
const POSTID = pageUrl.searchParams.get('postId')
const METHOD = POSTID ? 'PUT' : 'POST'

async function getPostData(){
    const res = await fetch(`https://api.mandarin.weniv.co.kr/post/${POSTID}`,{
        method : "GET",
        headers : {
            "Authorization" : `Bearer ${token}`,
            "Content-type" : "application/json"
        }
    })
    const json = await res.json();
    
    console.log(json)
    if(json.post.content){
        document.querySelector('textarea').value=json.post.content
    }
    if(json.post.image){
        json.post.image.split(',').forEach(item=>{
            const li = document.createElement('li');
                li.innerHTML = `<div class="img-cover">
                <img src=${checkImageUrl(item,'post')} alt="">
                <button class="btn-remove"></button>
            </div>`;
            imglist.append(li);
        })
    }

    return json
}
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

if(POSTID){
    uploadButton.textContent = '수정'
    uploadButton.disabled = false
    getPostData()
}


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
            [...input.files].forEach(item=>{
            if (checkImageExtension(item)) {
                // 이미지 입력되면 valid
                validImg = true;

                var reader = new FileReader();
                reader.addEventListener('load', function (e) {
                    const li = document.createElement('li');
                    li.innerHTML = `<div class="img-cover">
                    <img src=${e.target.result} alt="">
                    <button class="btn-remove"></button>
                </div>`;
                    imglist.append(li);
                });
                reader.readAsDataURL(item);
            } else {
                alert('유효하지 않은 파일 입니다')
                input.value = '';
            }
        })
        }
    }
})()

// 이미지 삭제
imglist.addEventListener('click', (e) => {
    e.preventDefault();
    // 이벤트 위임
    if (e.target.className === 'btn-remove') {
        const removeIdx = [...imglist.childNodes].indexOf(e.target.closest('li'))

        e.target.closest('li').remove();

        const updatedFileList = removeFileFromList(imgInp.files,removeIdx)
        imgInp.files = updatedFileList;

        if (imglist.children.length === 0) {
            // 이미지 추가한 거 다 삭제하면 invalid
            validImg = false;
            isValid()
        }
    }
})

function removeFileFromList(fileList, index) {
    let files = Array.from(fileList); // FileList를 배열로 변환
    files.splice(index, 1); // 해당 인덱스의 요소를 제외
  
    // 새로운 FileList를 생성하기 위해 DataTransfer 객체 사용
    let dataTransfer = new DataTransfer();
    files.forEach(function (file) {
      dataTransfer.items.add(file); // 새로운 DataTransfer 객체에 파일 추가
    });
  
    // DataTransfer 객체에서 FileList를 추출
    const newFileList = dataTransfer.files;
  
    return newFileList; // 새로운 FileList 반환
}

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
    await submitPostForm(METHOD);
    console.log('게시글 작성 완료');
    location.href=`./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`
})

// 작성 완료된 게시글 내용 post요청
async function submitPostForm(METHOD) {
    const token = localStorage.getItem('user-token');

    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = METHOD=== "PUT" ? `/post/${POSTID}` : "/post"

    // 서버에 이미지 저장하고 가져오기
    let fileName;
    if(METHOD === "PUT" && !document.querySelector('#input-file').files[0]){
        if(document.querySelectorAll('.img-cover img')){
            fileName = document.querySelector('.img-cover img').src
        }
    } else{
        console.log('POST!!!')
        fileName = await postImg();
    }

    console.log(METHOD,fileName)

    const data = {
        "post": {
            "content": contentInp.value,
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

// 입력된 이미지 서버에 올리기
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

// --- end of 게시글 작성하기 ---

//고대비 테마
const wrapper = document.querySelector('.post-upload-wrapper');
const theme = window.localStorage.getItem('theme');
if (theme === 'highContrast') {
    wrapper.classList.add('highContrast');
    document.body.style.backgroundColor = '#000000';
    document.getElementById("post-upload-backBtn").src = "../assets/icon/icon-arrow-left-hc.svg";
    document.getElementById("image-upload-btn").src = "../assets/upload-file-hc.svg";

} else {
    wrapper.classList.remove('highContrast');
    document.body.style.backgroundColor = '#ffffff'; 
    
}