const pageUrl = new URL(window.location.href);

//post 컴포넌트 불러옵니다.
const profilePostList = document.querySelector(".post-list");
fetch('./component/post.html')
    .then(res => res.text())
    .then(data => profilePostList.innerHTML = data);

const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem("user-token"),
    myAccountName = localStorage.getItem("user-accountname"),
    profileAccountName = pageUrl.searchParams.get('accountName');

async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        return response.json();
    } catch (err) {
        location.href = './404.html'
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

function fetchPostData() {
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
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        };
    return fetchData(fullUrl, options);
}

async function deletefollow() {
    const fullUrl = `${url}/profile/${profileAccountName}/unfollow`,
        options = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        };
    return fetchData(fullUrl, options);
}

function displayProfileInfo(profile_data) {
    const userName = document.querySelector('.profile-name'),
        accountName = document.querySelector('.profile-id'),
        intro = document.querySelector('.profile-intro'),
        followerElement = document.querySelector('.follower'),
        followingElement = document.querySelector('.following'),
        profileImg = document.querySelector('.img-crop img'),
        followBtn = document.querySelector('.btn-follow'),
        unFollowBtn = document.querySelector('.btn-follow.cancle');

    userName.insertAdjacentText('beforeend', profile_data.username)
    accountName.insertAdjacentText('beforeend', profile_data.accountname)
    if (profile_data.intro !== "") {
        intro.childNodes[1].textContent = profile_data.intro;
    }
    followerElement.textContent = profile_data.followerCount;
    followerElement.closest('a').href = `./profile_follower.html?accountName=${profile_data.accountname}`
    followingElement.textContent = profile_data.followingCount;
    followingElement.closest('a').href = `./profile_following.html?accountName=${profile_data.accountname}`
    profileImg.src = `${checkImageUrl(profile_data.image, 'profile')}`

    profile_data.isfollow ? followBtn.classList.add('hidden') : unFollowBtn.classList.add('hidden')

    document.querySelector('.profile-container').style.display = 'block'
}

function createProductItem(item) {
    const productItem = document.createElement('li')
    productItem.classList.add('product-item')

    const button = document.createElement('button')
    button.classList.add('product')
    button.setAttribute('data-productId', `${item.id}`)

    const productName = document.createElement('strong')
    productName.className = 'product-name'
    productName.insertAdjacentText('beforeend', `${item.itemName}`)

    const productImg = document.createElement('img')
    productImg.className = 'product-img'
    productImg.setAttribute('src', `${checkImageUrl(item.itemImage, 'post')}`);
    productImg.setAttribute('alt', "");

    const productPrice = document.createElement('strong')
    productPrice.className = 'product-price'
    productPrice.insertAdjacentHTML('beforeend', `<span class="price">${Number(item.price).toLocaleString()}</span>원`)

    button.append(productName, productImg, productPrice)
    // appendChild => 한개씩 추가할 수 있음, IE지원
    // append => 여러개 추가 가능, IE지원 x
    productItem.appendChild(button)

    return productItem
}

function displayProductList(product_data, count) {
    if (count == 0) {
        document.querySelector('.product-container').style.display = 'none'
        document.querySelector('.skip-nav a:nth-child(3)').style.display = 'none'

        return;
    }
    const productList = document.querySelector('.product-list')
    const fragment = document.createDocumentFragment()

    product_data.forEach(item => {
        const productItem = createProductItem(item)
        fragment.appendChild(productItem)
    })
    productList.appendChild(fragment)
    document.querySelector('.product-container').style.display = 'block'
}

// 게시글 보는 섹션
function displayPosts(post_data) {
    // 첫 요청시 데이터가 없으면 섹션 숨기기
    if (!document.querySelector('.post-list').childNodes.length && !post_data.length) {
        document.querySelector('.post-container').style.display = 'none'
        document.querySelector('.skip-nav a:nth-child(4)').style.display = 'none'
        return
    }

    const albumUl = document.querySelector('.post-album');
    const ulNode = document.querySelector('.post-list');
    const fragment = document.createDocumentFragment();
    const albumfragment = document.createDocumentFragment();

    post_data.forEach((item) => {
        const listLi = document.createElement('li');
        const template = document.getElementById('post-template');
        const content = template.content.cloneNode(true);

        content.querySelector('.home-post').setAttribute('data-postid', `${item.id}`);

        //해당 페이지에서는 프로필페이지로 이동이 불필요함으로 링크태크 삭제 및 변경
        content.querySelector('.img-cover').remove();
        content.querySelector('.user-info').remove();
        const userInfo = content.querySelector('.user-follow');
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
        const postLink = content.querySelector(".post-edit a");
        postLink.href = `./post_detail.html?postId=${item.id}`;
        const postIcon = document.querySelector('.post-icon');
        const likeBtn = content.querySelector(".btn-like");
        likeBtn.className = `btn-like ${item.hearted ? 'like' : ''}`;
        const commentIconSvg = content.querySelector('.btn-like svg');
        commentIconSvg.setAttribute('fill', 'transparent');
        const heart = content.querySelector(".btn-like .cnt");
        heart.textContent = item.heartCount;
        const commentLink = content.querySelector(".btn-comment");
        commentLink.href = `./post_detail.html?postId=${item.id}`;
        const comment = content.querySelector(".btn-comment .cnt");
        comment.textContent = item.commentCount;
        const date = content.querySelector(".post-date");
        date.textContent = dateProcess(item.createdAt);

        userInfoDiv.append(userName, userId);
        userInfo.append(userImg, userInfoDiv);

        const postEdit = content.querySelector('.post-edit');

        ulNode.appendChild(listLi);
        listLi.appendChild(content);

        //게시물 종류에 따라서 추가해주는 기능
        if (item.content) {
            postEdit.querySelector('a').insertAdjacentHTML('beforeend', `<h3 class="post-text">${item.content}</h3>`)
        } else {
            postEdit.querySelector('a').insertAdjacentHTML('beforeend', `<h3 class="a11y-hidden">이미지만 있는 게시물</h3>`)
        }

        if (item.image) {
            const postfragment = document.createDocumentFragment()
            item.image.split(',').forEach((i, idx) => {
                // 리스트형 
                const imgCover = document.createElement('div');
                imgCover.classList.add('img-cover');

                const postImg = document.createElement('img');
                postImg.classList.add('post-img');
                postImg.src = checkImageUrl(i, 'post');
                postImg.alt = '게시물 사진';

                imgCover.appendChild(postImg);
                postfragment.appendChild(imgCover);

                // 앨범형 - 첫번째 사진을 섬네일로
                if (idx === 0) {
                    const albumLi = document.createElement('li');
                    albumLi.className = 'post-album-item';
                    albumLi.innerHTML = `
                    <a href="./post_detail.html?postId=${item.id}">
                        <img src="${checkImageUrl(item.image.split(',')[0], 'post')}" alt="">
                    </a>
                    `;
                    albumfragment.appendChild(albumLi);
                }
            });
            postEdit.querySelector('a').appendChild(postfragment);
        }
    });
    document.querySelector('.post-container').style.display = 'block';

    ulNode.addEventListener('click', handleLike);
    albumUl.appendChild(albumfragment);
}

async function run() {
    const isMyProfile = (myAccountName !== profileAccountName)
    document.querySelector('.btn-wrap-your').style.display = isMyProfile ? 'flex' : 'none'
    document.querySelector('.btn-wrap-my').style.display = isMyProfile ? 'none' : 'block'
    document.querySelector('li.tab-item-more a').classList.toggle('here', !isMyProfile)
    document.querySelector('li.tab-item-home a').classList.toggle('here', isMyProfile)
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
    window.addEventListener('resize', touchScroll)
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
(function () {
    const btnPosts = document.querySelectorAll('.tab-btn-wrap > button')
    const posts = document.querySelectorAll('.post-sec > ul')
    btnPosts.forEach((item, idx, viewTypes) => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('on')) {
                item.classList.add('on')
                viewTypes[(idx + 1) % 2].classList.remove('on')
                posts[idx].classList.remove('hidden')
                posts[(idx + 1) % 2].classList.add('hidden')
            }
        })
    })
}());

// 팔로우버튼
// 따로따로 다시 구현할까.. ///
(function () {
    // 팔로우 버튼 선택
    const followBtns = document.querySelectorAll('.btn-wrap-your > .btn-follow')

    followBtns.forEach((item, idx, buttonTypes) => {
        item.addEventListener('click', async () => {
            const isCancel = item.classList.contains('cancle');
            const resJson = isCancel ? await fetchUnfollow() : await fetchFollow();

            document.querySelector('.follower').textContent = resJson.profile.followerCount;
            buttonTypes[idx].classList.add('hidden')
            buttonTypes[(idx + 1) % 2].classList.remove('hidden');
        })
    })
}());

// 무한 스크롤 
function touchScroll() {
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