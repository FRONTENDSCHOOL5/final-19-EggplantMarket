const ulNode = document.querySelector('.search-user-list');
// api 연동 
async function search(userInp) {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/searchuser/?keyword=";
    //reqPath 뒤에 붙는 부분을 입력값으로 대체하는 처리 필요
    const res = await fetch(url + reqPath + userInp, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json"
        },
    })
    const json = await res.json()


    for (let i = 0; i < json.length; i++) {
        // const accountName = json[i].accountname;
        const userName = json[i].username;
        // const sameAccountName = accountName.substr(accountName.indexOf(userInp),userInp.length);
        const sameUserName = userName.substr(userName.indexOf(userInp), userInp.length);

        if (i == 10) {
            break;
        }
        if (userName.indexOf(userInp) != -1) {
            const liNode = document.createElement('li');
            liNode.innerHTML = `<section class="user-follow">
        <h3 class="a11y-hidden">유저정보</h3>
        <a class="profile-img img-cover" href="./profile_info.html?accountName=${json[i].accountname}">
            <img src="${json[i].image}" alt="프로필사진">
        </a>
        <a class="user-info" href="./profile_info.html?accountName=${json[i].accountname}">
            <p class="user-name">${userName.split(userInp)[0]}<strong>${sameUserName}</strong>${userName.split(userInp)[1]}</p>
            <p class="user-id">${json[i].accountname}</p>
        </a>
    </section>`
            ulNode.appendChild(liNode);
        }
        else {
            const liNode = document.createElement('li');
            liNode.innerHTML = `<section class="user-follow">
        <h3 class="a11y-hidden">유저정보</h3>
        <a class="profile-img img-cover" href="./profile_info.html?accountName=${json[i].accountname}">
            <img src="${json[i].image}" alt="프로필사진">
        </a>
        <a class="user-info" href="./profile_info.html?accountName=${json[i].accountname}">
            <p class="user-name">${json[i].username}</p>
            <p class="user-id">${json[i].accountname}</p>
        </a>
    </section>`
            ulNode.appendChild(liNode);
        }
    }
}
//키보드 값을 다시 입력 받을 때 마다 리스트 삭제
function delInput() {
    ulNode.innerHTML = '';
}

//입력된 값 하나씩 받아오기(O)
function filter() {
    console.log(window.event.key)
    const inp = document.getElementById("inp-search").value;
    if (window.event.key === 'Enter') {
        delInput();
        search(inp);
    }
    console.log(inp);
}
