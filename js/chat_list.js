async function run() {
    await fetch('./component/footer.html')
        .then(res => res.text())
        .then(data => footer.innerHTML = data);

    const iconname = document.querySelector(".tab-item-chat a");
    iconname.className = 'here';

}

run();