const editButton = document.querySelector('.btn-save');
const editInpsProduct = document.querySelectorAll('#upload-product input');
const editImgInp = document.querySelector('#product-img-upload');
const editProduceName = document.querySelector('#product-name');
const editProductPrice = document.querySelector('#product-price');
const editPurchaseLink = document.querySelector('#purchase-link');

const apiUrl = "https://api.mandarin.weniv.co.kr",
    userToken = localStorage.getItem("user-token");

////////
async function Load_product(apiUrl, token, productID) {
    try {
        const res = await fetch(apiUrl + `/product/detail/${productID}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type" : "application/json"
            }
        });
        const resJson = await res.json();
        console.log(resJson);
        return resJson
    } catch (err) {
        console.error(err);
    }
}    

let validItemName = false;
let validItemPrice = false;
let validItemLink = false;
let validImage = false;

editInpsProduct.forEach(item => {
    item.addEventListener('change', async () => {
        if(item.id === 'product-name' || item.id === 'product-price' || item.id ==='purchase-link'){
            item.value = item.value.trim();
        }
        await validateProduct(item);

        if (editProduceName.value === "" || editProduceName.value.length === 1) {
            editButton.disabled = true;
        } else{
            if (validItemName || validItemPrice || validItemLink || validImage) {
                console.log('다 통과했는디');
                editButton.disabled = false;
            } else {
                editButton.disabled = true;
            }
        }
    });
});

async function validateProduct(target) {

    // 상품명 validation
    if (target.id === 'product-name') {
        if (!target.validity.tooShort && !target.validity.tooLong) {
            document.querySelector(`.warning-msg-productname`).style.display = 'none';
            editProduceName.style.borderBottom = '1px solid #dbdbdb';
            validItemName = true;
        } else {
            document.querySelector('.warning-msg-productname').textContent = '*2~15자 이내여야 합니다.'
            document.querySelector(`.warning-msg-productname`).style.display = 'block'
            editProduceName.style.borderBottom = '1px solid red';
            validItemName = false;
        }
    }

    // 상품 가격 validation
    if (target.id === 'product-price'){
        if(!target.validity.rangeUnderflow && !target.validity.rangeOverflow){
            document.querySelector(`.warning-msg-productprice`).style.display = 'none';
            editProductPrice.style.borderBottom = '1px solid #dbdbdb';
            validItemPrice = true;
        } else{
            document.querySelector(`.warning-msg-productprice`).textContent = '*너무 숫자가 커요!';
            document.querySelector(`.warning-msg-productprice`).style.display = 'block';
            editProductPrice.style.borderBottom = '1px solid red';
            validItemPrice = false
        }
    }
    // 상품 링크 validation
    if (target.id === 'purchase-link') {
        const urlPattern = /^(https?:\/\/)?(www\.)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
        if (urlPattern.test(target.value)) {
            document.querySelector('.warning-msg-purchaselink').style.display = 'none';
            editPurchaseLink.style.borderBottom = '1px solid #dbdbdb';
            validItemLink = true;
        } else {
            document.querySelector('.warning-msg-purchaselink').textContent = 'URL 형식으로 입력해주세요';
            document.querySelector(`.warning-msg-purchaselink`).style.display = 'block';
            editPurchaseLink.style.borderBottom = '1px solid red';
            validItemLink = false;
        }
    }

    // 상품 이미지 validation
    if (target.id === 'product-img-upload') {
        validImage = true;
    }
}

async function saveProduct(url, token, productID){
    const reqPath = '/product/'

    // 가격
    const price = parseInt(editProductPrice.value);
    // 이미지 넣기
    const fileName = await postImg();
    const imageURL = "https://api.mandarin.weniv.co.kr/" + fileName;
    
    // 데이터 생성
    const data = {
        "product": {
            "itemName": editProduceName.value,
            "price": price,
            "link": editPurchaseLink.value,
            "itemImage": imageURL,
        }
    };

    try{
        const currentImageSrc = document.querySelector('.product-img').style.backgroundImage;
        // 이미지 데이터 저장할 변수 선언
        let updatedData;
        let checkURL = `url('${imageURL}')`
        // 현재 이미지 소스와 다른 경우 데이터의 이미지 URL을 업데이트
        if (currentImageSrc !== checkURL) {
            updatedData = { ...data };
            updatedData.product.itemImage = currentImageSrc.slice(5, -2);
        }
        // PUT에 요청
        const res = await fetch(url + reqPath + productID, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData || data)
        });
        const json = await res.json();
        // console.log(json);
        return json;
    }
    catch (error) {
        console.error(error);
        // 저장 실패 시 에러 처리
        // 저장이 되지만 put에서 404 에러가 발생한다....
    }
}
    
async function postImg() {
    const file = editImgInp.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const reqPath = "/image/uploadfile";
    if (document.querySelector('#product-img-upload').files[0]) {
        formData.append("image", document.querySelector('#product-img-upload').files[0])
        const res = await fetch("https://api.mandarin.weniv.co.kr" + reqPath, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data"
            },
            body: formData
        });
        const json = await res.json();

        return json.filename;
    }
}
    
editImgInp.addEventListener('change', async (e) => {
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
        editImgInp.dataset.updatedImage = imageURL;

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
    
editButton.addEventListener('click', async (e) => {
    e.preventDefault()
    await saveProduct(apiUrl, userToken, productID);
    console.log('상품 등록 완료')
    location.href = `./profile_info.html?accountName=${localStorage.getItem('user-accountname')}`
})


function productUpdate(productData) {
    const imageInput = document.querySelector('.product-img');
    const productNameInput = document.querySelector('#product-name');
    const productPriceInput = document.querySelector('#product-price');
    const purchaseLinkInput = document.querySelector('#purchase-link');

    // 프로필 이미지 보여주기
    const imageSrc = productData.itemImage;
    if(imageSrc) {
        imageInput.src = imageSrc;
        imageInput.style.backgroundImage = `url('${imageSrc}')`;
        imageInput.style.backgroundSize = 'cover';
        imageInput.style.backgroundPosition = 'center';
        imageInput.style.backgroundRepeat = 'no-repeat';
    }
    productNameInput.value = productData.itemName;
    productPriceInput.value = productData.price;
    purchaseLinkInput.value = productData.link;
}
    
async function run(url, token, productID) {
    const productData = await Load_product(url, token, productID);
    productUpdate(productData.product);
}
    
run(apiUrl, userToken, productID)