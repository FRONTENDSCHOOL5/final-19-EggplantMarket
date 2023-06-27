//피드백 반영
const ulNode = document.querySelector('.search-user-list');

// api 연동 
async function getData(userInp) {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/searchuser/?keyword=";
    const res = await fetch(url + reqPath + userInp, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json"
        },
    })
    const json = await res.json();
    return json;
}

async function search(userInp) {
    const userData = await getData(userInp);
    const frag = document.createDocumentFragment();

    for (let i = 0; i < userData.length; i++) {
        // const accountName = json[i].accountname;
        const userName = userData[i].username;
        // const sameAccountName = accountName.substr(accountName.indexOf(userInp),userInp.length);
        const sameUserName = userName.substr(userName.indexOf(userInp), userInp.length);

        if (i == 10) {
            break;
        }

        const liNode = document.createElement('li');
        liNode.innerHTML = `<article class="user-follow">
        <a class="profile-img img-cover" href="./profile_info.html?accountName=${userData[i].accountname}">
             <span class="a11y-hidden">${userData[i].username}의 프로필 보기</span>
            <img src="${checkImageUrl(userData[i].image, 'profile')}" alt="">
        </a>
        <a class="user-info" href="./profile_info.html?accountName=${userData[i].accountname}">
            ${userName.indexOf(userInp) != -1 ? `<h3 class="user-name">${userName.split(userInp)[0]}<strong>${sameUserName}</strong>${userName.split(userInp)[1]}</h3>` : `<p class="user-name">${userData[i].username}</p>`}
            <span class="a11y-hidden">${userData[i].username}의 프로필 보기</span>
            <p class="user-id">${userData[i].accountname}</p>
        </a>
        </article>`
        frag.appendChild(liNode);
    }

    ulNode.append(frag);
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
