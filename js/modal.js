// 모달

const postModal = document.querySelector('.post-modal-background');
const popUpModal = document.querySelector('.modal-background');
const modalContent = document.querySelector('.modal-content')

function handleModal() {
    const headerBtnOption = document.querySelector('header .btn-option');
    const postBtnOption = document.querySelectorAll('main .btn-option');
    const productBtn = document.querySelectorAll('main .product');
    const commentBtnOption = document.querySelectorAll('.btn-more');

    if(headerBtnOption){
        handleHeaderModal(headerBtnOption)
    }
    if(postBtnOption.length !== 0){
        handlePostOptionModal(postBtnOption)
    }
    if(commentBtnOption.length !== 0){
        handleCommentOptionModal(commentBtnOption)
    }
    // if(mainBtnOption){}

    
    

}

function handleHeaderModal(node){
    node.addEventListener('click',() => {
        modalContent.innerHTML = `
            <button class="modal-description btn-theme" tabindex="0">테마 변경</button>
            <button class="modal-description btn-logout" tabindex="0">로그아웃</button>
        `

        modalContent.querySelectorAll('.modal-description').forEach(item => {item.addEventListener('click', (e) => {

            if(e.currentTarget.classList.contains('btn-theme')){
                // 
            } else {
                editPopUp(popUpModal,'로그아웃하시겠어요?','로그아웃',logOut)
                popUpModal.style.visibility = 'visible';
            }
        })})

        postModal.style.display = 'block';
    });
}

function handlePostOptionModal(nodes) {
    // option 버튼 클릭 시 모달창 나타나기
    nodes.forEach(item => {item.addEventListener('click', (e) => {

        const targetBtn = e.currentTarget

        localStorage.setItem('targetPostId',targetBtn.dataset.postid)

        // 내 글인지 다른 사람 글인지.
        const postAccountName = targetBtn.parentNode.querySelector('a').href.split('accountName=')[1]
        if(myAccountName === postAccountName){
            modalContent.innerHTML = `
                <button class="modal-description btn-edit" tabindex="0">수정</button>
                <button class="modal-description btn-delete" tabindex="0">삭제</button>
            `
        } else {
            modalContent.innerHTML = `<button class="modal-description btn-report" tabindex="0">신고하기</button>`
        }

        modalContent.querySelectorAll('.modal-description').forEach(item => {item.addEventListener('click', (e) => {
            // if(e.currentTarget.classList.contains('btn-edit')){
            //     editPopUp(popUpModal,'수정하시겠어요?','수정', postEdit)
            // }
            if(e.currentTarget.classList.contains('btn-delete')){
                editPopUp(popUpModal,'게시글을 삭제할까요?','삭제', postDelete)
            }
            if(e.currentTarget.classList.contains('btn-report')){
                editPopUp(popUpModal,'게시글을 신고할까요?','신고', postReport)
            }
            popUpModal.style.visibility = 'visible';
        })})

        postModal.style.display = 'block';
    })});
}

function handleCommentOptionModal(nodes){
    nodes.forEach(item=>{item.addEventListener('click', (e) => {
        const postAccountName = e.currentTarget.parentNode.querySelector('a').href.split('accountName=')[1]

        if(myAccountName === postAccountName){
            modalContent.innerHTML = `
                <button class="modal-description btn-delete" tabindex="0">삭제</button>
            `
        } else {
            modalContent.innerHTML = `
                <button class="modal-description btn-report" tabindex="0">신고하기</button>
            `
        }

        modalContent.querySelector('.modal-description').addEventListener('click', (e) => {
            if(e.currentTarget.classList.contains('btn-delete')){
                editPopUp(popUpModal,'댓글을 삭제할까요?','삭제', commentDelete)
            }
            if(e.currentTarget.classList.contains('btn-report')){
                editPopUp(popUpModal,'댓글을 신고할까요?','신고', commentReport)
            }
            popUpModal.style.visibility = 'visible';
        })

        postModal.style.display = 'block';
    })});
}

async function postDelete(){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${localStorage.getItem('targetPostId')}`
    const options = {
        method: "DELETE", 
        headers: {
            "Authorization" : `Bearer ${localStorage.getItem('user-token')}`,
	        "Content-type" : "application/json"
        }
    };
    try {
        const response = await fetch(fullUrl, options)
        const resJson = await response.json()
        console.log(resJson);
    } catch(err){
        console.error(err);
    }
}

async function postReport(){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${localStorage.getItem('targetPostId')}/report`;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('user-token')}`,
            "Content-type" : "application/json"
        }
    };
    try{
        const response = await fetch(fullUrl,options)
        const resJson = await response.json()
        alert
    } catch (err){
        console.error(err)
    }
}


function editPopUp(parent, desc, btnText, action){
    parent.querySelector('.modal-description').textContent = desc
    parent.querySelector('.right-button').textContent = btnText;
    parent.querySelector('.right-button').addEventListener('click',action);
}

// 기능

function logOut(){
    localStorage.clear()
    location.href = './login.html'
}

// 하단에 띄어진 모달이 아닌 배경을 클릭하면 모달창 닫기
postModal.addEventListener('click', (event) => {
    const targetElement = event.target;

    if (targetElement.classList.contains('post-modal-background')) {
        postModal.style.display = 'none';
        localStorage.removeItem('targetPostId')
    }
});

// 팝업으로 띄어진 모달이 아닌 배경을 클릭하면 모달창 닫기
popUpModal.addEventListener('click', (event) => {
    const targetElement = event.target;

    if (targetElement.classList.contains('modal-background') || targetElement.classList.contains('left-button')) {
        popUpModal.style.visibility = 'hidden';
    }
});