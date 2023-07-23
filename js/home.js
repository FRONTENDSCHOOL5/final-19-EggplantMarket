

const url = "https://api.mandarin.weniv.co.kr";
const myAccountName = localStorage.getItem("user-accountname");

// 무한 스크롤 
window.addEventListener("scroll", async () => {
    if (getScrollTop() >= getDocumentHeight() - window.innerHeight) {
        console.log('바닥이당! 데이터 불러올게 기다려!')
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
    console.log(postsData)

    //팔로잉이 있으면서 게시글이 1개 이상인 경우
    if (postsData.length > 0) {
        
        document.querySelector('.home-withfollower').style.display = '';
        console.log('한명이상있어요')

        const ulNode = document.querySelector('.home-post-list');
        const frag = document.createDocumentFragment();

        for (let i = 0; i < postsData.length; i++) {
            const item = postsData[i];

            const liNode = document.createElement('li');
            liNode.innerHTML = `
                    <section class="home-post">
                        <div class="user-follow">
                            <a class="profile-img img-cover" href="./profile_info.html?accountName=${item.author.accountname}">
                                <span class="a11y-hidden">${item.author.username}의 프로필 보기</span>
                                
                                <img src="${checkImageUrl(item.author.image,'profile')}" alt="">
                            </a>
                            <a class="user-info" href="./profile_info.html?accountName=${item.author.accountname}">
                                <p class="user-name">${item.author.username}<span class="a11y-hidden">의 프로필 보기</span></p>
                                <p class="user-id">${item.author.accountname}</p>
                            </a>
                        </div>
                        <div class="post-edit">
                            <a href = "./post_detail.html?postId=${item.id}">
                                <span class="a11y-hidden">게시물 상세보기</span>
                            </a>
                            <div class="post-icon">
                            <button class="btn-like ${item.hearted ? 'like' : ''}">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="transparent" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.9202 4.01346C16.5204 3.60579 16.0456 3.28239 15.5231 3.06175C15.0006 2.8411 14.4406 2.72754 13.875 2.72754C13.3094 2.72754 12.7494 2.8411 12.2268 3.06175C11.7043 3.28239 11.2296 3.60579 10.8298 4.01346L9.99997 4.85914L9.17017 4.01346C8.36252 3.19037 7.26713 2.72797 6.12495 2.72797C4.98277 2.72797 3.88737 3.19037 3.07973 4.01346C2.27209 4.83655 1.81836 5.9529 1.81836 7.11693C1.81836 8.28095 2.27209 9.3973 3.07973 10.2204L3.90953 11.0661L9.99997 17.273L16.0904 11.0661L16.9202 10.2204C17.3202 9.81291 17.6376 9.32909 17.8541 8.79659C18.0706 8.26409 18.182 7.69333 18.182 7.11693C18.182 6.54052 18.0706 5.96977 17.8541 5.43726C17.6376 4.90476 17.3202 4.42095 16.9202 4.01346Z" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg><span class="cnt">${item.heartCount}</span>
                                </button>
                                <a class="btn-comment" href = "./post_detail.html?postId=${item.id}">
                                    <span class="a11y-hidden">게시물 댓글 보러가기</span>
                                    <img src="../assets/icon/icon-message-circle.svg" alt=""><span class="cnt">${item.commentCount}</span>
                                </a>
                            </div>
                            <p class="post-date">${dateProcess(item.createdAt)}</p>
                        </div>
                        <button class="btn-option"><span class="a11y-hidden">게시물 옵션</span></button>
                    </section>`
            if (item.content) {
                liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<h2 class="post-text">${item.content}</h2>`)
            } else {
                liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<h2 class="a11y-hidden">이미지만 있는 게시물</h2>`)
            }
            if (item.image) {
                item.image.split(',').forEach(item=>{
                    liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<div class="img-cover"><img class="post-img" src="${checkImageUrl(item,'post')}" alt="게시물 사진"></img></div>`)
                    // liNode.querySelector('.post-edit a').insertAdjacentHTML('beforeend', `<div class="img-cover"><img class="post-img" src="${item}" alt="게시물 사진"></img></div>`)
                })
                
            }
            liNode.querySelector('.home-post').setAttribute('data-postid',item.id)
            frag.appendChild(liNode)
        }
        ulNode.appendChild(frag);
        ulNode.addEventListener('click',handleLike)
    } 
    handleModal()
}

async function run() {
    await postFeed(await getData());
    if(document.querySelector('.home-post-list').childNodes.length === 0){
        document.querySelector('.home-withoutfollower').style.display = '';
    }
}
run()

//테마 작업 진행중.
// const wrapper = document.querySelector('.home-wrapper');
// const theme = window.localStorage.getItem('theme');
// if (theme === 'highContrast') {
//     wrapper.classList.add('highContrast');
//     document.body.style.backgroundColor = '#000000';

// } else {
//     wrapper.classList.remove('highContrast');
//     document.body.style.backgroundColor = '#ffffff'; 
    
// }