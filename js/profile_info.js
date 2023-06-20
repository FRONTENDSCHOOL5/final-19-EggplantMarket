const url = "https://api.mandarin.weniv.co.kr",
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OGQ4MDU2YjJjYjIwNTY2MzM4MWQzNSIsImV4cCI6MTY5MjE3OTIwMywiaWF0IjoxNjg2OTk1MjAzfQ.GEfv4S1mZV1VQC2lVN1HebucHOSencMXhcn802YBblc",
    myAccountName = 'oxxun21',
    profileAccountName = 'yoon';

    // testtestabc
    // yoon
    // weniv_won
    // oxxun21
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
        let fragment = document.createDocumentFragment()

        product_data.forEach(item => {
            
            const productItem = document.createElement('li')
            productItem.classList.add('product-item')

            const button = document.createElement('button')
            button.classList.add('product')
            button.setAttribute('tabindex','1')
            button.setAttribute('itemid', `${item.id}`)

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


function postUpdate(post_data){
    
    if (!post_data.length){
        document.querySelector('.post-container').style.display='none'
    } else{
        const listUl = document.querySelector('.post-sec .post-list')
        const albumUl = document.querySelector('.post-album')
        const fragment = document.createDocumentFragment()
        const albumfragment = document.createDocumentFragment()
        post_data.forEach((item)=>{
            const itemDate = new Date(item.createdAt)
            console.log(item)
            const YEAR = itemDate.getFullYear()
            const MONTH = (itemDate.getMonth()+1) >= 10 ? (itemDate.getMonth()+1) : '0'+(itemDate.getMonth()+1)
            const DAY = itemDate.getDate()

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
            userId.textContent = `@ ${item.author.accountname}`;

            userInfoDiv.appendChild(userName);
            userInfoDiv.appendChild(userId);

            userInfo.appendChild(userImg);
            userInfo.appendChild(userInfoDiv);
            post.appendChild(userInfo)

            const postEdit = document.createElement('section');
            postEdit.className = 'post-edit';

            const postTextLink = document.createElement('a');
            postTextLink.href = './post_detail.html';
            postTextLink.setAttribute('tabindex', '1');

            const postText = document.createElement('p');
            postText.classList.add('post-text');
            postText.textContent = item.content;

            postTextLink.appendChild(postText);
            
            if (item.image) {

                post.insertAdjacentHTML('afterbegin','<h3 class="a11y-hidden">사진과 글을 함께 올리는 게시물</h3>')
                postEdit.insertAdjacentHTML('afterbegin','<h4 class="a11y-hidden">게시물의 사진과 내용</h4>')
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
                        albumLi.classList.add('post-album-item');
                
                        const albumLink = document.createElement('a');
                        albumLink.href = './post_detail.html';
                        albumLink.setAttribute('tabindex', '1');
                
                        const albumImg = document.createElement('img');
                        albumImg.src = i;
                        albumImg.alt = '';
                
                        albumLink.appendChild(albumImg);
                        albumLi.appendChild(albumLink);
                
                        albumfragment.appendChild(albumLi);
                    }
                });
            
                postTextLink.appendChild(postfragment);
            }else{
                post.insertAdjacentHTML('afterbegin','<h3 class="a11y-hidden">글만 올리는 게시물</h3>')
                postEdit.insertAdjacentHTML('afterbegin','<h4 class="a11y-hidden">게시물의 내용</h4>')
            }

            postEdit.appendChild(postTextLink)

            const postIcon = document.createElement('div');
            postIcon.classList.add('post-icon');

            const btnLike = document.createElement('button');
            btnLike.classList.add('btn-like');

            const postIconDiv = document.createElement('div');
            postIconDiv.classList.add('post-icon');

            const likeButton = document.createElement('button');
            likeButton.classList.add('btn-like');
            
            const likeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            likeSvg.setAttribute('width', '20');
            likeSvg.setAttribute('height', '20');
            likeSvg.setAttribute('viewBox', '0 0 20 20');
            likeSvg.setAttribute('fill', 'none');

            const likePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            likePath.setAttribute('d', 'M16.9202 4.01346C16.5204 3.60579 16.0456 3.28239 15.5231 3.06175C15.0006 2.8411 14.4406 2.72754 13.875 2.72754C13.3094 2.72754 12.7494 2.8411 12.2268 3.06175C11.7043 3.28239 11.2296 3.60579 10.8298 4.01346L9.99997 4.85914L9.17017 4.01346C8.36252 3.19037 7.26713 2.72797 6.12495 2.72797C4.98277 2.72797 3.88737 3.19037 3.07973 4.01346C2.27209 4.83655 1.81836 5.9529 1.81836 7.11693C1.81836 8.28095 2.27209 9.3973 3.07973 10.2204L3.90953 11.0661L9.99997 17.273L16.0904 11.0661L16.9202 10.2204C17.3202 9.81291 17.6376 9.32909 17.8541 8.79659C18.0706 8.26409 18.182 7.69333 18.182 7.11693C18.182 6.54052 18.0706 5.96977 17.8541 5.43726C17.6376 4.90476 17.3202 4.42095 16.9202 4.01346Z');
            likePath.setAttribute('stroke', '#767676');
            likePath.setAttribute('stroke-width', '1.5');
            likePath.setAttribute('stroke-linecap', 'round');
            likePath.setAttribute('stroke-linejoin', 'round');

            likeSvg.appendChild(likePath)
            likeButton.appendChild(likeSvg);

            likeButton.addEventListener('click',handleLike)

            const likeCountSpan = document.createElement('span');
            likeCountSpan.classList.add('cnt');
            likeCountSpan.textContent = item.heartCount;
            likeButton.appendChild(likeCountSpan);

            const commentLink = document.createElement('a');
            commentLink.classList.add('btn-comment');
            commentLink.setAttribute('href', './post_detail.html');
            commentLink.setAttribute('tabindex', '1');

            const commentIconImg = document.createElement('img');
            commentIconImg.setAttribute('src', '../assets/icon/icon-message-circle.svg');
            commentIconImg.setAttribute('alt', '댓글 버튼');
            commentLink.appendChild(commentIconImg);

            const commentCountSpan = document.createElement('span');
            commentCountSpan.classList.add('cnt');
            commentCountSpan.textContent = item.commentCount;
            commentLink.appendChild(commentCountSpan);

            postIconDiv.appendChild(likeButton);
            postIconDiv.appendChild(commentLink);

            postEdit.appendChild(postIconDiv)

            const postDate = document.createElement('p');
            postDate.classList.add('post-date');
            postDate.textContent = `${YEAR}년 ${MONTH}월 ${DAY}일`;

            postEdit.appendChild(postDate);

            post.appendChild(postEdit)

            const btnOption = document.createElement('button');
            btnOption.classList.add('btn-option');

            const btnOptionImg = document.createElement('img');
            btnOptionImg.src = '../assets/icon/icon-more-vertical.svg';
            btnOptionImg.alt = '더보기 버튼';

            btnOption.appendChild(btnOptionImg);

            post.appendChild(btnOption)
            listLi.appendChild(post)
            fragment.appendChild(listLi)

            listUl.appendChild(fragment)
            albumUl.appendChild(albumfragment)
        })
    }
}


async function run(url,token,accountName) {
    if (myAccountName !== profileAccountName){
        document.querySelector('.btn-wrap-your').style.display='flex'
        document.querySelector('.btn-wrap-my').style.display='none'
        document.querySelector('li.tab-item-more a').classList.remove('here')
        document.querySelector('li.tab-item-home a').classList.add('here')
    }else{
        document.querySelector('.btn-wrap-your').style.display='none'
        document.querySelector('.btn-wrap-my').style.display='block'
        document.querySelector('li.tab-item-more a').classList.add('here')
        document.querySelector('li.tab-item-home a').classList.remove('here')
    }
    const profileData = await Load(url, token,accountName);
    const productData = await ProductLoad(url, token,accountName )
    const postData = await postLoad(url,token,accountName)
    await introUpdate(profileData.profile)
    await productUpdate(productData.product,productData.data)
    await postUpdate(postData.post)
    document.querySelector('body').style.display = 'block'
};

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

function handleLike(event){
    console.log(event.currentTarget)
    if(event.currentTarget.classList.contains('like')){

    }else{
        
    }
}

document.querySelector('body').style.display = 'none'
run(url,token,profileAccountName);