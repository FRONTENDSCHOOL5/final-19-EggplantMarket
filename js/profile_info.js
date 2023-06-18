


const url = "https://api.mandarin.weniv.co.kr",
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OGQ4MDU2YjJjYjIwNTY2MzM4MWQzNSIsImV4cCI6MTY5MjE3OTIwMywiaWF0IjoxNjg2OTk1MjAzfQ.GEfv4S1mZV1VQC2lVN1HebucHOSencMXhcn802YBblc"

/**
 * 분기1
 * 내 프로필인지 다른 사람 프로필인지 체크
 */


async function Load(url,token, accountName) { 
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
}}

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
}}

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
    }

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

async function run(url,token,accountName) {
    const profile_data = await Load(url, token,accountName);
    const product_data = await ProductLoad(url, token,accountName )
    await introUpdate(profile_data.profile)
    await productUpdate(product_data.product,product_data.data)
}

run(url,token,'testtestabc')

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
}(url,token))

