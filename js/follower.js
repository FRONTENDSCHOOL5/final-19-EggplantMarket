// const followerListBtns = document.querySelectorAll('.btn-follow');
const followers = document.querySelector('.follow-list');

// 동적으로 추가된 요소를 제어하기 위해 이벤트 위임으로 변경
followers.addEventListener('click', (e) => {
    console.log('clicked')
    if (e.target.nodeName === 'BUTTON') {
        if (e.target.classList.contains('opposite')) {
            e.target.classList.remove('opposite');
            e.target.innerHTML = `팔로우<span class="a11y-hidden">하기 버튼</span>`;
        } else {
            e.target.classList.add('opposite');
            e.target.innerHTML = `삭제<span class="a11y-hidden">하기 버튼</span>`;
        }
    }
}
)

async function getFollowerList() {
    const accountname = localStorage.getItem('user-accountname');
    const token = localStorage.getItem('user-token');

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

async function makeList() {
    const data = await getFollowerList();
    console.log(data);

    const frag = document.createDocumentFragment();

    data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'follow-item');
        li.innerHTML = `<a class="user-img img-cover" href="./profile_info.html" tabindex="1">
        <img src=${user.image} alt="사용자 이미지">
    </a>
    <div class="user-info">
        <strong class="user-name">
            <a href="./profile_info.html" tabindex="1"><span class="a11y-hidden">사용자 이름,</span>${user.username}</a>
        </strong>
        <p class="user-intro ellipsis"><span class="a11y-hidden">사용자 소개</span>${user.intro}</p>
    </div>
    <button class="btn-follow" tabindex="1">팔로우<span class="a11y-hidden">하기 버튼</span></button>`

        const btn = document.createElement('button');
        btn.setAttribute('class', 'btn-follow');
        btn.setAttribute('tabindex', '1');


        frag.append(li);
    })

    followers.append(frag);
}

makeList();