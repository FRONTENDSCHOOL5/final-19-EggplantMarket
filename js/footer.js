async function getFooter() {
    const footer = document.querySelector('footer');

    await fetch('./component/footer.html')
        .then(res => res.text())
        .then(data => footer.innerHTML = data);

    const myAccount = localStorage.getItem("user-accountname"), 
    profileAccount = new URLSearchParams(location.search).get('accountName');

    document.querySelector('.tab-item-profile a').href = `./profile_info.html?accountName=${myAccount}`;

    let page = location.pathname;
    if(page.includes('chat')) page = 'chat';
    else if(page.includes('home') && !page.includes('search')) page = 'home';
    else if(page.includes('profile') && myAccount === profileAccount) page = 'profile';
    else page = null;
    
    if(page !== null) {
        const iconname = document.querySelector(`.tab-item-${page} a`);
        iconname.className = 'here';
    }
}
getFooter();