import {checkImageUrl, dateProcess, handleLike} from "./common.js"
import { fetchClosure, fetchApi } from "./fetch/fetchRefact.js";
import { handleModal } from "./modal.js";
import { observer } from "./observer.js";

let getFeedData = fetchClosure({
    reqpath: `/post/feed/`,
    cnt: 10
})

//post 컴포넌트 불러옵니다.
const homePostList = document.querySelector(".home-post-list");
fetch('./component/post.html')
    .then(res => res.text())
    .then(data => homePostList.innerHTML = data);

async function run() {
    const existFollowing = (await fetchApi({
        reqPath: `/profile/${localStorage.getItem('user-accountname')}`,
        method: "GET"
    })).profile.followingCount;

    if (existFollowing) {
        document.querySelector('.home-withfollower').style.display = '';
        const data = (await getFeedData()).posts;
        data.length && await postFeed(data);
    } else {
        document.querySelector('.home-withoutfollower').style.display = '';
    }
};
run();

// 무한 스크롤 
async function handleScroll() {
    if (Math.ceil(getScrollTop()) >= getDocumentHeight() - window.innerHeight) {
        const feedData = (await getFeedData()).posts;
        if (feedData.length === 0) {
            getFeedData = null; // 자유변수 참조 해제
            removeScrollEvent(); // 스크롤 이벤트 제거
            return;
        }
        postFeed(feedData);
    }
}
function removeScrollEvent() {
    window.removeEventListener("scroll", handleScroll);
}
window.addEventListener("scroll", handleScroll);

async function postFeed(postsData) {
    const ulNode = document.querySelector('.home-post-list');
    const frag = document.createDocumentFragment();

    for (let i = 0; i < postsData.length; i++) {
        const item = postsData[i];
        const liNode = document.createElement('li');
        const template = document.getElementById('post-template');
        const content = template.content.cloneNode(true);

        const profileImageLink = content.querySelector(".profile-img");
        profileImageLink.href = `./profile_info.html?accountName=${item.author.accountname}`;
        const profileImage = content.getElementById("profile-image");
        profileImage.src = `${checkImageUrl(item.author.image, 'profile')}`;
        profileImage.setAttribute('alt', '');

        const account = content.querySelector(".user-id");
        account.textContent = item.author.accountname;
        const name = content.querySelector(".user-name");
        name.textContent = item.author.username;
        const profileInfoLink = content.querySelector(".user-info");
        profileInfoLink.href = `./profile_info.html?accountName=${item.author.accountname}`;
        const postLink = content.querySelector(".post-edit a");
        postLink.href = `./post_detail.html?postId=${item.id}`;
        const commentLink = content.querySelector(".btn-comment");
        commentLink.href = `./post_detail.html?postId=${item.id}`;

        const like = content.querySelector(".cnt");
        like.textContent = item.heartCount;
        const likeBtn = content.querySelector(".btn-like");
        likeBtn.className = `btn-like ${item.hearted ? 'like' : ''}`;
        const commentIconSvg = content.querySelector('.btn-like svg');
        commentIconSvg.setAttribute('fill', 'transparent');
        const comment = content.querySelector(".btn-comment .cnt");

        comment.textContent = item.commentCount;
        const date = content.querySelector(".post-date");
        date.textContent = dateProcess(item.createdAt);

        liNode.appendChild(content);

        //게시물 종류에 따라서 추가해주는 기능
        if (item.content) {
            liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<h2 class="post-text">${item.content}</h2>`)
        } else {
            liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<h2 class="a11y-hidden">이미지만 있는 게시물</h2>`)
        }
        if (item.image) {
            item.image.split(',').forEach(item => {
                const imgCoverDiv = document.createElement('div');
                imgCoverDiv.classList.add('img-cover');

                const postImg = document.createElement('img');
                postImg.classList.add('post-img');
                postImg.setAttribute('data-src', checkImageUrl(item, 'post'));
                postImg.setAttribute('alt', '게시물 사진');

                imgCoverDiv.appendChild(postImg); 

                liNode.querySelector('.post-edit a').appendChild(imgCoverDiv);
                observer.observe(postImg);
            })
        }
        liNode.querySelector('.home-post').setAttribute('data-postid', item.id)
        frag.appendChild(liNode)
    }
    ulNode.appendChild(frag);
    ulNode.addEventListener('click', handleLike);

    handleModal()
}
