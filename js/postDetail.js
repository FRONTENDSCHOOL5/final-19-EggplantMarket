const postId = new URLSearchParams(location.search).get('postId');

const url = "https://api.mandarin.weniv.co.kr";
const token = localStorage.getItem("user-token");
const myAccountName = localStorage.getItem("user-accountname");
let userAccountName = '';

const postViewSec = document.querySelector('.home-post');
const commentList = document.querySelector('.comment-list');
const commentInp = document.querySelector('#commemt-input');
const commentSubmitButton = document.querySelector('.btn-comment');

commentInp.addEventListener('keyup', (e) => {
    console.log(e.target.value)
    if (e.target.value !== '') {
        commentSubmitButton.disabled = false;
    } else {
        commentSubmitButton.disabled = true;
    }
})


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
    const headingContent = post.image && post.content ? '사진과 글이 함께 있는 게시물' : (post.image ? '사진만 있는 게시글' : '글만 있는 게시물');
    hd.innerHTML = headingContent;

    // section .게시글 작성자
    const userInfoSec = document.createElement('section');
    userInfoSec.setAttribute('class', 'user-follow');
    userInfoSec.innerHTML = `<h3 class="a11y-hidden">작성자 정보</h3>
    <a class="profile-img img-cover" href="./profile_info.html">
        <img src=${post.author.image} alt="프로필사진">
    </a>
    <a class="user-info" href="./profile_info.html">
        <p class="user-name">${post.author.username}</p>
        <p class="user-id">@${post.author.accountname}</p>
    </a>`

    // section .게시글 내용
    // 좋아요 부분 수정하기
    const postInfoSec = document.createElement('section');
    postInfoSec.setAttribute('class', 'post-edit');
    postInfoSec.innerHTML = `<h3 class="a11y-hidden">게시물의 사진과 내용</h3>
    <a href="./post_detail.html">
        <p class="post-text">${post.content}</p>
            <div class="img-cover">
                <img class="post-img" src=${post.image} alt="게시물 사진">
            </div>
        </a>
        <div class="post-icon">
            <button class="btn-like ${post.hearted ? 'like' : ''}">
                <img src="../assets/icon/icon-heart.svg" alt="좋아요 버튼"><span class="cnt">${post.heartCount}</span>
            </button>
            <a class="btn-comment" href="./post_detail.html">
                <img src="../assets/icon/icon-message-circle.svg" alt="댓글 버튼"><span class="cnt">${post.comments.length}</span>
            </a>
        </div>
        <p class="post-date">${post.updatedAt}</p>`

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
        <a class="user-img img-cover" href="./profile_info.html" tabindex="1">
            <img src=${i.author.image} alt="사용자 이미지">
        </a>
        <a class="user-name" href="./profile_info.html" tabindex="1"><span class="a11y-hidden">사용자
            이름,</span>${i.author.acountname}</a>
    </div>
    <p class="comment-time">${i.createdAt}</p>
    <p class="comment-text">${i.content}</p>
    <button class="btn-more" tabindex="2"><img src="../assets/icon/icon-more-vertical.svg" alt="더보기 버튼"></button>`;

        frag.append(li);
    })

    commentList.append(frag);
}

async function run() {
    const dataPost = await getOnePost();
    const dataComments = await getComments();

    // 모달창 관련
    console.log(dataPost)
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
}

run();
