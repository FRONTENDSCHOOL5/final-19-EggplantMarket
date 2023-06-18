
/**
 * 분기1
 * 내 프로필인지 다른 사람 프로필인지 체크
 */


const url = "https://api.mandarin.weniv.co.kr",
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OGQ4MDU2YjJjYjIwNTY2MzM4MWQzNSIsImV4cCI6MTY5MjE3OTIwMywiaWF0IjoxNjg2OTk1MjAzfQ.GEfv4S1mZV1VQC2lVN1HebucHOSencMXhcn802YBblc"
async function Load(url,token, accountName) { 
    try{
    const res = await fetch(url+`/profile/${accountName}`, {
                    method: "GET",
                    headers : {
                        "Authorization" : `Bearer ${token}`
                    }
                });
    const resJson = await res.json();

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
    followingElement = document.querySelector('.following');


    userName.appendChild(document.createTextNode(profile_data.username))
    accountName.appendChild(document.createTextNode(profile_data.accountname))
    if(profile_data.intro !== ""){
        intro.childNodes[1].textContent = profile_data.intro
    }
    followerElement.textContent = profile_data.followerCount;
    followingElement.textContent = profile_data.followingCount;
}

function productUpdate(){

}

async function run(url,token,accountName) {
    const profile_data = await Load(url, token,accountName);
    const product_data = await ProductLoad(url, token,accountName )

    await introUpdate(profile_data.profile)
    
}

run(url,token,'weniv_won')