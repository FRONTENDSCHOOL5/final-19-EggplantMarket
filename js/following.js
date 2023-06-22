const accountname = new URLSearchParams(location.search).get('accountName'),
    myAccountname = localStorage.getItem('user-accountname'),
    token = localStorage.getItem('user-token');

const followings = document.querySelector('.follow-list');

followings.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-follow')) {
        if (e.target.classList.contains('opposite')) {
            // 언팔로우 기능
            e.target.classList.remove('opposite');
            e.target.innerHTML = `팔로우<span class="a11y-hidden">하기 버튼</span>`;
        } else {
            // 팔로우 기능
            e.target.classList.add('opposite');
            e.target.innerHTML = `팔로잉<span class="a11y-hidden">취소 버튼</span>`;
        }
    }
}
)

// GET 사용자 팔로잉 목록
async function getFollowingList() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = `/profile/${accountname}/following`;

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

// 팔로잉 목록 뿌리기
async function makeList() {
    const data = await getFollowingList();
    console.log(data);

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
    ${user.accountname !== myAccountname ? (user.isfollow ? `<button class="btn-follow opposite" tabindex="1">팔로잉<span class="a11y-hidden">취소 버튼</span></button>` : `<button class="btn-follow" tabindex="1">팔로우<span class="a11y-hidden">하기 버튼</span></button>`) : (``)}
    `

        frag.append(li);
    })

    followings.append(frag);
}

makeList();