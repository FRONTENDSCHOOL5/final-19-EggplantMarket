const openPostModal = document.querySelector('.post-modal-background'),
    openPopUpModal = document.querySelector('.modal-background'),
    displayModal = document.querySelector('.modal-content'),
    performModalActions = openPopUpModal.querySelector('.modal-content .modal-actions');

function handleModal() {
    const openHeaderOptions = document.querySelector('header .btn-option'),
        openPostOptions = document.querySelectorAll('main .btn-option'),
        openProductOptions = document.querySelectorAll('main .product'),
        openCommentOptions = document.querySelectorAll('.btn-more');

    if(openHeaderOptions){
        handleHeaderModal(openHeaderOptions);
        focusOnOptionButton(openHeaderOptions);
    }
    if(openPostOptions.length !== 0){
        handlePostOptionModal(openPostOptions);
    }
    if(openCommentOptions.length !== 0){
        handleCommentOptionModal(openCommentOptions);
    }
    if (openProductOptions.length !== 0) {
        handleProductOptionModal(openProductOptions, myAccountName);
    }
}

let lastFocusedElement;
// tab으로 focus 이동
function focusOnOptionButton(nodes) {
    nodes.addEventListener('keydown', event => {
        if (event.key === 'Tab' && !event.shiftKey) {
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
        } else if (event.key === 'Enter') {
            setTimeout(()=> displayModal.querySelector('.modal-description').focus());
        }
    });
}

// tab focus
function setFocusOnModalActions() {
    const focusableElements = Array.from(performModalActions.getElementsByTagName('button'));
    focusableElements[0].focus();
    focusableElements[1].addEventListener('click', () => {
        openPopUpModal.style.visibility = 'hidden';
        const cancelButton = displayModal.querySelector('.btn-cancel');
        cancelButton.focus();
    });
}

// 취소 버튼 기능
function handleCancelClick(item) {
    openPostModal.style.display = 'none';
    const focusableElements = Array.from(document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')), 
        currentItemIndex = focusableElements.findIndex(element => element === item), currentElement = focusableElements[currentItemIndex];
    if (currentElement) {
        currentElement.focus();
    }
}

// 테마 변경
function changeTheme(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keydown', function (e) {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                const nextInput = inputs[i + 1] || inputs[0];
                nextInput.focus();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                inputs[i].click();
                localStorage.setItem('theme',e.target.id);
            } else if (e.key === 'Tab' && e.shiftKey){
                e.preventDefault();
                const prevInput = inputs[i - 1] || inputs[inputs.length - 1];
                prevInput.focus();
            }
        });
        inputs[i].addEventListener('click', function (e) {
            if(!inputs[i].classList.contains('btn-cancel')){
                inputs[i].click();
                localStorage.setItem('theme',e.target.id);
                colorChange();
            }
        });
    }
}

// 모달창 기능 - 상단 option 모달창
function handleHeaderModal(node) {
    node.addEventListener('click', () => {
        displayModal.textContent  = ''; //displayModal 요소의 내부 내용이 누적되어 초기화하기 위해 사용
        const changeThemeBtn = createModalButton('테마 변경', 'btn-theme'),
            logoutBtn = createModalButton('로그아웃', 'btn-logout'),
            cancelBtn = createModalButton('취소', 'btn-cancel');

        cancelBtn.addEventListener('click', () => {
            openPostModal.style.display = 'none';
            node.focus();
        });

        // 테마 변경 클릭 시 새로 생성되는 하단 모달창
        changeThemeBtn.addEventListener('click', () => {
            displayModal.textContent  = '';

            const modeSelectContainer = document.createElement('div');
            modeSelectContainer.classList.add('mode_select');
            
            const lightRadio = createModalRadio('colorSet', 'light', 'LIGHT', localStorage.getItem('theme') === 'light'), 
                highContrastRadio = createModalRadio('colorSet', 'highContrast', 'highContrast', localStorage.getItem('theme') === 'highContrast'),
                cancelThemeBtn = createModalButton('취소', 'btn-cancel', 'theme');
            
            const inputs = [lightRadio, highContrastRadio, cancelThemeBtn];
            changeTheme(inputs);

            cancelThemeBtn.addEventListener('click', () => {
                openPostModal.style.display = 'none';
                node.focus();
            });
            modeSelectContainer.appendChild(lightRadio);
            modeSelectContainer.appendChild(highContrastRadio);
            modeSelectContainer.appendChild(cancelThemeBtn);
            displayModal.appendChild(modeSelectContainer);
        });
        logoutBtn.addEventListener('click', () => {
            editPopUp(openPopUpModal, '로그아웃하시겠어요?', '로그아웃', logOut);
            openPopUpModal.style.visibility = 'visible';
            setFocusOnModalActions();
        });
        displayModal.appendChild(changeThemeBtn);
        displayModal.appendChild(logoutBtn);
        displayModal.appendChild(cancelBtn);
        openPostModal.style.display = 'block';
    });
}

// 게시물 option 모달창
function handlePostOptionModal(nodes) {
    nodes.forEach((item) => {
        item.addEventListener('click', (e) => {
            const targetButton = e.currentTarget,
                targetPostId = targetButton.closest('.home-post').dataset.postid,
                postAccountName = targetButton.parentNode.querySelector('a').href.split('accountName=')[1] || window.location.href.split('accountName=')[1];
            
            const options = [
                { text: '수정', class: 'btn-edit' },
                { text: '삭제', class: 'btn-delete' },
                { text: '신고하기', class: 'btn-report' },
                { text: '취소', class: 'btn-cancel' },
            ];

            if (myAccountName === postAccountName) {
                options.splice(2, 1); // options에서 '신고하기' 없애기 
            } else {
                options.splice(0, 2); // options에서 '수정', '삭제' 없애기
            }

            displayModal.textContent  = '';
            options.forEach((option) => {
                const button = createModalButton(option.text, option.class);
                button.addEventListener('click', () => {
                    handlePostOptionClick(option.class, targetPostId);
                });
                displayModal.appendChild(button);
            });
            const cancelButton = displayModal.querySelector('.btn-cancel');
            cancelButton.addEventListener('click', () => {
                handleCancelClick(item);
            });
            openPostModal.style.display = 'block';
        });
        focusOnOptionButton(item);
    });
}

// 댓글 option 모달창
function handleCommentOptionModal(nodes) {
    nodes.forEach((item) => {
        item.addEventListener('click', (e) => {
            const targetButton = e.currentTarget,
                targetCommentId = targetButton.dataset.commentid,
                postAccountName = targetButton.parentNode.querySelector('a').href.split('accountName=')[1];

            const pageUrl = new URL(window.location.href);
            const targetPostId = pageUrl.searchParams.get('postId');
            
            const options = [
                { text: '삭제', class: 'btn-delete' },
                { text: '신고하기', class: 'btn-report' },
                { text: '취소', class: 'btn-cancel' },
            ];

            if (myAccountName === postAccountName) {
                options.splice(1, 1); // options에서 '신고하기' 없애기
            } else {
                options.splice(0, 1); // options에서 '삭제' 없애기
            }

            displayModal.textContent  = '';
            options.forEach((option) => {
                const button = createModalButton(option.text, option.class);
                button.addEventListener('click', () => {
                    handleCommentOptionClick(option.class, targetPostId, targetCommentId);
                });
                displayModal.appendChild(button);
            });
            const cancelButton = displayModal.querySelector('.btn-cancel');
            cancelButton.addEventListener('click', () => {
                handleCancelClick(item);
            });
        
            openPostModal.style.display = 'block';
            });
        focusOnOptionButton(item);
    });
}

// 상품 option 모달창
function handleProductOptionModal(nodes, myAccountName) {
    nodes.forEach((item) => {
        item.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productid,
                accountName = window.location.href.split('accountName=')[1];
            const options = [
                { text: '삭제', class: 'btn-product-delete' },
                { text: '수정', class: 'btn-product-edit' },
                { text: '웹사이트에서 상품 보기', class: 'btn-product-link' },
                { text: '취소', class: 'btn-cancel' },
            ];
            if (accountName !== myAccountName) {
                options.splice(0, 2); // options에서 '삭제', '수정' 없애기
            }
            displayModal.textContent  = '';
            options.forEach((option) => {
                const button = createModalButton(option.text, option.class);
                button.addEventListener('click', () => {
                    handleProductOptionClick(option.class, productId);
                });
                displayModal.appendChild(button);
            });
            const cancelButton = displayModal.querySelector('.btn-cancel');
            cancelButton.addEventListener('click', () => {
                handleCancelClick(item);
            });
        openPostModal.style.display = 'block';
        });
        focusOnOptionButton(item);
    });
}

// 하단 모달창 option 생성
function createModalButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('modal-description');
    if (className) {
        button.classList.add(className);
    }
    return button;
}

// 고대비 테마 radio 설정
function createModalRadio(name, id, label, checked) {
    const labelElem = document.createElement('label'),
        inputElem = document.createElement('input');
    inputElem.type = 'radio';
    inputElem.name = name;
    inputElem.id = id;
    inputElem.checked = checked;
    inputElem.classList.add('theme');
    labelElem.setAttribute('for', id);
    labelElem.classList.add('modal-description');
    const labelText = document.createElement('span');
    labelText.textContent = label;
    labelElem.appendChild(inputElem);
    labelElem.appendChild(labelText);
    return labelElem;
}

// 게시물 삭제 및 신고 클릭 시
function handlePostOptionClick(option, postId) {
    if (option === 'btn-edit') {
        location.href = `./post_upload.html?postId=${postId}`;
    } else if (option === 'btn-delete') {
        editPopUp(openPopUpModal, '게시글을 삭제할까요?', '삭제', () => {
            deletePost(postId);
        });
        openPopUpModal.style.visibility = 'visible';
        setFocusOnModalActions();
    } else if (option === 'btn-report') {
        editPopUp(openPopUpModal, '게시글을 신고할까요?', '신고', () => {
            reportPost(postId);
        });
        openPopUpModal.style.visibility = 'visible';
        setFocusOnModalActions();
    }
}

// 댓글 삭제 및 신고 클릭 시
function handleCommentOptionClick(option, postId, commentId) {
    if (option === 'btn-delete') {
        editPopUp(openPopUpModal, '댓글을 삭제할까요?', '삭제', () => {
            deleteComment(postId, commentId);
        });
        openPopUpModal.style.visibility = 'visible';
        setFocusOnModalActions();
    } else if (option === 'btn-report') {
        editPopUp(openPopUpModal, '댓글을 신고할까요?', '신고', () => {
            reportComment(postId, commentId);
        });
        openPopUpModal.style.visibility = 'visible';
        setFocusOnModalActions();
    }
}

// 상품 삭제 및 신고 클릭 시
function handleProductOptionClick(option, productId) {
    if (option === 'btn-product-delete') {
        editPopUp(openPopUpModal, '상품을 삭제할까요?', '삭제', () => {
            deleteProduct(productId);
        });
        openPopUpModal.style.visibility = 'visible';
        setFocusOnModalActions();
    } else if (option === 'btn-product-edit') {
        location.href = `./product_upload.html?productId=${productId}`;
    } else if (option === 'btn-product-link') {
        location.href = './404.html';
    }
}

// 화면에 뜨는 팝업
function editPopUp(parent, description, buttonText, action){
    parent.querySelector('.modal-description').textContent = description;
    parent.querySelector('.right-button').textContent = buttonText;
    const rightButton = parent.querySelector('.right-button');
    const clickHandler = async () => {
        await action();
        openPostModal.style.display = 'none';
        openPopUpModal.style.visibility = 'hidden';
        rightButton.removeEventListener('click', clickHandler);
    };
    rightButton.addEventListener('click', clickHandler);
}

// 로그아웃 시 localStorage 내용 삭제
function logOut(){
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-accountname');
    location.href = './login.html';
}

// 하단에 띄어진 모달이 아닌 배경을 클릭하면 모달창 닫기
openPostModal.addEventListener('click', (event) => {
    const targetElement = event.target;

    if (targetElement.classList.contains('post-modal-background')) {
        openPostModal.style.display = 'none';
    }
});

// 팝업으로 띄어진 모달이 아닌 배경을 클릭하면 모달창 닫기
openPopUpModal.addEventListener('click', (event) => {
    const targetElement = event.target;

    if (targetElement.classList.contains('modal-background') || targetElement.classList.contains('left-button')) {
        openPopUpModal.style.visibility = 'hidden';
    }
});

// 게시물 삭제 api 요청
async function deletePost(targetPostId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${targetPostId}`;
    const options = {
        method: "DELETE", 
        headers: {
            "Authorization" : `Bearer ${localStorage.getItem('user-token')}`,
	        "Content-type" : "application/json"
        }
    };
    try {
        await fetch(fullUrl, options);
        if(window.location.href.includes('detail')){
            location.href = document.referrer;
        } else{
            location.reload();
        }
    } catch(err){
        console.error(err);
        location.href='./404.html';
    }
}

// 게시물 작성 api 요청
async function reportPost(targetPostId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${targetPostId}/report`;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('user-token')}`,
            "Content-type" : "application/json"
        }
    };
    try{
        await fetch(fullUrl,options);
    } catch (err){
        console.error(err);
        location.href='./404.html';
    }
}

// 댓글 삭제 api 요청
async function deleteComment(targetPostId, targetCommentId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${targetPostId}/comments/${targetCommentId}`;
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('user-token')}`,
            "Content-type" : "application/json"
        }
    };
    try{
        await fetch(fullUrl,options);
        location.reload();
    } catch (err){
        console.error(err);
        location.href='./404.html';
    }
}

// 댓글 작성 api 요청
async function reportComment(targetPostId, targetCommentId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${targetPostId}/comments/${targetCommentId}/report`;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('user-token')}`,
            "Content-type" : "application/json"
        }
    };
    try{
        await fetch(fullUrl,options);
    } catch (err){
        console.error(err);
        location.href='./404.html';
    }
}

// 상품 삭제 api 요청
async function deleteProduct(productId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/product/${productId}`;
    const options = {
        method: "DELETE",
        headers: {
            "Authorization" : `Bearer ${localStorage.getItem('user-token')}`,
	        "Content-type" : "application/json"
        }
    };
    try {
        await fetch(fullUrl, options);
        location.reload();
    } catch(err){
        console.error(err);
        location.href='./404.html';
    }
}

handleModal(); // 모달 실행