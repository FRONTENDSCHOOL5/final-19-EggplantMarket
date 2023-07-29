import { fetchApi } from "./fetch/fetchRefact.js";
import { checkImageUrl } from "./common.js";

//피드백 반영
const ulNode = document.querySelector('.search-user-list');

// api 연동 
async function getData(userInp) {
    return fetchApi({
        reqPath : `/user/searchuser/?keyword=${userInp}`,
        method : "GET"
    });
}

async function search(userInp) {
    const userData = await getData(userInp);
    const frag = document.createDocumentFragment();

    for (let i = 0; i < userData.length; i++) {

        const userName = userData[i].username;
        const sameUserName = userName.substr(userName.indexOf(userInp), userInp.length);

        if (i == 10) {
            break;
        }

        const liNode = document.createElement('li');
        const template = document.getElementById('search-template');

        const content = template.content.cloneNode(true);

        const profileImageLink = content.querySelector(".profile-img");
        profileImageLink.href=`./profile_info.html?accountName=${userData[i].accountname}`;
        const userInfoLink = content.querySelector(".user-info");
        userInfoLink.href=`./profile_info.html?accountName=${userData[i].accountname}`;

        //검색어 일치부분 강조 기능
        if(userName.indexOf(userInp) != -1) {
            const name = content.querySelector(".user-name");
            const parent = name.parentElement;
            parent.removeChild(name);
            parent.insertAdjacentHTML('afterbegin', `<h3 class="user-name">${userName.split(userInp)[0]}<strong>${sameUserName}</strong>${userName.split(userInp)[1]}</h3>`);
        }
        else {
            const name = content.querySelector(".user-name");
            const parent = name.parentElement;
            parent.removeChild(name);
            parent.insertAdjacentHTML('afterbegin', `<p class="user-name">${userData[i].username}</p>`);
        }


        const account = content.querySelector(".user-id");
        account.textContent = userData[i].accountname;
        const profileImage = content.getElementById("profile-image");
        profileImage.src = checkImageUrl(userData[i].image, 'profile');


        ulNode.appendChild(liNode);
        liNode.appendChild(content);
    }
    ulNode.append(frag);
}
//키보드 값을 다시 입력 받을 때 마다 리스트 삭제
function delInput() {
    ulNode.innerHTML = '';
}

//입력된 값 하나씩 받아오기(O)

document.querySelector("#inp-search").addEventListener("keypress",()=>{
    const inp = document.getElementById("inp-search").value;
    if (window.event.key === 'Enter') {
        delInput();
        search(inp);
    }
})