/*
- 팔로잉(취소) 버튼 기능 추가 예정
*/

const accountname = new URLSearchParams(location.search).get('accountName'),
    myAccountname = localStorage.getItem('user-accountname'),
    token = localStorage.getItem('user-token');

const $followers = document.querySelector('.follow-list');

// 1. 내가 내 팔로워 목록을 보는지, 내가 다른 사용자 팔로워 목록을 보는지
const viewMyFollowerList = accountname === myAccountname ? true : false;

(async function () {
    const getFollowerList = fetchFollowerList(); // 클로저 함수 반환
    const data = await getFollowerList();
    if (viewMyFollowerList) displayMyFollowerList(data);
    else displayUserFollowerList(data);

    // 무한 스크롤 
    window.addEventListener("scroll", async () => {
        if (getScrollTop() >= getDocumentHeight() - window.innerHeight) {
            if (viewMyFollowerList) {
                displayMyFollowerList(await getFollowerList())
            } else {
                displayUserFollowerList(await getFollowerList())
            }
        };
    })
})();

// 내 팔로워 목록 뿌리기 
// : (팔로우(하기) 버튼만 가능, 팔로워를 삭제하는 버튼은 있지만 기능은 없음 disabled 처리)
async function displayMyFollowerList(data) {
    const frag = document.createDocumentFragment();

    data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'follow-item');
        li.innerHTML = `<a class="user-img img-cover" href="./profile_info.html?accountName=${user.accountname}">
        <span class="a11y-hidden">${user.username}의 프로필 보기</span>
        <img src=${checkImageUrl(user.image, 'profile')} alt="">
        </a>
        <div class="user-info">
            <strong class="user-name">
                <a href="./profile_info.html?accountName=${user.accountname}">${user.username}<span class="a11y-hidden">의 프로필 보기</span></a>
            </strong>
            <p class="user-intro ellipsis">${user.intro}</p>
        </div>
        ${user.isfollow ? '<button class="btn-follow opposite">팔로잉<span class="a11y-hidden">취소</span></button>' : `<button class="btn-follow">팔로우<span class="a11y-hidden">하기</span></button>`}`
        // <button class="btn-follow-cancle" disabled>삭제<span class="a11y-hidden">하기</span></button>

        frag.append(li);
    })

    $followers.append(frag);
}

// 다른 사용자 팔로워 목록 뿌리기 
// : (팔로우(하기) 버튼, 팔로잉(취소) 버튼)
async function displayUserFollowerList(data) {
    const frag = document.createDocumentFragment();

    data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'follow-item');
        li.innerHTML = `<a class="user-img img-cover" href="./profile_info.html?accountName=${user.accountname}">
        <span class="a11y-hidden">${user.username}의 프로필 보기</span>
        <img src=${checkImageUrl(user.image, 'profile')} alt="">
    </a>
    <div class="user-info">
        <strong class="user-name">
            <a href="./profile_info.html?accountName=${user.accountname}">${user.username}<span class="a11y-hidden">의 프로필 보기</span></a>
        </strong>
        <p class="user-intro ellipsis">${user.intro}</p>
    </div>
    ${user.accountname !== myAccountname ? (user.isfollow ? `<button class="btn-follow opposite">팔로잉<span class="a11y-hidden">취소</span></button>` : `<button class="btn-follow">팔로우<span class="a11y-hidden">하기</span></button>`) : (``)}`

        frag.append(li);
    })

    $followers.append(frag);
}

// 버튼 이벤트
if (viewMyFollowerList) {
    // (팔로우(하기) 버튼만 가능, 팔로워를 삭제하는 버튼은 있지만 기능은 없음 disabled 처리)
    $followers.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-follow')) {
            // 팔로우 기능
            // 클릭한 요소의 사용자계정 
            const clickedAccount = e.target.closest('li').querySelector('a').href.split('?accountName=')[1];
            await postFollow(clickedAccount);

            e.target.innerHTML = `삭제<span class="a11y-hidden">하기</span>`;
            e.target.disabled = true;
        }
    })
} else {
    // (팔로우(하기) 버튼, 팔로잉(취소) 버튼)
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
}

// --- API 함수들 ---

// GET 사용자 팔로워 목록 
function fetchFollowerList() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = `/profile/${accountname}/follower?limit=12&skip=`;
    let reqCnt = 0; // 클로저로 사용될 요청 카운트 변수

    const getFollowerList = async () => {
        const res = await fetch(url + reqPath + reqCnt * 12, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });

        reqCnt++; // 요청 후에 카운트를 증가시킴
        const json = await res.json();
        return json;
    };

    return getFollowerList; // 클로저 함수 반환
}

// POST 팔로우
async function postFollow(accountName) {
    try {
        await fetch('https://api.mandarin.weniv.co.kr' + `/profile/${accountName}/follow`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });
    } catch (err) {
        location.href='./404.html'
    }
}

// DELETE 팔로우
async function deleteFollow(accountName) {
    try {
        await fetch('https://api.mandarin.weniv.co.kr' + `/profile/${accountName}/unfollow`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });
    } catch (err) {
        location.href='./404.html'
    }
}