const url = "https://api.mandarin.weniv.co.kr",
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OGQ4MDU2YjJjYjIwNTY2MzM4MWQzNSIsImV4cCI6MTY5MjE3OTIwMywiaWF0IjoxNjg2OTk1MjAzfQ.GEfv4S1mZV1VQC2lVN1HebucHOSencMXhcn802YBblc"

/**
 * 분기1
 * 내 프로필인지 다른 사람 프로필인지 체크
 */


async function Load(url, token, accountName) { 
    try{
        const res = await fetch(url+`/profile/${accountName}`, {
                        method: "GET",
                        headers : {
                            "Authorization" : `Bearer ${token}`
                        }
                    });
        const resJson = await res.json();
        console.log(resJson)
        return resJson
    } catch(err){
        console.error(err);
    }
}

async function ProductLoad(url,token, accountName) { 
    try{
        const res = await fetch(url+`/product/${accountName}`, {
                        method: "GET",
                        headers : {
                            "Authorization" : `Bearer ${token}`,
                            "Content-type" : "application/json"
                        }
                    });
        const resJson = await res.json();
        console.log(resJson)
        return resJson
    } catch(err){
        console.error(err);
    }
}

async function postLoad(url, token, accountName) {
    try {
        const res = await fetch(url + `/post/${accountName}/userpost`,{
            method : "GET",
            headers : {
                "Authorization" : `Bearer ${token}`,
                "Content-type" : "application/json"
            }
        });

        const resJson = await res.json();
        console.log(resJson)
        return resJson
    } catch(err){
        console.error(err)
    }
}

function introUpdate(profile_data){

    const userName = document.querySelector('.profile-name'),
    accountName = document.querySelector('.profile-id'),
    intro = document.querySelector('.profile-intro'),
    followerElement = document.querySelector('.follower'),
    followingElement = document.querySelector('.following'),
    profileImg = document.querySelector('.img-crop img'),
    followBtn = document.querySelector('.btn-follow'),
    unFollowBtn = document.querySelector('.btn-follow.cancle');


    userName.appendChild(document.createTextNode(profile_data.username))
    accountName.appendChild(document.createTextNode(profile_data.accountname))
    if(profile_data.intro !== ""){
        intro.childNodes[1].textContent = profile_data.intro
    }
    followerElement.textContent = profile_data.followerCount;
    followingElement.textContent = profile_data.followingCount;
    profileImg.src=`${profile_data.image}`

    profile_data.isfollow ? followBtn.classList.add('hidden') : unFollowBtn.classList.add('hidden')
}

function productUpdate(product_data,count){
    if(count==0){
        document.querySelector('.product-container').style.display='none'
    } else{

        const productList = document.querySelector('.product-list')

        product_data.forEach(item => {
            
            const productItem = document.createElement('li')
            productItem.classList.add('product-item')
            productItem.innerHTML = `
                <button class="product" tabindex="1">
                    <strong class="product-name"><span class="a11y-hidden">상품 이름,</span>${item.itemName}</strong>
                    <img class="product-img" src="${item.itemImage}" alt="">
                    <strong class="product-price"><span class="a11y-hidden">금액,</span><span class="price">${Number(item.price).toLocaleString()}</span>원</strong>
                </button>`
            productList.appendChild(productItem)
        })
    }
}


function postUpdate(post_data){
    
    if (!post_data.length){
        document.querySelector('.post-container').style.display='none'
    } else{
        const listUl = document.querySelector('.post-sec .post-list')
        post_data.forEach((item)=>{
            const listLi = document.createElement('li')
            const itemDate = new Date(item.createdAt)
            const YEAR = itemDate.getFullYear()
            const MONTH = (itemDate.getMonth()+1) >= 10 ? (itemDate.getMonth()+1) : '0'+(itemDate.getMonth()+1)
            const DAY = itemDate.getDate()
            listLi.innerHTML = `
                <section class="home-post">
                    <h2 class="a11y-hidden">사진과 글을 함께 올리는 게시물</h2>
                    <section class="user-follow">
                        <h3 class="a11y-hidden">유저정보</h3>
                        <a class="profile-img img-cover" href="./profile_info.html" tabindex="1">
                            <img src="${item.author.image}" alt="프로필사진">
                        </a>
                        <a class="user-info" href="./profile_info.html" tabindex="1">
                            <p class="user-name">${item.author.username}</p>
                            <p class="user-id">@ ${item.author.accountname}</p>
                        </a>
                    </section>
                    <section class="post-edit">
                        <h4 class="a11y-hidden">게시물의 사진과 내용</h4>
                        <a href="./post_detail.html" tabindex="1">
                            <p class="post-text">${item.content}</p>
                        </a>
                        <div class="post-icon">
                            <button class="btn-like">
                                <img src="../assets/icon/icon-heart.svg" alt="좋아요 버튼"><span class="cnt">${item.heartCount}</span>
                            </button>
                            <a class="btn-comment" href="./post_detail.html" tabindex="1">
                                <img src="../assets/icon/icon-message-circle.svg" alt="댓글 버튼"><span class="cnt">${item.commentCount}</span>
                            </a>
                        </div>
                        <p class="post-date">${YEAR}년 ${MONTH}월 ${DAY}일</p>
                    </section>
                    <button class="btn-option"><img src="../assets/icon/icon-more-vertical.svg" alt="더보기 버튼"></button>
                </section>
            `
            if(item.image){
                console.log(item)
                const listLiImg = listLi.querySelector('.post-edit a')
                const albumUl = document.querySelector('.post-album')
                item.image.split(', ').forEach((i,idx) => {
                    const imgCover = document.createElement('div')
                    console.log("!",idx)
                    imgCover.classList.add('img-cover')
                    imgCover.innerHTML = `
                        <img class="post-img" src="${i}" alt="게시물 사진">
                    `
                    console.log(imgCover)
                    if(idx===0){
                        const albumLi = document.createElement('li')
                        albumLi.classList.add('post-album-item')
                        albumLi.innerHTML = `
                        <a href="./post_detail.html" tabindex="1"><img src="${i}" alt=""></a>
                        `
                        albumUl.appendChild(albumLi)
                    }
                    listLiImg.appendChild(imgCover)
                })
            }

            listUl.appendChild(listLi)
        })
    }
}


async function run(url,token,accountName) {
    const profileData = await Load(url, token,accountName);
    const productData = await ProductLoad(url, token,accountName )
    const postData = await postLoad(url,token,accountName)
    await introUpdate(profileData.profile)
    await productUpdate(productData.product,productData.data)
    await postUpdate(postData.post)
    document.querySelector('body').style.display = 'block'
};

document.querySelector('body').style.display = 'none'
run(url,token,'testtestabc');


// 게시글 토글
(function  () {
    const btnPosts = document.querySelectorAll('.tab-btn-wrap > button')
    btnPosts.forEach((item,idx,array)=>{
        posts = document.querySelectorAll('.post-sec > ul')
        item.addEventListener('click',()=>{
            if(!item.classList.contains('on')){
                item.classList.add('on')
                array[(idx+1)%2].classList.remove('on')
                posts[idx].classList.remove('hidden')
                posts[(idx+1)%2].classList.add('hidden')
            }
        })
    })
}());

// 팔로우버튼
(function (url,token){

    const followBtns = document.querySelectorAll('.btn-wrap-your > .btn-follow')

    followBtns.forEach((item,idx,arr)=>{
        item.addEventListener('click', async ()=>{
            arr[idx].classList.add('hidden')
            arr[(idx+1)%2].classList.remove('hidden');

            const METHOD = item.classList.contains('cancle') ? 'DELETE' : 'POST',
                ACTION = item.classList.contains('cancle') ? 'unfollow' : 'follow'
            
            const accountName = document.querySelector('.profile-id').childNodes[1].textContent
            
            let res = await fetch(url+`/profile/${accountName}/${ACTION}`, {
                method: METHOD,
                headers : {
                    "Authorization" : `Bearer ${token}`,
                    "Content-type" : "application/json"
                }
            });
            
            const resJson = await res.json()
            
            document.querySelector('.follower').textContent = resJson.profile.followerCount;
        })
    })
}(url,token));
