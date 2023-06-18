const followerListBtns = document.querySelectorAll('.btn-follow');

followerListBtns.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('opposite')) {
            item.classList.remove('opposite');
            item.innerHTML = `팔로우<span class="a11y-hidden">하기 버튼</span>`;
        } else {
            item.classList.add('opposite');
            item.innerHTML = `삭제<span class="a11y-hidden">하기 버튼</span>`;
        }
    })
})