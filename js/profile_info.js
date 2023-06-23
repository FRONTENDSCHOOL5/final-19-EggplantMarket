document.querySelector('body').style.display = 'none'

const pageUrl = new URL(window.location.href);
const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem("user-token"),
    myAccountName = localStorage.getItem("user-accountname"),
    // profileAccountName = 'yoon';
    // profileAccountName = myAccountName;
    profileAccountName = pageUrl.searchParams.get('accountName');
// console.log(profileAccountName)
// http://127.0.0.1:5500/html/profile_info.html?accountName=jyp1

    // testtestabc
    // yoon
    // weniv_won
    // oxxun21
/**
 * 분기1
 * 내 프로필인지 다른 사람 프로필인지 체크
 */


async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function loadProfileData(url, token, accountName) { 
    const fullUrl = `${url}/profile/${accountName}`;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
    return fetchData(fullUrl, options);
}

async function loadProductData(url, token, accountName) { 
    const fullUrl = `${url}/product/${accountName}`;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

async function loadPostData(url, token, accountName) {
    const fullUrl = `${url}/post/${accountName}/userpost`;
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    return fetchData(fullUrl, options);
}

function updateInfo(profile_data){

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
        intro.childNodes[1].textContent = profile_data.intro
    }
    followerElement.textContent = profile_data.followerCount;
    followerElement.closest('a').href = `./profile_follower.html?accountName=${profile_data.accountname}`
    followingElement.textContent = profile_data.followingCount;
    followingElement.closest('a').href = `./profile_following.html?accountName=${profile_data.accountname}`
    profileImg.src=`${profile_data.image}`

    profile_data.isfollow ? followBtn.classList.add('hidden') : unFollowBtn.classList.add('hidden')
}

function updateProduct(product_data,count){
    if(count==0){
        document.querySelector('.product-container').style.display='none'
    } else{

        const productList = document.querySelector('.product-list')
        const fragment = document.createDocumentFragment()

        product_data.forEach(item => {
            
            const productItem = document.createElement('li')
            productItem.classList.add('product-item')

            const button = document.createElement('button')
            button.classList.add('product')
            button.setAttribute('tabindex','1')
            button.setAttribute('data-productId', `${item.id}`)

            const productName = document.createElement('strong')
            productName.className='product-name'
            productName.insertAdjacentHTML('afterbegin','<span class="a11y-hidden">상품 이름:</span>')
            productName.insertAdjacentText('beforeend',`${item.itemName}`)
            
            const productImg = document.createElement('img')
            productImg.className='product-img'
            productImg.setAttribute('src',`${item.itemImage}`)
            productImg.setAttribute('alt','상품 이미지')

            const productPrice = document.createElement('strong')
            productPrice.className='product-price'
            productPrice.insertAdjacentHTML('afterbegin','<span class="a11y-hidden">금액:</span>')
            productPrice.insertAdjacentHTML('beforeend',`<span class="price">${Number(item.price).toLocaleString()}</span>`)
            productPrice.insertAdjacentText('beforeend','원')
            
            button.appendChild(productName)
            button.appendChild(productImg)
            button.appendChild(productPrice)
            productItem.appendChild(button)
            fragment.appendChild(productItem)
        })
        productList.appendChild(fragment)
    }
}

function updatePost(post_data){
    
    if (!post_data.length){
        document.querySelector('.post-container').style.display='none'
    } else{
        const listUl = document.querySelector('.post-sec .post-list')
        const albumUl = document.querySelector('.post-album')
        const fragment = document.createDocumentFragment()
        const albumfragment = document.createDocumentFragment()
        post_data.forEach((item)=>{
            const listLi = document.createElement('li')
            listLi.setAttribute('data-postid',`${item.id}`)
            const post = document.createElement('section')
            post.className = 'home-post'

            const userInfo = document.createElement('section')
            userInfo.className='user-follow'

            const userImg = document.createElement('div')
            userImg.classList.add('profile-img', 'img-cover')
            userImg.setAttribute('tabindex','1')

            const userImgImg = document.createElement('img');
            userImgImg.src = item.author.image;
            userImgImg.alt = '프로필사진';

            userImg.appendChild(userImgImg);

            const userInfoDiv = document.createElement('div');
            userInfoDiv.classList.add('user-info');
            userInfoDiv.setAttribute('tabindex', '1');

            const userName = document.createElement('p');
            userName.classList.add('user-name');
            userName.textContent = item.author.username;

            const userId = document.createElement('p');
            userId.classList.add('user-id');
            userId.textContent = `${item.author.accountname}`;

            userInfoDiv.appendChild(userName);
            userInfoDiv.appendChild(userId);

            userInfo.appendChild(userImg);
            userInfo.appendChild(userInfoDiv);
            post.appendChild(userInfo)

            const postEdit = document.createElement('section');
            postEdit.className = 'post-edit';
            postEdit.innerHTML = `
                <h4 class="a11y-hidden">게시물의 내용</h4>
                <a href="./post_detail.html?postId=${item.id}" tabindex="1">
                </a>
            `;

            const H3 = item.image ? (item.content ? '사진과 글을 함께 있는 게시물' : '사진만 있는 게시물') : '글만 있는 게시물'
            post.insertAdjacentHTML('afterbegin',`<h3 class="a11y-hidden">${H3}</h3>`)
            if (item.content){
                postEdit.querySelector('a').insertAdjacentHTML('beforeend',`<p class="post-text">${item.content}</p>`)
            }
            
            if (item.image) {
                const postfragment = document.createDocumentFragment()
                item.image.split(', ').forEach((i, idx) => {
                    const imgCover = document.createElement('div');
                    imgCover.classList.add('img-cover');
                
                    const postImg = document.createElement('img');
                    postImg.classList.add('post-img');
                    postImg.src = i;
                    postImg.alt = '게시물 사진';
                
                    imgCover.appendChild(postImg);
                    postfragment.appendChild(imgCover);
                
                    if (idx === 0) {
                        const albumLi = document.createElement('li');
                        albumLi.className = 'post-album-item';
                        albumLi.innerHTML = `
                        <a href="./post_detail.html?postId=${item.id}" tabindex="1">
                            <img src="${item.image.split(', ')[0]}" alt="">
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
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9202 4.01346C16.5204 3.60579 16.0456 3.28239 15.5231 3.06175C15.0006 2.8411 14.4406 2.72754 13.875 2.72754C13.3094 2.72754 12.7494 2.8411 12.2268 3.06175C11.7043 3.28239 11.2296 3.60579 10.8298 4.01346L9.99997 4.85914L9.17017 4.01346C8.36252 3.19037 7.26713 2.72797 6.12495 2.72797C4.98277 2.72797 3.88737 3.19037 3.07973 4.01346C2.27209 4.83655 1.81836 5.9529 1.81836 7.11693C1.81836 8.28095 2.27209 9.3973 3.07973 10.2204L3.90953 11.0661L9.99997 17.273L16.0904 11.0661L16.9202 10.2204C17.3202 9.81291 17.6376 9.32909 17.8541 8.79659C18.0706 8.26409 18.182 7.69333 18.182 7.11693C18.182 6.54052 18.0706 5.96977 17.8541 5.43726C17.6376 4.90476 17.3202 4.42095 16.9202 4.01346Z" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="cnt">${item.heartCount}</span>
                </button>
                <a class="btn-comment" href="./post_detail.html?postId=${item.id}" tabindex="1">
                    <img src="../assets/icon/icon-message-circle.svg" alt="댓글 버튼">
                    <span class="cnt">${item.commentCount}</span>
                </a>
            `;

            postIcon.querySelector('.btn-like').addEventListener('click',handleLike)
            
            postEdit.appendChild(postIcon);
            postEdit.insertAdjacentHTML('beforeend',`<p class="post-date">${dateProcess(item.createdAt)}</p>`)

            post.appendChild(postEdit)

            const btnOption = document.createElement('button');
            btnOption.className = 'btn-option';
            btnOption.innerHTML = `
                <img src="../assets/icon/icon-more-vertical.svg" alt="더보기 버튼">
            `;

            post.appendChild(btnOption);
            listLi.appendChild(post);
            fragment.appendChild(listLi);

            listUl.appendChild(fragment);
            albumUl.appendChild(albumfragment);
        });
    }
}


async function run(url, token, accountName) {
    const isMyProfile = (myAccountName !== profileAccountName)
    
    document.querySelector('.btn-wrap-your').style.display = isMyProfile ? 'flex' : 'none'
    document.querySelector('.btn-wrap-my').style.display = isMyProfile ? 'none' : 'block'
    document.querySelector('li.tab-item-more a').classList.toggle('here',!isMyProfile)    
    document.querySelector('li.tab-item-home a').classList.toggle('here',isMyProfile)


    if(!isMyProfile){
        document.querySelector('.btn-link.profile-modification').addEventListener('click',()=>{
            location.href = './profile_modification.html'
        })
        document.querySelector('.btn-link.add-product').addEventListener('click',()=>{
            location.href = `./product.html`
        })
    }

    // 동시에 호출할 비동기 함수들을 배열로 준비
    const loadPromises = [
        loadProfileData(url, token, accountName),
        loadProductData(url, token, accountName),
        loadPostData(url, token, accountName)
    ];

    // 모든 비동기 작업이 완료될 때까지 기다림
    const [profileData, productData, postData] = await Promise.all(loadPromises);

    const updatePromises = [
        updateInfo(profileData.profile),
        updateProduct(productData.product,productData.data),
        updatePost(postData.post)
    ]
    await Promise.all(updatePromises);

    document.querySelector('body').style.display = 'block'
};

// 게시글 토글
(function  () {
    const btnPosts = document.querySelectorAll('.tab-btn-wrap > button')
    const posts = document.querySelectorAll('.post-sec > ul')
    btnPosts.forEach((item,idx,array)=>{
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
(function (url,token, accountName){

    const followBtns = document.querySelectorAll('.btn-wrap-your > .btn-follow')

    followBtns.forEach((item,idx,arr)=>{
        item.addEventListener('click', async ()=>{
            const isCancle = item.classList.contains('cancle')
            const METHOD = isCancle ? 'DELETE' : 'POST',
                ACTION = isCancle ? 'unfollow' : 'follow'
            
            try {
                let res = await fetch(url+`/profile/${accountName}/${ACTION}`, {
                    method: METHOD,
                    headers : {
                        "Authorization" : `Bearer ${token}`,
                        "Content-type" : "application/json"
                    }
                });
            
                const resJson = await res.json()
                document.querySelector('.follower').textContent = resJson.profile.followerCount;
                arr[idx].classList.add('hidden')
                arr[(idx+1)%2].classList.remove('hidden');
            } catch(err) {
                console.log(err)
            }
        })
    })
}(url,token,profileAccountName));

run(url, token, profileAccountName);