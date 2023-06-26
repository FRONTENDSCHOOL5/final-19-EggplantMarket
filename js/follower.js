const accountname = new URLSearchParams(location.search).get('accountName'),
    myAccountname = localStorage.getItem('user-accountname'),
    token = localStorage.getItem('user-token');

const followers = document.querySelector('.follow-list');
let reqCnt = 0;


// 1. 내가 내 팔로워 목록을 보는지, 내가 다른 사용자 팔로워 목록을 보는지
const viewMyFollowerList = accountname === myAccountname ? true : false;


// 무한 스크롤 
window.addEventListener("scroll", async () => {
    if (getScrollTop() >= getDocumentHeight() - window.innerHeight) {
        console.log('바닥이당! 데이터 불러올게 기다려!')
        if (viewMyFollowerList) {
            throttle(makeMyFollowerList(await getFollowerList()), 1000)
        } else {
            throttle(makeUserFollowerList(await getFollowerList()), 1000)
        }
    };
})

async function run() {
    const data = await getFollowerList();
    if (viewMyFollowerList) makeMyFollowerList(data);
    else makeUserFollowerList(data);
};

run()


// event
if (viewMyFollowerList) {
    // (팔로우(하기) 버튼만 가능, 팔로워를 삭제하는 버튼은 있지만 기능은 없음 disabled 처리)
    followers.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-follow')) {
            // 팔로우 기능
            // 클릭한 요소의 사용자계정 
            const clickedAccount = e.target.closest('li').querySelector('a').href.split('?accountName=')[1];
            await postFollow(clickedAccount);

            e.target.innerHTML = `삭제<span class="a11y-hidden">하기 버튼</span>`;
            e.target.disabled = true;
        }
    })
} else {
    // (팔로우(하기) 버튼, 팔로잉(취소) 버튼)
    followers.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-follow')) {
            // 클릭한 요소의 사용자계정 
            const clickedAccount = e.target.closest('li').querySelector('a').href.split('?accountName=')[1];

            if (e.target.classList.contains('opposite')) { // 현재 '팔로잉 취소하기 버튼'일때 가지고 있는 클래스
                // 언팔로우 기능
                await deleteFollow(clickedAccount);

                e.target.classList.remove('opposite');
                e.target.innerHTML = `팔로우<span class="a11y-hidden">하기 버튼</span>`;
            } else {
                // 팔로우 기능
                await postFollow(clickedAccount);

                e.target.classList.add('opposite');
                e.target.innerHTML = `팔로잉<span class="a11y-hidden">취소 버튼</span>`;
            }
        }
    }
    )
}


// POST 팔로우
async function postFollow(accountName) {
    try {
        let res = await fetch('https://api.mandarin.weniv.co.kr' + `/profile/${accountName}/follow`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });

        const resJson = await res.json()
        console.log('팔로우 완료 : ', resJson.profile);
    } catch (err) {
        console.log(err)
    }
}

// DELETE 팔로우
async function deleteFollow(accountName) {
    try {
        let res = await fetch('https://api.mandarin.weniv.co.kr' + `/profile/${accountName}/unfollow`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });

        const resJson = await res.json()
        console.log('팔로우 취소 완료 : ', resJson.profile);
    } catch (err) {
        console.log(err)
    }
}


// GET 사용자 팔로워 목록 
async function getFollowerList() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = `/profile/${accountname}/follower?limit=12&skip=${reqCnt++ * 12}`;

    const res = await fetch(url + reqPath, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json"
        }
    })

    const json = await res.json();
    return json;
}

// 내 팔로워 목록 뿌리기 
// : (팔로우(하기) 버튼만 가능, 팔로워를 삭제하는 버튼은 있지만 기능은 없음 disabled 처리)
async function makeMyFollowerList(data) {
    const frag = document.createDocumentFragment();

    data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'follow-item');
        li.innerHTML = `<a class="user-img img-cover" href="./profile_info.html?accountName=${user.accountname}" tabindex="1">
        <img src=${checkImageUrl(user.image,'profile')} alt="사용자 이미지">
    </a>
    <div class="user-info">
        <strong class="user-name">
            <a href="./profile_info.html?accountName=${user.accountname}" tabindex="1"><span class="a11y-hidden">사용자 이름,</span>${user.username}</a>
        </strong>
        <p class="user-intro ellipsis"><span class="a11y-hidden">사용자 소개</span>${user.intro}</p>
    </div>
    ${user.isfollow ? '<button class="btn-follow" disabled>삭제<span class="a11y-hidden">하기 버튼</span></button>' : `<button class="btn-follow" tabindex="1">팔로우<span class="a11y-hidden">하기 버튼</span></button>`}`

        frag.append(li);
    })

    followers.append(frag);
}

// 다른 사용자 팔로워 목록 뿌리기 
// : (팔로우(하기) 버튼, 팔로잉(취소) 버튼)
async function makeUserFollowerList(data) {

    console.log(data)
    const frag = document.createDocumentFragment();

    data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'follow-item');
        li.innerHTML = `<a class="user-img img-cover" href="./profile_info.html?accountName=${user.accountname}" tabindex="1">
        <img src=${checkImageUrl(user.image,'profile')} alt="사용자 이미지">
    </a>
    <div class="user-info">
        <strong class="user-name">
            <a href="./profile_info.html?accountName=${user.accountname}" tabindex="1"><span class="a11y-hidden">사용자 이름,</span>${user.username}</a>
        </strong>
        <p class="user-intro ellipsis"><span class="a11y-hidden">사용자 소개</span>${user.intro}</p>
    </div>
    ${user.accountname !== myAccountname ? (user.isfollow ? `<button class="btn-follow opposite" tabindex="1">팔로잉<span class="a11y-hidden">취소 버튼</span></button>` : `<button class="btn-follow" tabindex="1">팔로우<span class="a11y-hidden">하기 버튼</span></button>`) : (``)}
    `

        frag.append(li);
    })

    followers.append(frag);
}