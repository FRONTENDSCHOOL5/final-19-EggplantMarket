const url = "https://api.mandarin.weniv.co.kr";
const myAccountName = localStorage.getItem("user-accountname");

//post 컴포넌트 불러옵니다.
const homePostList = document.querySelector(".home-post-list");
fetch('./component/post.html')
    .then(res => res.text())
    .then(data => homePostList.innerHTML = data);

// 무한 스크롤 
window.addEventListener("scroll", async () => {
    if (getScrollTop() >= getDocumentHeight() - window.innerHeight) {
        postFeed(await getData())
    };
})

let reqCnt = 0;
async function getData() {
    console.log(reqCnt)
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

async function postFeed(postsData) {
    //팔로잉이 있으면서 게시글이 1개 이상인 경우
    if (postsData.length > 0) {
        document.querySelector('.home-withfollower').style.display = '';
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

            ulNode.appendChild(liNode);
            liNode.appendChild(content);

            //게시물 종류에 따라서 추가해주는 기능
            if (item.content) {
                liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<h2 class="post-text">${item.content}</h2>`)
            } else {
                liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<h2 class="a11y-hidden">이미지만 있는 게시물</h2>`)
            }
            if (item.image) {
                item.image.split(',').forEach(item => {
                    liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<div class="img-cover"><img class="post-img" src="${checkImageUrl(item, 'post')}" alt="게시물 사진"></img></div>`)
                })
            }
            liNode.querySelector('.home-post').setAttribute('data-postid', item.id)
            //좋아요 버튼 제어
            ulNode.addEventListener('click', handleLike);
        }
        ulNode.appendChild(frag);
    }
    handleModal()
}

async function run() {
    await postFeed(await getData());
    if (document.querySelector('.home-post-list').childNodes.length === 0) {
        document.querySelector('.home-withoutfollower').style.display = '';
    }
}
run()