const pageUrl = new URL(window.location.href);
const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem("user-token"),
    myAccountName = localStorage.getItem("user-accountname"),
    profileAccountName = pageUrl.searchParams.get('accountName');

async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        return response.json();
    } catch (err) {
        location.href='./404.html'
    }
}

async function getProfileData() { 
    const fullUrl = `${url}/profile/${profileAccountName}`;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

async function getProductData() { 
    const fullUrl = `${url}/product/${profileAccountName}`;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

function fetchPostData(){
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = `/post/${profileAccountName}/userpost?limit=6&skip=`
    let reqCnt = 0;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json"
        }
    }
    const getPostData = async () => await fetchData(url + reqPath + reqCnt++ * 6, options)

    return getPostData
}

async function postFollow() {
    const fullUrl = `${url}/profile/${profileAccountName}/follow`,
    options = {
        method: "POST",
        headers : {
            "Authorization" : `Bearer ${token}`,
            "Content-type" : "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

async function deletefollow() {
    const fullUrl = `${url}/profile/${profileAccountName}/unfollow`,
    options = {
        method: "DELETE",
        headers : {
            "Authorization" : `Bearer ${token}`,
            "Content-type" : "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

function displayProfileInfo(profile_data){
    const userName = document.querySelector('.profile-name'),
    accountName = document.querySelector('.profile-id'),
    intro = document.querySelector('.profile-intro'),
    followerElement = document.querySelector('.follower'),
    followingElement = document.querySelector('.following'),
    profileImg = document.querySelector('.img-crop img'),
    followBtn = document.querySelector('.btn-follow'),
    unFollowBtn = document.querySelector('.btn-follow.cancle');


    userName.insertAdjacentText('beforeend',profile_data.username)
    accountName.insertAdjacentText('beforeend',profile_data.accountname)
    if(profile_data.intro !== ""){
        intro.childNodes[1].textContent = profile_data.intro;
    }
    followerElement.textContent = profile_data.followerCount;
    followerElement.closest('a').href = `./profile_follower.html?accountName=${profile_data.accountname}`
    followingElement.textContent = profile_data.followingCount;
    followingElement.closest('a').href = `./profile_following.html?accountName=${profile_data.accountname}`
    profileImg.src=`${checkImageUrl(profile_data.image,'profile')}`

    profile_data.isfollow ? followBtn.classList.add('hidden') : unFollowBtn.classList.add('hidden')
    
    document.querySelector('.profile-container').style.display = 'block'
}

function createProductItem(item){
    const productItem = document.createElement('li')
    productItem.classList.add('product-item')

    const button = document.createElement('button')
    button.classList.add('product')
    button.setAttribute('data-productId', `${item.id}`)

    const productName = document.createElement('strong')
    productName.className='product-name'
    productName.insertAdjacentText('beforeend',`${item.itemName}`)
    
    const productImg = document.createElement('img')
    productImg.className='product-img'
    productImg.setAttribute('src', `${checkImageUrl(item.itemImage, 'post')}`);
    productImg.setAttribute('alt', "");

    const productPrice = document.createElement('strong')
    productPrice.className='product-price'
    productPrice.insertAdjacentHTML('beforeend',`<span class="price">${Number(item.price).toLocaleString()}</span>원`)
    
    button.append(productName,productImg,productPrice)
    // appendChild => 한개씩 추가할 수 있음, IE지원
    // append => 여러개 추가 가능, IE지원 x
    productItem.appendChild(button)

    return productItem
}

function displayProductList(product_data,count){
    if(count==0){
        document.querySelector('.product-container').style.display='none'
        document.querySelector('.skip-nav a:nth-child(3)').style.display='none'
        
        return;
    } 
    const productList = document.querySelector('.product-list')
    const fragment = document.createDocumentFragment()

    product_data.forEach(item => {
        const productItem = createProductItem(item)
        fragment.appendChild(productItem)
    })
    productList.appendChild(fragment)
    document.querySelector('.product-container').style.display='block'
}

// 게시글 보는 섹션
function displayPosts(post_data) {
    // 첫 요청시 데이터가 없으면 섹션 숨기기
    if (!document.querySelector('.post-list').childNodes.length && !post_data.length) {
        document.querySelector('.post-container').style.display = 'none'
        document.querySelector('.skip-nav a:nth-child(4)').style.display='none'
        return
    }
    const listUl = document.querySelector('.post-sec .post-list')
    const albumUl = document.querySelector('.post-album')
    const fragment = document.createDocumentFragment()
    const albumfragment = document.createDocumentFragment()
    post_data.forEach((item)=>{
        const listLi = document.createElement('li')
        
        const post = document.createElement('section')
        post.className = 'home-post'
        post.setAttribute('data-postid',`${item.id}`)

        const userInfo = document.createElement('div')
        userInfo.className='user-follow'

        const userImg = document.createElement('div')
        userImg.classList.add('profile-img', 'img-cover')

        const userImgImg = document.createElement('img');
        userImgImg.src = checkImageUrl(item.author.image, 'profile');
        userImg.appendChild(userImgImg);

        const userInfoDiv = document.createElement('div');
        userInfoDiv.classList.add('user-info');

        const userName = document.createElement('p');
        userName.classList.add('user-name');
        userName.textContent = item.author.username;

        const userId = document.createElement('p');
        userId.classList.add('user-id');
        userId.textContent = `${item.author.accountname}`;

        userInfoDiv.append(userName, userId)
        userInfo.append(userImg,userInfoDiv)
        post.appendChild(userInfo)

        const postEdit = document.createElement('div');
        postEdit.className = 'post-edit';
        postEdit.innerHTML = `
            <a href="./post_detail.html?postId=${item.id}">
                <span class="a11y-hidden">게시글 상세 보기</span>
            </a>
        `;

        if (item.content){
            postEdit.querySelector('a').insertAdjacentHTML('beforeend',`<h3 class="post-text">${item.content}</h3>`)
        }else {
            postEdit.querySelector('a').insertAdjacentHTML('beforeend',`<h3 class="a11y-hidden">이미지만 있는 게시물</h3>`)
        }
        
        if (item.image) {
            const postfragment = document.createDocumentFragment()
            item.image.split(',').forEach((i, idx) => {
                // 리스트형 
                const imgCover = document.createElement('div');
                imgCover.classList.add('img-cover');
            
                const postImg = document.createElement('img');
                postImg.classList.add('post-img');
                postImg.src = checkImageUrl(i,'post');
                postImg.alt = '게시물 사진';
            
                imgCover.appendChild(postImg);
                postfragment.appendChild(imgCover);
            
                // 앨범형 - 첫번째 사진을 섬네일로
                if (idx === 0) {
                    const albumLi = document.createElement('li');
                    albumLi.className = 'post-album-item';
                    albumLi.innerHTML = `
                    <a href="./post_detail.html?postId=${item.id}">
                        <img src="${checkImageUrl(item.image.split(',')[0],'post')}" alt="">
                    </a>
                    `;
                    albumfragment.appendChild(albumLi);
                }
            });
        
            postEdit.querySelector('a').appendChild(postfragment);
        }

        const postIcon = document.createElement('div');
        postIcon.className = 'post-icon';
        postIcon.innerHTML = `
            <button class="btn-like ${item.hearted ? 'like' : ''}">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="transparent" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.9202 4.01346C16.5204 3.60579 16.0456 3.28239 15.5231 3.06175C15.0006 2.8411 14.4406 2.72754 13.875 2.72754C13.3094 2.72754 12.7494 2.8411 12.2268 3.06175C11.7043 3.28239 11.2296 3.60579 10.8298 4.01346L9.99997 4.85914L9.17017 4.01346C8.36252 3.19037 7.26713 2.72797 6.12495 2.72797C4.98277 2.72797 3.88737 3.19037 3.07973 4.01346C2.27209 4.83655 1.81836 5.9529 1.81836 7.11693C1.81836 8.28095 2.27209 9.3973 3.07973 10.2204L3.90953 11.0661L9.99997 17.273L16.0904 11.0661L16.9202 10.2204C17.3202 9.81291 17.6376 9.32909 17.8541 8.79659C18.0706 8.26409 18.182 7.69333 18.182 7.11693C18.182 6.54052 18.0706 5.96977 17.8541 5.43726C17.6376 4.90476 17.3202 4.42095 16.9202 4.01346Z" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="cnt">${item.heartCount}</span>
            </button>
            <a class="btn-comment" href="./post_detail.html?postId=${item.id}">
                <span class="a11y-hidden">게시글 댓글 보러가기</span>
                <img src="../assets/icon/icon-message-circle.svg" alt="">
                <span class="cnt">${item.commentCount}</span>
            </a>
        `;
        
        postEdit.appendChild(postIcon);
        postEdit.insertAdjacentHTML('beforeend',`<p class="post-date">${dateProcess(item.createdAt)}</p>`)
        post.appendChild(postEdit)

        const btnOption = document.createElement('button');
        btnOption.className = 'btn-option';
        btnOption.innerHTML = `<span class="a11y-hidden">게시물 옵션</span>`;
        post.appendChild(btnOption);

        listLi.appendChild(post);
        fragment.appendChild(listLi);

    });
    document.querySelector('.post-container').style.display='block'

    listUl.appendChild(fragment);
    listUl.addEventListener('click',handleLike)
    albumUl.appendChild(albumfragment);
}

async function run() {
    const isMyProfile = (myAccountName !== profileAccountName)
    document.querySelector('.btn-wrap-your').style.display = isMyProfile ? 'flex' : 'none'
    document.querySelector('.btn-wrap-my').style.display = isMyProfile ? 'none' : 'block'
    document.querySelector('li.tab-item-more a').classList.toggle('here',!isMyProfile)    
    document.querySelector('li.tab-item-home a').classList.toggle('here',isMyProfile)
    const getPostData = fetchPostData();

    // 동시에 호출할 비동기 함수들을 배열로 준비
    const fetchPromises = [
        getProfileData(),
        getProductData(),
        getPostData()
    ];

    // 모든 비동기 작업이 완료될 때까지 기다림
    const [profileData, productData, postData] = await Promise.all(fetchPromises);

    displayProfileInfo(profileData.profile),
    displayProductList(productData.product, productData.data),
    displayPosts(postData.post)

    document.querySelector('body').style.display = 'block'
    handleModal()
    touchScroll()
    window.addEventListener('resize',touchScroll)
    window.addEventListener("scroll", async () => {
        if (getScrollTop() >= getDocumentHeight() - window.innerHeight) {
            displayPosts((await getPostData()).post)
            const postBtnOption = document.querySelectorAll('main .btn-option');
            handlePostOptionModal(postBtnOption)
        };
    })
};

run();

// 게시글 토글
(function  () {
    const btnPosts = document.querySelectorAll('.tab-btn-wrap > button')
    const posts = document.querySelectorAll('.post-sec > ul')
    btnPosts.forEach((item,idx,viewTypes)=>{
        item.addEventListener('click',()=>{
            if(!item.classList.contains('on')){
                item.classList.add('on')
                viewTypes[(idx+1)%2].classList.remove('on')
                posts[idx].classList.remove('hidden')
                posts[(idx+1)%2].classList.add('hidden')
            }
        })
    })
}());

// 팔로우버튼
// 따로따로 다시 구현할까.. ///
(function (){
    // 팔로우 버튼 선택
    const followBtns = document.querySelectorAll('.btn-wrap-your > .btn-follow')

    followBtns.forEach((item,idx,buttonTypes)=>{
        item.addEventListener('click', async ()=>{
            const isCancel = item.classList.contains('cancle');
            const resJson = isCancel ? await fetchUnfollow() : await fetchFollow();

            document.querySelector('.follower').textContent = resJson.profile.followerCount;
            buttonTypes[idx].classList.add('hidden')
            buttonTypes[(idx+1)%2].classList.remove('hidden');
        })
    })
}());

// 무한 스크롤 

function touchScroll(){
    const list = document.querySelector('.product-list')
    const listScrollWidth = list.scrollWidth;
    const listClientWidth = list.clientWidth;

    let startX = 0;
    let nowX = 0;
    let endX = 0;
    let listX = 0;

    const onScrollStart = (e) => {
        startX = getClientX(e);
        window.addEventListener('mousemove', onScrollMove);
        window.addEventListener('touchmove', onScrollMove);
        window.addEventListener('mouseup', onScrollEnd);
        window.addEventListener('touchend', onScrollEnd);
    };

    const onScrollMove = (e) => {
        nowX = getClientX(e);
        setTranslateX(listX + nowX - startX);
    };
    const onScrollEnd = (e) => {
        endX = getClientX(e);
        listX = getTranslateX();
        if (listX > 0) {
            setTranslateX(0);
            list.style.transition = `all 0.3s ease`;
            listX = 0;
        } else if (listX < listClientWidth - listScrollWidth) {
            setTranslateX(listClientWidth - listScrollWidth);
            list.style.transition = `all 0.3s ease`;
            listX = listClientWidth - listScrollWidth;
        }
    
        window.removeEventListener('mousedown', onScrollStart);
        window.removeEventListener('touchstart', onScrollStart);
        window.removeEventListener('mousemove', onScrollMove);
        window.removeEventListener('touchmove', onScrollMove);
        window.removeEventListener('mouseup', onScrollEnd);
        window.removeEventListener('touchend', onScrollEnd);
        window.removeEventListener('click', onClick);
    
        setTimeout(() => {
            bindEvents();
            list.style.transition = '';
        }, 300);
    };
    const onClick = (e) => {
        if (startX - endX !== 0) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const getClientX = (e) => {
        const isTouches = e.touches ? true : false;
        return isTouches ? e.touches[0].clientX : e.clientX;
    };
    
    const getTranslateX = () => {
        return parseInt(getComputedStyle(list).transform.split(/[^\-0-9]+/g)[5]);
    };
    
    const setTranslateX = (x) => {
        list.style.transform = `translateX(${x}px)`;
    };

    const bindEvents = () => {
        list.addEventListener('mousedown', onScrollStart);
        list.addEventListener('touchstart', onScrollStart);
        list.addEventListener('click', onClick, true);
    };
    bindEvents();
}