// const postId = new URLSearchParams(location.search).get('postId') || '6491b73cb2cb2056634d2217';
const postId = '6491b73cb2cb2056634d2217';

const url = "https://api.mandarin.weniv.co.kr";
const token = localStorage.getItem("user-token");
const myAccountName = localStorage.getItem("user-accountname");
let userAccountName = '';

const postViewSec = document.querySelector('.home-post');
const commentViewSec = document.querySelector('.post-comment');


// GET 데이터
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
        console.log(resJson);
        return resJson;
    } catch (err) {
        console.error(err);
    }
}
// getOnePost();

// DOM 데이터
function displayPost(post) {
    const frag = document.createDocumentFragment();

    // h2
    const hd = document.createElement('h2');
    const headingContent = post.image && post.content ? '이미지와 글이 함께 있는 게시물' : (post.image ? '이미지만 있는 게시글' : '글만 있는 게시물')
    hd.innerHTML = `<h3 class="a11y-hidden">${headingContent}</h3>`;

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
    // 컴포넌트 마크업 재영오빠 코드 반영하기 ! ! ! ! !
    const postInfoSec = document.createElement('section');
    postInfoSec.setAttribute('class', 'post-edit');
    postInfoSec.innerHTML = `<h4 class="a11y-hidden">게시물의 사진과 내용</h4>
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

    frag.append(hd, userInfoSec, postInfoSec, btnOption);
    postViewSec.append(frag);

}


async function run() {
    const data = await getOnePost();

    // 모달창 관련
    userAccountName = data.post.author.accountname;
    if (myAccountName !== userAccountName) {
        // 게시글 신고하기 모달
        // 댓글 신고하기 모달
    } else {
        // 게시글 삭제, 수정 모달
        // 댓글 삭제하기 모달
    }

    // 데이터 뿌리기
    displayPost(data.post);
}

run();
