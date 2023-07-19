const postId = new URLSearchParams(location.search).get('postId');

const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem("user-token"),
    myAccountName = localStorage.getItem("user-accountname");
let userAccountName = '';

const $postViewSec = document.querySelector('.home-post'),
    $commentList = document.querySelector('.comment-list'),
    $profileImg = document.querySelector('.profile-img'),
    $commentInp = document.querySelector('#commemt-input'),
    $commentSubmitButton = document.querySelector('.btn-comment');

(async function () {
    const [profileImg, dataPost, dataComments] = await Promise.all([getMyImg(), getOnePost(), getComments()]);
    $profileImg.src = profileImg;
    displayPost(dataPost.post);
    displayComment(dataComments.comments);

    handleModal();
})();

$commentInp.addEventListener('input', (e) => {
    console.log(e.target.value.trim());
    $commentSubmitButton.disabled = e.target.value.trim() !== '' ? false : true;
})

$commentSubmitButton.addEventListener('click', async (e) => {
    e.target.disabled = true
    await postComment($commentInp.value)
    $commentInp.value = '';
    // 댓글 다시 뿌리기
    const dataComments = await getComments();
    displayComment(dataComments.comments);
    document.querySelector('.btn-comment .cnt').textContent = document.querySelector('.comment-list').childNodes.length
});

// 게시글 내용 화면에 뿌리기
function displayPost(post) {
    const frag = document.createDocumentFragment();

    const hd = document.querySelector('.home-post h2');
    hd.parentNode.setAttribute('data-postid',post.id)
    const headingContent = post.content ? post.content : '사진만 있는 게시글';
    hd.textContent = headingContent;

    const userInfoSec = document.createElement('div');
    userInfoSec.setAttribute('class', 'user-follow');
    userInfoSec.innerHTML = `<a class="profile-img img-cover" href="./profile_info.html?accountName=${post.author.accountname}">
        <span class="a11y-hidden">${post.author.username}의 프로필 보기</span>
        <img src=${checkImageUrl(post.author.image,'profile')} alt="">
        </a>
        <a class="user-info" href="./profile_info.html?accountName=${post.author.accountname}">
            <p class="user-name">${post.author.username}<span class="a11y-hidden">의 프로필 보기</span></p>
            <p class="user-id">${post.author.accountname}</p>
        </a>`

    const postInfoSec = document.createElement('div');
    postInfoSec.setAttribute('class', 'post-edit');
    postInfoSec.innerHTML = `<div></div>
        <div class="post-icon">
            <button class="btn-like ${post.hearted ? 'like' : ''}">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9202 4.01346C16.5204 3.60579 16.0456 3.28239 15.5231 3.06175C15.0006 2.8411 14.4406 2.72754 13.875 2.72754C13.3094 2.72754 12.7494 2.8411 12.2268 3.06175C11.7043 3.28239 11.2296 3.60579 10.8298 4.01346L9.99997 4.85914L9.17017 4.01346C8.36252 3.19037 7.26713 2.72797 6.12495 2.72797C4.98277 2.72797 3.88737 3.19037 3.07973 4.01346C2.27209 4.83655 1.81836 5.9529 1.81836 7.11693C1.81836 8.28095 2.27209 9.3973 3.07973 10.2204L3.90953 11.0661L9.99997 17.273L16.0904 11.0661L16.9202 10.2204C17.3202 9.81291 17.6376 9.32909 17.8541 8.79659C18.0706 8.26409 18.182 7.69333 18.182 7.11693C18.182 6.54052 18.0706 5.96977 17.8541 5.43726C17.6376 4.90476 17.3202 4.42095 16.9202 4.01346Z" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg><span class="cnt">${post.heartCount}</span>
            </button>
            <div class="btn-comment">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 9.58336C17.5029 10.6832 17.2459 11.7683 16.75 12.75C16.162 13.9265 15.2581 14.916 14.1395 15.6078C13.021 16.2995 11.7319 16.6662 10.4167 16.6667C9.31678 16.6696 8.23176 16.4126 7.25 15.9167L2.5 17.5L4.08333 12.75C3.58744 11.7683 3.33047 10.6832 3.33333 9.58336C3.33384 8.26815 3.70051 6.97907 4.39227 5.86048C5.08402 4.7419 6.07355 3.838 7.25 3.25002C8.23176 2.75413 9.31678 2.49716 10.4167 2.50002H10.8333C12.5703 2.59585 14.2109 3.32899 15.4409 4.55907C16.671 5.78915 17.4042 7.42973 17.5 9.16669V9.58336Z" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg><span class="cnt">${post.comments.length}</span>
            </div>
        </div>
        <p class="post-date">${dateProcess(post.updatedAt)}</p>`
    if(post.content){
        postInfoSec.querySelector('div').insertAdjacentHTML('beforeend',`<p class="post-text">${post.content}</p>`)
    }
    if(post.image){
        post.image.split(',').forEach(item=>{
            postInfoSec.querySelector('div').insertAdjacentHTML('beforeend',`<div class="img-cover">
                <img class="post-img" src=${checkImageUrl(item, 'post')} alt="">
            </div>`)
        })
    }
    postInfoSec.querySelector('.btn-like').addEventListener('click', handleLike)

    const btnOption = document.createElement('button');
    btnOption.setAttribute('class', 'btn-option');
    btnOption.innerHTML = `<span class="a11y-hidden">게시물 옵션</span>`;

    frag.append(userInfoSec, postInfoSec, btnOption);
    $postViewSec.append(frag);

}

// 댓글 화면에 뿌리기
function displayComment(comments) {
    const frag = document.createDocumentFragment();

    comments.forEach((i) => {
        const li = document.createElement('li');
        li.setAttribute('class', 'comment-item');

        const commentUserInfoDiv = document.createElement('div');
        commentUserInfoDiv.setAttribute('class', 'comment-user-info');

        const userImgLink = document.createElement('a');
        userImgLink.setAttribute('class', 'user-img img-cover');
        userImgLink.href = `./profile_info.html?accountName=${i.author.accountname}`;

        const hiddenTextSpan = document.createElement('span');
        hiddenTextSpan.setAttribute('class', 'a11y-hidden');
        hiddenTextSpan.textContent = `${i.author.username}의 프로필 보기`;

        const userImg = document.createElement('img');
        userImg.src = i.author.image;
        userImg.alt = '';

        userImgLink.append(hiddenTextSpan, userImg);

        const userNameLink = document.createElement('a');
        userNameLink.setAttribute('class', 'user-name');
        userNameLink.href = `./profile_info.html?accountName=${i.author.accountname}`;
        userNameLink.textContent = i.author.accountname;

        const userNameHiddenText = document.createElement('span');
        userNameHiddenText.setAttribute('class', 'a11y-hidden');
        userNameHiddenText.textContent = `의 프로필 보기`;

        userImgLink.append(hiddenTextSpan)

        commentUserInfoDiv.append(userImgLink, userNameLink);

        const commentTimeParagraph = document.createElement('p');
        commentTimeParagraph.setAttribute('class', 'comment-time');
        commentTimeParagraph.textContent = displayedAt(i.createdAt);

        const commentTextHeading = document.createElement('h3');
        commentTextHeading.setAttribute('class', 'comment-text');
        commentTextHeading.textContent = i.content;

        const commentOptionsButton = document.createElement('button');
        commentOptionsButton.setAttribute('class', 'btn-more');
        commentOptionsButton.setAttribute('data-commentId', i.id);

        const commentOptionsHiddenText = document.createElement('span');
        commentOptionsHiddenText.setAttribute('class', 'a11y-hidden');
        commentOptionsHiddenText.textContent = '댓글 옵션';

        commentOptionsButton.appendChild(commentOptionsHiddenText);

        li.append(commentUserInfoDiv, commentTimeParagraph, commentTextHeading, commentOptionsButton);

        frag.appendChild(li);
    });

    while ($commentList.hasChildNodes()) {
        $commentList.removeChild($commentList.firstChild);
    }
    $commentList.append(frag);

    const commentBtnOption = document.querySelectorAll('.btn-more');
    if(commentBtnOption.length !== 0){
        handleCommentOptionModal(commentBtnOption)
    } else{
        document.querySelector('.skip-nav a:nth-child(3)').style.display='none'
    }
}


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

// --- ---


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