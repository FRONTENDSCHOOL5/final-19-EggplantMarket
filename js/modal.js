// 모달

const postModal = document.querySelector('.post-modal-background');
const popUpModal = document.querySelector('.modal-background');
const modalContent = document.querySelector('.modal-content')

function handleModal() {
    const headerBtnOption = document.querySelector('header .btn-option');
    const postBtnOption = document.querySelectorAll('main .btn-option');
    const productBtn = document.querySelectorAll('main .product');
    const commentBtnOption = document.querySelectorAll('.btn-more');

    console.log(postBtnOption)

    if(headerBtnOption){
        handleHeaderModal(headerBtnOption)
    }
    if(postBtnOption.length !== 0){
        handlePostOptionModal(postBtnOption)
    }
    if(commentBtnOption.length !== 0){
        handleCommentOptionModal(commentBtnOption)
    }
    if(productBtn.length !== 0){
        handleProductOptionModal(productBtn)
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
        let targetPostId = targetBtn.dataset.postid || targetBtn.closest('li').dataset.postid
        
        if(targetPostId === undefined) {
            targetPostId = targetBtn.parentNode.querySelector('.post-edit a').href.split('postId=')[1] 
        }
        
        // 내 글인지 다른 사람 글인지.
        const postAccountName = targetBtn.parentNode.querySelector('a').href.split('accountName=')[1] || window.location.href.split('accountName=')[1]
        if(myAccountName === postAccountName){
            modalContent.innerHTML = `
                <button class="modal-description btn-edit" tabindex="0">수정</button>
                <button class="modal-description btn-delete" tabindex="0">삭제</button>
            `
        } else {
            modalContent.innerHTML = `<button class="modal-description btn-report" tabindex="0">신고하기</button>`
        }

        modalContent.querySelectorAll('.modal-description').forEach(item => {item.addEventListener('click', (e) => {
            if(e.currentTarget.classList.contains('btn-edit')){
                alert('구현x')
            }
            if(e.currentTarget.classList.contains('btn-delete')){
                editPopUp(popUpModal,'게시글을 삭제할까요?','삭제',()=>{postDelete(targetPostId)})
            }
            if(e.currentTarget.classList.contains('btn-report')){
                editPopUp(popUpModal,'게시글을 신고할까요?','신고', ()=>{postReport(targetPostId)})
            }
            popUpModal.style.visibility = 'visible';
        })})

        postModal.style.display = 'block';
    })});
}

function handleCommentOptionModal(nodes){
    nodes.forEach(item=>{item.addEventListener('click', (e) => {
        const postAccountName = e.currentTarget.parentNode.querySelector('a').href.split('accountName=')[1]

        const targetBtn = e.currentTarget
        const targetCommentId = e.currentTarget.dataset.commentid

        const pageUrl = new URL(window.location.href);
        const targetPostId = pageUrl.searchParams.get('postId');

        if(myAccountName === postAccountName){
            modalContent.innerHTML = `<button class="modal-description btn-delete" tabindex="0">삭제</button>`
        } else {
            modalContent.innerHTML = `<button class="modal-description btn-report" tabindex="0">신고하기</button>`
        }

        modalContent.querySelector('.modal-description').addEventListener('click', (e) => {
            if(e.currentTarget.classList.contains('btn-delete')){
                editPopUp(popUpModal,'댓글을 삭제할까요?','삭제',() => commentDelete(targetPostId,targetCommentId))
            }
            if(e.currentTarget.classList.contains('btn-report')){
                editPopUp(popUpModal,'댓글을 신고할까요?','신고',() => commentReport(targetPostId,targetCommentId))
            }
            popUpModal.style.visibility = 'visible';
        })

        postModal.style.display = 'block';
    })});
}

function handleProductOptionModal(nodes){
    nodes.forEach(item=>{item.addEventListener('click',(e)=>{
        const productId = e.currentTarget.dataset.productid;

        console.log(productId)

        const AccountName = window.location.href.split('accountName=')[1]

        if(AccountName === myAccountName){
            modalContent.innerHTML = `<button class="modal-description btn-product-delete" tabindex="0">삭제</button>
                                        <button class="modal-description btn-product-edit" tabindex="0">수정</button>
                                        <button class="modal-description btn-product-link" tabindex="0">웹사이트에서 상품 보기</button>`
        } else{
            modalContent.innerHTML = `<button class="modal-description btn-product-link" tabindex="0">웹사이트에서 상품 보기</button>`
        }

        modalContent.querySelectorAll('.modal-description').forEach(item=>{item.addEventListener('click', (e) => {
            if(e.currentTarget.classList.contains('btn-product-delete')){
                editPopUp(popUpModal,'상품을 삭제할까요?','삭제',() => productDelete(productId))
                popUpModal.style.visibility = 'visible';
            }
            if(e.currentTarget.classList.contains('btn-product-edit')){
                location.href = `./product_upload.html?productId=${productId}`
            }
            if(e.currentTarget.classList.contains('btn-product-link')){
                location.href='./404.html'
            }
            })
            postModal.style.display = 'block';
            })
        })
    })
}

async function postDelete(targetPostId){
    console.log(targetPostId)
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${targetPostId}`
    const options = {
        method: "DELETE", 
        headers: {
            "Authorization" : `Bearer ${localStorage.getItem('user-token')}`,
	        "Content-type" : "application/json"
        }
    };
    try {
        await fetch(fullUrl, options)
        if(window.location.href.includes('detail')){
            location.href = document.referrer
        } else{
            location.reload()
        }
    } catch(err){
        console.error(err);
    }
}

async function postReport(targetPostId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${targetPostId}/report`;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('user-token')}`,
            "Content-type" : "application/json"
        }
    };
    try{
        await fetch(fullUrl,options)
    } catch (err){
        console.error(err)
    }
}

async function commentDelete(targetPostId, targetCommentId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${targetPostId}/comments/${targetCommentId}`;
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('user-token')}`,
            "Content-type" : "application/json"
        }
    };
    try{
        await fetch(fullUrl,options)
        
        if(!alert('댓글이 삭제되었습니다.')){
            location.reload()
        }
    } catch (err){
        console.error(err)
    }
}

async function commentReport(targetPostId, targetCommentId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/post/${targetPostId}/comments/${targetCommentId}/report`;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('user-token')}`,
            "Content-type" : "application/json"
        }
    };
    try{
        await fetch(fullUrl,options)
    } catch (err){
        console.error(err)
    }
}

async function productDelete(productId){
    const fullUrl = `https://api.mandarin.weniv.co.kr/product/${productId}`
    const options = {
        method: "DELETE",
        headers: {
            "Authorization" : `Bearer ${localStorage.getItem('user-token')}`,
	        "Content-type" : "application/json"
        }
    };

    try {
        await fetch(fullUrl, options)
        location.reload()
    } catch(err){
        console.error(err);
    }
}

function editPopUp(parent, desc, btnText, action){
    parent.querySelector('.modal-description').textContent = desc
    parent.querySelector('.right-button').textContent = btnText;
    parent.querySelector('.right-button').addEventListener('click',async ()=>{
        await action()
        postModal.style.display = 'none';
        popUpModal.style.visibility = 'hidden';
    });
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
    }
});

// 팝업으로 띄어진 모달이 아닌 배경을 클릭하면 모달창 닫기
popUpModal.addEventListener('click', (event) => {
    const targetElement = event.target;

    if (targetElement.classList.contains('modal-background') || targetElement.classList.contains('left-button')) {
        popUpModal.style.visibility = 'hidden';
    }
});