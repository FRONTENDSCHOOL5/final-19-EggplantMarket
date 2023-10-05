async function getFooter() {
    const footer = document.querySelector('footer');

    await fetch('./component/footer.html')
        .then(res => res.text())
        .then(data => footer.innerHTML = data);

    if (document.querySelector('.tab-item-more a') !== null) {
        document.querySelector('.tab-item-more a').href = `./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`;
    } // 연속 두번 이상 누르면 안먹힘!!

}
getFooter();