// common
async function handleLike(event){
    const target = event.target;

    if(target.tagName === 'path'){
        const targetPost = target.closest('.home-post');
        const likeBtn = targetPost.querySelector('.btn-like');
        const postId = targetPost.getAttribute('data-postid');
        const isLiked = likeBtn.classList.contains('like');

        const result = isLiked ? await fetchLike(postId, 'unheart', 'DELETE') : await fetchLike(postId, 'heart', 'POST')
        likeBtn.querySelector('.cnt').textContent = `${result.post.heartCount}`
        result.post.hearted ? likeBtn.classList.add('like') : likeBtn.classList.remove('like')
    }
}

async function requestLike(postId,action,method){
    try{
        const res = await fetch(`${url}/post/${postId}/${action}`, {
                        method: method,
                        headers : {
                            "Authorization" : `Bearer ${localStorage.getItem('user-token')}`,
                            "Content-type" : "application/json"
                        }
                    });
        const resJson = await res.json();

        return resJson
    } catch(err){
        console.error(err);
        location.href='./404.html'
    }
}

// follower, following

// GET 사용자 팔로워/팔로잉 목록 
/*
`/profile/${accountname}/follower?limit=12&skip=`;
`/profile/${accountname}/following?limit=12&skip=`
*/
function fetchFollowerList() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = `/profile/${accountname}/follower?limit=12&skip=`;
    let reqCnt = 0; // 클로저로 사용될 요청 카운트 변수

    const getFollowerList = async () => {
        const res = await fetch(url + reqPath + reqCnt * 12, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });

        reqCnt++; // 요청 후에 카운트를 증가시킴
        const json = await res.json();
        return json;
    };

    return getFollowerList; // 클로저 함수 반환
}

// POST 팔로우
async function postFollow(accountName) {
    try {
        await fetch('https://api.mandarin.weniv.co.kr' + `/profile/${accountName}/follow`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });
    } catch (err) {
        location.href='./404.html'
    }
}

// DELETE 팔로우
async function deleteFollow(accountName) {
    try {
        await fetch('https://api.mandarin.weniv.co.kr' + `/profile/${accountName}/unfollow`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });
    } catch (err) {
        location.href='./404.html'
    }
}


// homesearch

// api 연동 
async function getData(userInp) {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/searchuser/?keyword=";
    const res = await fetch(url + reqPath + userInp, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json"
        },
    })
    const json = await res.json();
    return json;
}

// home

let reqCnt = 0;
async function getData() {
    const res = await fetch(url + `/post/feed/?limit=10&skip=${reqCnt++ * 10}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json"
        },
    });
    const resJson = await res.json();
    return resJson.posts;
}

// join.js
// api 연동 
async function validateEmail() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/emailvalid";
    const emailData = {
        "user": {
            "email": email.value.trim()
        }
    }
    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(emailData)
    })
    const json = await res.json();
    return json;
}

// login_email
// api 연동 
async function login() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/login/";
    const loginData = {
        "user": {
            "email": email.value,
            "password": pw.value
        }
    }
    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...loginData })
    })
    const json = await res.json()

    if (json.status !== 422) { // 로그인 성공
        localStorage.setItem("user-token", json.user.token);
        localStorage.setItem("user-accountname", json.user.accountname);
        location.href = './home.html';
    } else {
        document.querySelector('.warning-msg-2').style.display = 'block';
    }
}

// modal

// ============== API 함수들 ==========
// 삭제 api
async function deleteItem(targetType, targetId, targetCommentId) {
    const fullUrl = targetCommentId
      ? `https://api.mandarin.weniv.co.kr/post/${targetId}/comments/${targetCommentId}`
      : targetType !== "상품"
      ? `https://api.mandarin.weniv.co.kr/post/${targetId}`
      : `https://api.mandarin.weniv.co.kr/product/${targetId}`; // 순서대로 댓글 주소, 게시글 주소, 상품 주소
    const options = {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("user-token")}`,
        "Content-type": "application/json",
      },
    };
    try {
      await fetch(fullUrl, options);
      if (targetType === "게시글" && window.location.href.includes("detail")) {
        // 게시글이면서 detail을 포함한 것을 삭제했을 경우 전화면으로 이동하면서 새로 로딩
        location.href = document.referrer;
      } else {
        // 그 외의 경우에는 위치한 페이지에서 바로 reload()
        location.reload();
      }
    } catch (err) {
      console.error(err);
      location.href = "./404.html";
    }
  }
  
  // 신고 api
  async function reportItem(targetId, targetCommentId) {
    const fullUrl = targetCommentId ? `https://api.mandarin.weniv.co.kr/post/${targetId}/comments/${targetCommentId}/report` : `https://api.mandarin.weniv.co.kr/post/${targetId}/report`;
  
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("user-token")}`,
        "Content-type": "application/json",
      },
    };
    try {
      await fetch(fullUrl, options);
    } catch (err) {
      console.error(err);
      location.href = "./404.html";
    }
  }
  
  handleModal(); // 모달 실행
  

// postDetail
// --- API 함수들 ---

// GET 프로필 이미지
async function getMyImg() {
    const res = await fetch(url + "/user/myinfo", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const json = await res.json();
    return json.user.image;
}

// GET 게시글 데이터
async function getOnePost() {
    try {
        const res = await fetch(url + `/post/${postId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });
        return res.json();
    } catch (err) {
        location.href = './404.html'
    }
}

// GET 댓글 데이터 
async function getComments() {
    try {
        const res = await fetch(url + `/post/${postId}/comments`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });
        return res.json();
    } catch (err) {
        location.href = './404.html'
    }
}

// POST 댓글
async function postComment(content) {
    try {
        await fetch(url + `/post/${postId}/comments`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "comment": {
                    "content": content
                }
            })
        });
    } catch (err) {
        location.href = './404.html'
    }
}

// postUpload

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
    return json.post;
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

// productUpload
// 입력된 정보 저장하기
async function saveProduct(url, token, METHOD) {
    // 가격
    const price = parseInt(productPrice.value);
    // 이미지 저장
    const fileName = await saveImage();
    const imageURL = url + `/${fileName}`;

    // 데이터 생성
    const data = {
        product: {
            itemName: productName.value,
            price: price,
            link: purchaseLink.value,
            itemImage: imageURL,
        },
    };

    try {
        const currentImageSrc = imageInput.style.backgroundImage;
        let updatedData = { ...data };
        let checkURL = `url('${imageURL}')`;
        const reqPath = (METHOD === "POST") ? url + "/product" : url + `/product/${productID}`
        if (currentImageSrc !== checkURL) {
            updatedData.product.itemImage = currentImageSrc.slice(5, -2);
        }
        
        await fetch(reqPath, {
            method: METHOD,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });
    } catch (err) {
        console.error(err);
        location.href = "./404.html";
        // 저장 실패 시 에러 처리
    }
}

// ======== API 함수들 ========
async function loadProduct(url, token, productID) { // 저장된 데이터 가져오기
    try {
        const res = await fetch(url + `/product/detail/${productID}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
            },
        });
        const resJson = await res.json();
        return resJson;
    } catch (err) {
        console.error(err);
        location.href = "./404.html";
    }
}

async function saveImage() {
    const file = imgInput.files[0];
    const formData = new FormData();
    const reqPath = "/image/uploadfile";
    if (file) {
        formData.append("image", file);
        const res = await fetch(url + reqPath, {
            method: "POST",
            body: formData,
        });
        const json = await res.json();
        return json.filename;
    }
}

async function postImg(imageFile){
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await fetch( url + "/image/uploadfile", {
        method: "POST",
        body: formData,
    });
    const json = await res.json();
    const imageURL = url + `/${json.filename}`;

    // 보여지는 이미지 업데이트
    imageInput.style.backgroundImage = `url('${imageURL}')`;
    imageInput.style.backgroundSize = "cover";
    imageInput.style.backgroundPosition = "center";
    imageInput.style.backgroundRepeat = "no-repeat";
}


// profile_info

async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        return response.json();
    } catch (err) {
        location.href='./404.html'
    }
}

async function getProfileData() { 
    const fullUrl = `${url}/profile/${profileAccountName}`;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

async function getProductData() { 
    const fullUrl = `${url}/product/${profileAccountName}`;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

function fetchPostData(){
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = `/post/${profileAccountName}/userpost?limit=6&skip=`
    let reqCnt = 0;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json"
        }
    }
    const getPostData = async () => await fetchData(url + reqPath + reqCnt++ * 6, options)

    return getPostData
}

async function postFollow() {
    const fullUrl = `${url}/profile/${profileAccountName}/follow`,
    options = {
        method: "POST",
        headers : {
            "Authorization" : `Bearer ${token}`,
            "Content-type" : "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

async function deletefollow() {
    const fullUrl = `${url}/profile/${profileAccountName}/unfollow`,
    options = {
        method: "DELETE",
        headers : {
            "Authorization" : `Bearer ${token}`,
            "Content-type" : "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

// profile_modification

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
// setProfile

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