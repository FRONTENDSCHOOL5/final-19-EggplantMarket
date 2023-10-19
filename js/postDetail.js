import { fetchApi } from './fetch/fetchRefact.js';
import { handleModal, handleCommentOptionModal } from './modal.js';
import {checkImageUrl, dateProcess, handleLike} from './common.js'

const postId = new URLSearchParams(location.search).get('postId');

//post 컴포넌트 불러옵니다.
const templateNode = document.querySelector('.template');
fetch('./component/post.html')
    .then(res => res.text())
    .then(data => templateNode.innerHTML = data);

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
    // template 화면에 노출시키기
    const template = document.getElementById('post-template');
    const content = template.content.cloneNode(true);
    templateNode.appendChild(content);

    const frag = document.createDocumentFragment();

    const hd = document.createElement('h2');
    hd.className = 'a11y-hidden';
    const sectionNode = document.querySelector('.home-post');
    const userFollow = document.querySelector('.user-follow');
    hd.textContent = "게시글 내용";
    sectionNode.insertBefore(hd, userFollow);
    const name = document.querySelector(".user-name");
    name.textContent = post.author.username;
    const account = document.querySelector(".user-id");
    account.textContent = post.author.accountname;
    const spanNode = document.createElement('span');
    spanNode.textContent = "의 프로필 보기";
    spanNode.className = 'a11y-hidden';
    name.insertBefore(spanNode, null);

    //사용자 프로필로 이동 링크 연결
    const profileImageLink = document.querySelector(".profile-img");
    profileImageLink.href = `./profile_info.html?accountName=${post.author.accountname}`;
    const profileInfoLink = document.querySelector(".user-info");
    profileInfoLink.href = `./profile_info.html?accountName=${post.author.accountname}`;

    const profileImage = document.getElementById("profile-image");
    profileImage.src = `${checkImageUrl(post.author.image, 'profile')}`;
    const like = document.querySelector(".cnt");
    const likeBtn = document.querySelector(".btn-like");
    likeBtn.className = `btn-like ${post.hearted ? 'like' : ''}`;
    like.textContent = post.heartCount;
    const heartsvg = document.querySelector('.btn-like svg');
    heartsvg.setAttribute('fill','transparent');
    const comment = document.querySelector(".btn-comment .cnt");
    comment.textContent = post.comments.length;
    const date = document.querySelector(".post-date");
    date.textContent = dateProcess(post.createdAt);

    hd.parentNode.setAttribute('data-postid', post.id);
    const headingContent = post.content ? post.content : '사진만 있는 게시글';
    hd.textContent = headingContent;

    const postInfoSec = document.querySelector('.post-edit');
    const postIcon = document.querySelector('.post-icon');
    const divNode = document.createElement('div');
    postInfoSec.insertBefore(divNode, postIcon);
    document.querySelector('.post-edit a').remove();
    document.querySelector('.btn-comment').remove();
    const commentDiv = document.createElement('div');
    commentDiv.className = 'btn-comment';
    commentDiv.id = 'btn-comment-id';
    postIcon.appendChild(commentDiv);

    //댓글 svg icon 추가
    const commentIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const iconPath = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path');
    commentIconSvg.setAttribute('width', '20');
    commentIconSvg.setAttribute('height', '20');
    commentIconSvg.setAttribute('fill', 'none');
    commentIconSvg.setAttribute('viewBox', '0 0 20 20');
    iconPath.setAttribute(
        'd',
        'M17.5 9.58336C17.5029 10.6832 17.2459 11.7683 16.75 12.75C16.162 13.9265 15.2581 14.916 14.1395 15.6078C13.021 16.2995 11.7319 16.6662 10.4167 16.6667C9.31678 16.6696 8.23176 16.4126 7.25 15.9167L2.5 17.5L4.08333 12.75C3.58744 11.7683 3.33047 10.6832 3.33333 9.58336C3.33384 8.26815 3.70051 6.97907 4.39227 5.86048C5.08402 4.7419 6.07355 3.838 7.25 3.25002C8.23176 2.75413 9.31678 2.49716 10.4167 2.50002H10.8333C12.5703 2.59585 14.2109 3.32899 15.4409 4.55907C16.671 5.78915 17.4042 7.42973 17.5 9.16669V9.58336Z'
    );

    iconPath.setAttribute('stroke', '#767676');
    iconPath.setAttribute('stroke-width', '1.5');
    iconPath.setAttribute('stroke-linecap', 'round');
    iconPath.setAttribute('stroke-linejoin', 'round');

    commentIconSvg.appendChild(iconPath);
    commentDiv.appendChild(commentIconSvg);
    const commentSpanNode = document.createElement('span');
    commentSpanNode.textContent = post.comments.length;
    commentSpanNode.className = 'cnt';
    document.getElementById('btn-comment-id').appendChild(commentSpanNode);

    if (post.content) {
        postInfoSec.querySelector('div').insertAdjacentHTML('beforeend', `<p class="post-text">${post.content}</p>`)
    }
    if (post.image) {
        post.image.split(',').forEach(item => {
            postInfoSec.querySelector('div').insertAdjacentHTML('beforeend', `<div class="img-cover">
                <img class="post-img" src=${checkImageUrl(item, 'post')} alt="">
            </div>`)
        })
    }
    postInfoSec.querySelector('.btn-like').addEventListener('click', handleLike);

    const btnOption = document.createElement('button');
    btnOption.setAttribute('class', 'btn-option');
    btnOption.innerHTML = `<span class="a11y-hidden">게시물 옵션</span>`;

    // frag.append(userInfoSec, postInfoSec, btnOption);
    // $postViewSec.append(frag);
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
    if (commentBtnOption.length !== 0) {
        handleCommentOptionModal(commentBtnOption)
    } else {
        document.querySelector('.skip-nav a:nth-child(3)').style.display = 'none'
    }
}
// --- API 함수들 ---

// GET 프로필 이미지
async function getMyImg() {
    const json = await fetchApi({
        reqPath : "/user/myinfo", 
        method : "GET"
    });
    return json.user.image;
}

// GET 게시글 데이터
async function getOnePost() {
    return fetchApi({
        reqPath : `/post/${postId}`,
        method : "GET"
    })
}

// GET 댓글 데이터 
async function getComments() {
    return fetchApi({
        reqPath : `/post/${postId}/comments`,
        method : "GET"
    })
}

  // POST 댓글
async function postComment(content) {
    const data = {
        "comment": {
            "content": content
        }
    }
    await fetchApi({
        reqPath : `/post/${postId}/comments`,
        method : "POST",
        bodyData : data,
        toJson : false
    })
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
    else {
        return dateProcess(createdAt)
    }
}
