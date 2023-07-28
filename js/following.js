import { fetchClosure, fetchApi } from "./fetch/fetchRefact.js";
import { checkImageUrl } from "./common.js";

const accountname = new URLSearchParams(location.search).get('accountName'),
    myAccountname = localStorage.getItem('user-accountname');

const $followings = document.querySelector('.follow-list');

(async function () {
    const getFollowingList = fetchClosure(`/profile/${accountname}/following`,12); // 클로저 함수 반환
    makeList(await getFollowingList());

    // 무한 스크롤 
    window.addEventListener("scroll", async () => {
        if (getScrollTop() >= getDocumentHeight() - window.innerHeight) {
            makeList(await getFollowingList());
        };
    })
})();


// 팔로잉 목록 뿌리기
async function makeList(data) {
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

        const followButton = document.createElement('button'); //
        followButton.classList.add('btn-follow');

        if (user.accountname !== myAccountname) {
            if (user.isfollow) {
                followButton.classList.add('opposite');
                followButton.innerHTML = `팔로잉<span class="a11y-hidden">취소</span>`
            } else {
                followButton.innerHTML = `팔로우<span class="a11y-hidden">하기</span>`
            }

            li.append(userImgLink, userInfoDiv, followButton);
        } else {
            li.append(userImgLink, userInfoDiv);
        }


        frag.append(li);
    })

    $followings.append(frag);
}

// 버튼 이벤트
$followings.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-follow')) {
        // 클릭한 요소의 사용자계정 
        const clickedAccount = e.target.closest('li').querySelector('a').href.split('?accountName=')[1];

        if (e.target.classList.contains('opposite')) {
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

// --- API 함수들 ---

// POST 팔로우
async function postFollow(accountName) {
    fetchApi(`/profile/${accountName}/follow`, "POST", null, false)
}


// DELETE 팔로우
async function deleteFollow(accountName) {
    fetchApi(`/profile/${accountName}/unfollow`, "DELETE", null, false)
}