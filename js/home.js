const url = "https://api.mandarin.weniv.co.kr";

async function postFeed() {

    const res = await fetch(url + "/post/feed/", {

        method: "GET",
        headers: {
            //토큰 받아와야함(O)
            "Authorization": `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json"
        },
    });
    const resJson = await res.json();

    //팔로우 있을경우 없을경우 보여주는 창 다르게 구현(O)
    if (resJson.posts.length > 0) {
        document.querySelector('.home-withoutfollower').style.display = 'none';
        document.querySelector('.home-withfollower').style.display = '';
        console.log('한명이상있어요')
    }
    // document.querySelector('.user-follow a img').src = resJson.posts[0].author.image;

    // document.querySelector('.user-name').textContent = resJson.posts[0].author.username ;
    // document.querySelector('.user-id').textContent = resJson.posts[0].author.accountname ;
    // document.querySelector('.post-text').textContent = resJson.posts[0].content ;

    let writeTime = resJson.posts[0].createdAt.split('-');
    let year = writeTime[0];
    let month = writeTime[1];
    let day = writeTime[2].substr(0, 2);


    // console.log(resJson);

    const ulNode = document.querySelector('.home-post-list')
    const liNode = document.createElement('li')

    liNode.innerHTML = `
    <section class="home-post">
    <h2 class="a11y-hidden">사진과 글을 함께 올리는 게시물</h2>
    <section class="user-follow">
        <h3 class="a11y-hidden">유저정보</h3>
        <a class="profile-img img-cover" href="./profile_info.html" tabindex="1">
            <img src="${resJson.posts[0].author.image}" alt="프로필사진">
        </a>
        <a class="user-info" href="./profile_info.html" tabindex="1">
            <p class="user-name">${resJson.posts[0].author.username}</p>
            <p class="user-id">${resJson.posts[0].author.accountname}</p>
        </a>
    </section>
    <section class="post-edit">
        <h4 class="a11y-hidden">게시물의 사진과 내용</h4>
        <a href="./post_detail.html" tabindex="1">
            <p class="post-text">${resJson.posts[0].content}</p>
                
            </a>
            <div class="post-icon">
                <button class="btn-like">
                    <img src="../assets/icon/icon-heart.svg" alt="좋아요 버튼"><span class="cnt">${resJson.posts[0].heartCount}</span>
                </button>
                <a class="btn-comment" href="./post_detail.html" tabindex="1">
                    <img src="../assets/icon/icon-message-circle.svg" alt="댓글 버튼"><span class="cnt">${resJson.posts[0].commentCount}</span>
                </a>
            </div>
            <p class="post-date">${year}년 ${month}월 ${day}일</p>
        </section>
        <button class="btn-option"><img src="../assets/icon/icon-more-vertical.svg" alt="더보기 버튼"></button>
</section>`
    ulNode.appendChild(liNode)






}

postFeed();





