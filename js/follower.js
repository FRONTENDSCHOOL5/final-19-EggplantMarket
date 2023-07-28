import { fetchClosure, fetchApi } from "./fetch/fetchRefact.js";
import { checkImageUrl } from "./common.js";

const accountname = new URLSearchParams(location.search).get('accountName'),
    myAccountname = localStorage.getItem('user-accountname');

const $followers = document.querySelector('.follow-list');

// 1. 내가 내 팔로워 목록을 보는지, 내가 다른 사용자 팔로워 목록을 보는지
const viewMyFollowerList = accountname === myAccountname ? true : false;

(async function () {
    const getFollowerList = fetchClosure(`/profile/${accountname}/follower`,12); // 클로저 함수 반환
    const data = await getFollowerList();
    displayFollowerList(data);

    // 무한 스크롤 
    window.addEventListener("scroll", async () => {
        if (getScrollTop() >= getDocumentHeight() - window.innerHeight) {
            displayFollowerList(await getFollowerList())
        };
    })
})();

// 팔로워 목록 뿌리기 
// : 내 팔로워 목록에서 팔로워를 삭제하는 버튼은 있지만 기능은 없음 (disabled 처리)
async function displayFollowerList(data) {
    const frag = document.createDocumentFragment();

    data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'follow-item');

        const userImgLink = document.createElement('a'); //
        userImgLink.classList.add('user-img', 'img-cover');
        userImgLink.href = `./profile_info.html?accountName=${user.accountname}`;

        const hiddenTextSpan = document.createElement('span');
        hiddenTextSpan.classList.add('a11y-hidden');
        hiddenTextSpan.textContent = `${user.username}의 프로필 보기`;

        const userImg = document.createElement('img');
        userImg.src = checkImageUrl(user.image, 'profile');
        userImg.alt = '';

        userImgLink.append(hiddenTextSpan, userImg);

        const userInfoDiv = document.createElement('div'); //
        userInfoDiv.classList.add('user-info');

        const userNameStrong = document.createElement('strong');
        userNameStrong.classList.add('user-name');

        const userNameLink = document.createElement('a');
        userNameLink.href = `./profile_info.html?accountName=${user.accountname}`;
        userNameLink.textContent = user.username;

        const userNameHiddenText = document.createElement('span');
        userNameHiddenText.classList.add('a11y-hidden');
        userNameHiddenText.textContent = '의 프로필 보기';

        userNameLink.appendChild(userNameHiddenText);
        userNameStrong.appendChild(userNameLink);

        const userIntroParagraph = document.createElement('p');
        userIntroParagraph.classList.add('user-intro', 'ellipsis');
        userIntroParagraph.textContent = user.intro;

        userInfoDiv.append(userNameStrong, userIntroParagraph);

        li.append(userImgLink, userInfoDiv);

        const btn = user.accountname !== myAccountname ? (user.isfollow ? `<button class="btn-follow opposite">팔로잉<span class="a11y-hidden">취소</span></button>` : `<button class="btn-follow">팔로우<span class="a11y-hidden">하기</span></button>`) : (``)
        li.insertAdjacentHTML('beforeend', btn);

        if (viewMyFollowerList) {
            userInfoDiv.style.width = 'calc(100% - 150px)';

            li.insertAdjacentHTML('beforeend', `<button class="btn-follow-cancle" style='width: 20px;' disabled>삭제<span class="a11y-hidden">하기</span></button>`);
        }

        frag.append(li);
    })

    $followers.append(frag);
}

// (팔로우(하기) 버튼, 팔로잉(취소) 버튼) 이벤트 위임
$followers.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-follow')) {
        // 클릭한 요소의 사용자계정 
        const clickedAccount = e.target.closest('li').querySelector('a').href.split('?accountName=')[1];

        if (e.target.classList.contains('opposite')) { // 현재 '팔로잉 취소하기 버튼'일때 가지고 있는 클래스
            // 언팔로우 기능
            await deleteFollow(clickedAccount);

            e.target.classList.remove('opposite');
            e.target.innerHTML = `팔로우<span class="a11y-hidden">하기</span>`;
        } else {
            // 팔로우 기능
            await postFollow(clickedAccount);

            e.target.classList.add('opposite');
            e.target.innerHTML = `팔로잉<span class="a11y-hidden">취소</span>`;
        }
    }
}
)

// POST 팔로우
async function postFollow(accountName) {
    fetchApi(`/profile/${accountName}/follow`, "POST", null, false)
}


// DELETE 팔로우
async function deleteFollow(accountName) {
    fetchApi(`/profile/${accountName}/unfollow`, "DELETE", null, false)
}