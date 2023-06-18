const followingListBtns = document.querySelectorAll('.btn-follow');

followingListBtns.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('opposite')) {
            item.classList.remove('opposite');
            item.innerHTML = `팔로우<span class="a11y-hidden">하기 버튼</span>`;
        } else {
            item.classList.add('opposite');
            item.innerHTML = `팔로잉<span class="a11y-hidden">취소 버튼</span>`;
        }
    })
})