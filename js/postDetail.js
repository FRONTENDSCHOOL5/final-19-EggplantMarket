const postId = new URLSearchParams(location.search).get('postId') || '648bbcfdb2cb205663363788';

const url = "https://api.mandarin.weniv.co.kr";
const token = localStorage.getItem("user-token");
const myAccountName = localStorage.getItem("user-accountname");
let userAccountName = '';

const postViewSec = document.querySelector('.home-post');
const commentList = document.querySelector('.comment-list');
const profileImg = document.querySelector('.profile-img');
const commentInp = document.querySelector('#commemt-input');
const commentSubmitButton = document.querySelector('.btn-comment');

// 작성자 프로필 이미지 가져오기
async function getMyImg() {
    const reqPath = "/user/myinfo";
    const res = await fetch(url + reqPath, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const json = await res.json();
    return json.user.image;
}
(async function () {
    profileImg.src = await getMyImg();
})();

commentInp.addEventListener('keyup', (e) => {
    if (e.target.value.trim() !== '') {
        commentSubmitButton.disabled = false;
    } else {
        commentSubmitButton.disabled = true;
    }
})

commentSubmitButton.addEventListener('click', async () => {
    await postComment(commentInp.value)
    commentInp.value = '';
    // 댓글 다시 뿌리기
    const dataComments = await getComments();
    displayComment(dataComments.comments);
});

// POST 댓글
async function postComment(content) {
    try {
        const data = {
            "comment": {
                "content": content
            }
        }
        const res = await fetch(url + `/post/${postId}/comments`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const resJson = await res.json();
        console.log(resJson);

    } catch (err) {
        console.error(err);
    }
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
        const resJson = await res.json();
        // console.log(resJson);
        return resJson;
    } catch (err) {
        console.error(err);
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
        const resJson = await res.json();
        // console.log(resJson);
        return resJson;
    } catch (err) {
        console.error(err);
    }
}

// 게시글 내용 화면에 뿌리기
function displayPost(post) {
    const frag = document.createDocumentFragment();

    // h2
    const hd = document.querySelector('.home-post h2');
    hd.parentNode.setAttribute('data-postid',post.id)
    const headingContent = post.image && post.content ? '사진과 글이 함께 있는 게시물' : (post.image ? '사진만 있는 게시글' : '글만 있는 게시물');
    hd.innerHTML = headingContent;

    // section .게시글 작성자
    const userInfoSec = document.createElement('section');
    userInfoSec.setAttribute('class', 'user-follow');
    userInfoSec.innerHTML = `<h3 class="a11y-hidden">작성자 정보</h3>
    <a class="profile-img img-cover" href="./profile_info.html?accountName=${post.author.accountname}">
        <img src=${post.author.image} alt="프로필사진">
    </a>
    <a class="user-info" href="./profile_info.html?accountName=${post.author.accountname}">
        <p class="user-name">${post.author.username}</p>
        <p class="user-id">${post.author.accountname}</p>
    </a>`

    // section .게시글 내용
    // 좋아요 부분 수정하기
    const postInfoSec = document.createElement('section');
    postInfoSec.setAttribute('class', 'post-edit');
    postInfoSec.innerHTML = `<h3 class="a11y-hidden">게시물의 사진과 내용</h3>
    <div>
    </div>
        <div class="post-icon">
            <button class="btn-like ${post.hearted ? 'like' : ''}">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9202 4.01346C16.5204 3.60579 16.0456 3.28239 15.5231 3.06175C15.0006 2.8411 14.4406 2.72754 13.875 2.72754C13.3094 2.72754 12.7494 2.8411 12.2268 3.06175C11.7043 3.28239 11.2296 3.60579 10.8298 4.01346L9.99997 4.85914L9.17017 4.01346C8.36252 3.19037 7.26713 2.72797 6.12495 2.72797C4.98277 2.72797 3.88737 3.19037 3.07973 4.01346C2.27209 4.83655 1.81836 5.9529 1.81836 7.11693C1.81836 8.28095 2.27209 9.3973 3.07973 10.2204L3.90953 11.0661L9.99997 17.273L16.0904 11.0661L16.9202 10.2204C17.3202 9.81291 17.6376 9.32909 17.8541 8.79659C18.0706 8.26409 18.182 7.69333 18.182 7.11693C18.182 6.54052 18.0706 5.96977 17.8541 5.43726C17.6376 4.90476 17.3202 4.42095 16.9202 4.01346Z" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg><span class="cnt">${post.heartCount}</span>
            </button>
            <div class="btn-comment">
                <img src="../assets/icon/icon-message-circle.svg" alt="댓글 버튼"><span class="cnt">${post.comments.length}</span>
            </div>
        </div>
        <p class="post-date">${dateProcess(post.updatedAt)}</p>`
    if(post.content){
        postInfoSec.querySelector('div').insertAdjacentHTML('afterbegin',`<p class="post-text">${post.content}</p>`)
    }
    if(post.image){
        postInfoSec.querySelector('div').insertAdjacentHTML('beforeend',`<div class="img-cover">
        <img class="post-img" src=${post.image} alt="게시물 사진">
    </div>`)
    postInfoSec.querySelector('.btn-like').addEventListener('click',handleLike)
    }

    // 더보기 버튼
    const btnOption = document.createElement('button');
    btnOption.setAttribute('class', 'btn-option');
    btnOption.setAttribute('tabindex', '0');
    btnOption.innerHTML = `<img src="../assets/icon/icon-more-vertical.svg" alt="더보기 버튼">`;

    frag.append(userInfoSec, postInfoSec, btnOption);
    postViewSec.append(frag);

}


// 댓글 화면에 뿌리기
function displayComment(comments) {
    const frag = document.createDocumentFragment();

    comments.forEach(i => {
        const li = document.createElement('li');
        li.setAttribute('class', 'comment-item');
        li.innerHTML = `<div class="comment-user-info">
        <a class="user-img img-cover" href="./profile_info.html?accountName=${i.author.accountname}" tabindex="1">
            <img src=${i.author.image} alt="사용자 이미지">
        </a>
        <a class="user-name" href="./profile_info.html?accountName=${i.author.accountname}" tabindex="1"><span class="a11y-hidden">사용자
            이름,</span>${i.author.accountname}</a>
    </div>
    <p class="comment-time">${displayedAt(i.createdAt)}</p>
    <p class="comment-text">${i.content}</p>
    <button class="btn-more" tabindex="2" data-commentId=${i.id}><img src="../assets/icon/icon-more-vertical.svg" alt="더보기 버튼"></button>`;

        frag.append(li);
    })

    while (commentList.hasChildNodes()) {
        commentList.removeChild(commentList.firstChild);
    }
    commentList.append(frag);

    const commentBtnOption = document.querySelectorAll('.btn-more');
    if(commentBtnOption.length !== 0){
        handleCommentOptionModal(commentBtnOption)
    }
}

async function run() {
    // 추후 promiseAll 사용해보기
    const dataPost = await getOnePost();
    const dataComments = await getComments();

    // 모달창 관련
    userAccountName = dataPost.post.author.accountname;
    if (myAccountName !== userAccountName) {
        // 게시글 신고하기 모달
        // 댓글 신고하기 모달
    } else {
        // 게시글 삭제, 수정 모달
        // 댓글 삭제하기 모달
    }

    // 데이터 뿌리기
    displayPost(dataPost.post);
    displayComment(dataComments.comments);
    handleModal()
}


run();


function displayedAt(createdAt) {
    const milliSeconds = new Date() - new Date(createdAt)
    const seconds = milliSeconds / 1000
    if (seconds < 60) return `방금 전`
    const minutes = seconds / 60
    if (minutes < 60) {
        return `${Math.floor(minutes)}분 전`
    }
    const hours = minutes / 60
    if (hours < 24) {
        return `${Math.floor(hours)}시간 전`
    }
    else{
        return dateProcess(createdAt)
    }
 }