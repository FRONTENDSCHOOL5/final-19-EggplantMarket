const submitButton = document.querySelector('.btn-save');
const inpsProduct = document.querySelectorAll('#upload-product input');
const imgInp = document.querySelector('#product-img-upload');
const produceName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const purchaseLink = document.querySelector('#purchase-link');

// 프로필 정보 불러오기
const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem("user-token");

/////// 
let validItemName = false;
let validItemPrice = false;
let validItemLink = false;
let validImage = false;

inpsProduct.forEach(item => {
    item.addEventListener('input', async () => {
        if(item.type !== 'file'){
            item.value = item.value.trim();
        }
        await validateProduct(item);

            if (validItemName && validItemPrice && validItemLink && validImage) {
                if (produceName.value === "" || produceName.value.length === 1) {
                    submitButton.disabled = true;
                } else {
                    console.log('다 통과했는디');
                    submitButton.disabled = false;
                }
            } else {
                submitButton.disabled = true;
            
        }
    });
});

// 유효성 검사
async function validateProduct(target) {

    // 상품명 validation
    if (target.id === 'product-name') {
        if (!target.validity.tooShort && !target.validity.tooLong) {
            document.querySelector(`.warning-msg-productname`).style.display = 'none';
            produceName.style.borderBottom = '1px solid #dbdbdb';
            validItemName = true;
        } else {
            document.querySelector('.warning-msg-productname').textContent = '*2~15자 이내여야 합니다.'
            document.querySelector(`.warning-msg-productname`).style.display = 'block'
            produceName.style.borderBottom = '1px solid red';
            validItemName = false;
        }
    }

    // 상품 가격 validation
    if (target.id === 'product-price'){
        if(!target.validity.rangeUnderflow && !target.validity.rangeOverflow){
            document.querySelector(`.warning-msg-productprice`).style.display = 'none';
            productPrice.style.borderBottom = '1px solid #dbdbdb';
            validItemPrice = true;
        } else{
            document.querySelector(`.warning-msg-productprice`).textContent = '*너무 숫자가 커요!';
            document.querySelector(`.warning-msg-productprice`).style.display = 'block';
            productPrice.style.borderBottom = '1px solid red';
            validItemPrice = false
        }
    }

    // 상품 링크 validation
    if (target.id === 'purchase-link') {
        const urlPattern = /^(https?:\/\/)?(www\.)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
        if (urlPattern.test(target.value)) {
            document.querySelector('.warning-msg-purchaselink').style.display = 'none';
            purchaseLink.style.borderBottom = '1px solid #dbdbdb';
            validItemLink = true;
        } else {
            document.querySelector('.warning-msg-purchaselink').textContent = 'URL 형식으로 입력해주세요';
            document.querySelector(`.warning-msg-purchaselink`).style.display = 'block';
            purchaseLink.style.borderBottom = '1px solid red';
            validItemLink = false;
        }
    }

    // 상품 이미지 validation
    if (target.id === 'product-img-upload') {
        validImage = true;
    }
}

async function saveProduct(url, token){
    const reqPath = '/product'

    // 가격
    const price = parseInt(productPrice.value);
    // 이미지 넣기
    const fileName = await postImg();
    const imageURL = "https://api.mandarin.weniv.co.kr/" + fileName;
    
    // 데이터 생성
    const data = {
        "product": {
            "itemName": produceName.value,
            "price": price,
            "link": purchaseLink.value,
            "itemImage": imageURL,
        }
    };

    // post에 요청
    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    localStorage.setItem("product-id", json.product.id);
    console.log(json);
}

async function postImg() {
    const formData = new FormData();
    const reqPath = "/image/uploadfile";
    if (document.querySelector('#product-img-upload').files[0]) {
        formData.append("image", document.querySelector('#product-img-upload').files[0])
        const res = await fetch(url + reqPath, {
            method: "POST",
            body: formData
        });
        const json = await res.json();

        return json.filename;
    }
}

imgInp.addEventListener('change', async (e) => {
    const imageFile = e.target.files[0];
    if(checkImageExtension(imageFile)){
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch("https://api.mandarin.weniv.co.kr/image/uploadfile", {
            method: "POST",
            body: formData
        });
        const json = await res.json();
        const imageURL = "https://api.mandarin.weniv.co.kr/" + json.filename;

        // 보여지는 이미지 업데이트
        const imageInput = document.querySelector('.product-img');
        imageInput.style.backgroundImage = `url('${imageURL}')`;
        imageInput.style.backgroundSize = 'cover';
        imageInput.style.backgroundPosition = 'center';
        imageInput.style.backgroundRepeat = 'no-repeat';
    } else {
        alert('유효하지 않은 파일 입니다')
        input.value = '';
    }
});

submitButton.addEventListener('click', async (e) => {
    e.preventDefault()
    await saveProduct(url, token);
    console.log('상품 등록 완료')
    location.href = `./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`
})