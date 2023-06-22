const accountname = new URLSearchParams(location.search).get('accountName'),
    myAccountname = localStorage.getItem('user-accountname'),
    token = localStorage.getItem('user-token');

const followers = document.querySelector('.follow-list');

// 1. 내가 내 팔로워 목록을 보는지, 내가 다른 사용자 팔로워 목록을 보는지
const viewMyFollowerList = accountname === myAccountname ? true : false;

(async function () {
    const data = await getFollowerList();
    // console.log('나를 팔로잉하고 있는 사람덜: ', data);

    if (viewMyFollowerList) {
        makeMyFollowerList(data);
        // (팔로우(하기) 버튼만 가능, 팔로워를 삭제하는 버튼은 있지만 기능은 없음 disabled 처리)
        followers.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-follow')) {
                // 팔로우 기능
                console.log('팔로우 할거에요')
                e.target.innerHTML = `삭제<span class="a11y-hidden">하기 버튼</span>`;
                e.target.disabled = true;
            }
        })
    } else {
        makeUserFollowerList(data);
        // (팔로우(하기) 버튼, 팔로잉(취소) 버튼)
        followers.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-follow')) {
                if (e.target.classList.contains('opposite')) { // 현재 '팔로잉 취소하기 버튼'일때 가지고 있는 클래스
                    // 언팔로우 기능
                    console.log('언팔로우 할거에요')
                    e.target.classList.remove('opposite');
                    e.target.innerHTML = `팔로우<span class="a11y-hidden">하기 버튼</span>`;
                } else {
                    // 팔로우 기능
                    console.log('팔로우 할거에요')
                    e.target.classList.add('opposite');
                    e.target.innerHTML = `팔로잉<span class="a11y-hidden">취소 버튼</span>`;
                }
            }
        }
        )
    }
})()

// GET 사용자 팔로워 목록 
async function getFollowerList() {

    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = `/profile/${accountname}/follower`;

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
        <img src=${user.image} alt="사용자 이미지">
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
    const frag = document.createDocumentFragment();

    data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'follow-item');
        li.innerHTML = `<a class="user-img img-cover" href="./profile_info.html?accountName=${user.accountname}" tabindex="1">
        <img src=${user.image} alt="사용자 이미지">
    </a>
    <div class="user-info">
        <strong class="user-name">
            <a href="./profile_info.html?accountName=${user.accountname}" tabindex="1"><span class="a11y-hidden">사용자 이름,</span>${user.username}</a>
        </strong>
        <p class="user-intro ellipsis"><span class="a11y-hidden">사용자 소개</span>${user.intro}</p>
    </div>
    ${user.isfollow ? `<button class="btn-follow opposite" tabindex="1">팔로잉<span class="a11y-hidden">취소 버튼</span></button>` : `<button class="btn-follow" tabindex="1">팔로우<span class="a11y-hidden">하기 버튼</span></button>`}
    `

        frag.append(li);
    })

    followers.append(frag);
}