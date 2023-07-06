const accountname = new URLSearchParams(location.search).get('accountName'),
    myAccountname = localStorage.getItem('user-accountname'),
    token = localStorage.getItem('user-token');

const followings = document.querySelector('.follow-list');

// 무한 스크롤 
window.addEventListener("scroll", async () => {
    if (getScrollTop() >= getDocumentHeight() - window.innerHeight) {
        console.log('바닥이당! 데이터 불러올게 기다려!')
        throttle(makeList(await getFollowingList()), 1000)
    };
})

// 버튼 이벤트
followings.addEventListener('click', async (e) => {
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
        location.href='./404.html'
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
        location.href='./404.html'
    }
}

// GET 사용자 팔로잉 목록
let reqCnt = 0;
async function getFollowingList() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = `/profile/${accountname}/following?limit=12&skip=${reqCnt++ * 12}`;

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
async function makeList(data) {
    const frag = document.createDocumentFragment();

    data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'follow-item');
        li.innerHTML = `<a class="user-img img-cover" href="./profile_info.html?accountName=${user.accountname}">
        <img src=${checkImageUrl(user.image,'profile')} alt="">
    </a>
    <div class="user-info">
        <strong class="user-name">
            <a href="./profile_info.html?accountName=${user.accountname}">${user.username}<span class="a11y-hidden">의 프로필 보기</span></a>
        </strong>
        <p class="user-intro ellipsis">${user.intro}</p>
    </div>
    ${user.accountname !== myAccountname ? (user.isfollow ? `<button class="btn-follow opposite">팔로잉<span class="a11y-hidden">취소</span></button>` : `<button class="btn-follow">팔로우<span class="a11y-hidden">하기</span></button>`) : (``)}
    `

        frag.append(li);
    })

    followings.append(frag);
}

async function run() {
    const data = await getFollowingList();
    makeList(data);
};

run()

//테마 작업 진행중.
// const wrapper = document.querySelector('.following-wrapper');
// const theme = window.localStorage.getItem('theme');
// if (theme === 'highContrast') {
//     wrapper.classList.add('highContrast');
//     document.body.style.backgroundColor = '#000000';
//     document.getElementById("profile-following-back-btn").src = "../assets/icon/icon-arrow-left-hc.svg";

// } else {
//     wrapper.classList.remove('highContrast');
//     document.body.style.backgroundColor = '#ffffff'; 
    
// }