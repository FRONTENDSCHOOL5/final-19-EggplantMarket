const submitButton = document.querySelector(".btn-save"),
    inputFields = document.querySelectorAll("#upload-product input"),
    imgInput = document.querySelector("#product-img-upload"),
    imageInput = document.querySelector(".product-img"),
    productName = document.querySelector("#product-name"),
    productPrice = document.querySelector("#product-price"),
    purchaseLink = document.querySelector("#purchase-link");
const warningMsgProductName = document.querySelector(".warning-msg-productname"),
    warningMsgProductPrice = document.querySelector(".warning-msg-productprice"),
    warningMsgPurchaseLink = document.querySelector(".warning-msg-purchaselink");

// 프로필 정보 불러오기
const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem("user-token");
///////

const pageUrl = new URL(window.location.href);
const productID = pageUrl.searchParams.get('productId');
const METHOD = productID ? 'PUT' : 'POST'
///////

document.addEventListener("DOMContentLoaded", function () {
    submitButton.addEventListener("keydown", function (event) {
        if (event.key === "Tab" && !event.shiftKey) {
            event.preventDefault();
            imgInput.focus();
        }
    });
});

let isValidProductName = false;
let isValidProductPrice = false;
let isValidPurchaseLink = false;
let isValidImage = false;

inputFields.forEach((item) => {
    item.addEventListener("change", () => {
        // item이 productName 혹은 purchaseLink일 때만 trim() 적용
        if (item === productName || item === purchaseLink) {
            item.value = item.value.trim();
        }
        validateProduct(item);
        validateForm();
    });
});

// 입력값 유효성 검사
function validateForm() {
    if (isValidProductName && isValidProductPrice && isValidPurchaseLink && isValidImage) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

function validateProduct(target) {
    // 상품명 validation
    if (target === productName) {
        isValidProductName = validateProductName(productName, warningMsgProductName);
    }

    // 상품 가격 validation
    if (target === productPrice) {
        isValidProductPrice = validateProductPrice(productPrice, warningMsgProductPrice);
    }

    // 상품 링크 validation
    if (target === purchaseLink) {
        isValidPurchaseLink = validatePurchaseLink(purchaseLink, warningMsgPurchaseLink);
    }

    // 상품 이미지 validation
    if (target === imgInput) {
        isValidImage = validateProductImage(imgInput);
    }
}

// 입력된 정보 저장하기
async function saveProduct(url, token, METHOD) {
    // 가격
    const price = parseInt(productPrice.value);
    // 이미지 저장
    const fileName = await saveImage();
    const imageURL = url + `/${fileName}`;

    // 데이터 생성
    const data = {
        product: {
            itemName: productName.value,
            price: price,
            link: purchaseLink.value,
            itemImage: imageURL,
        },
    };

    try {
        const currentImageSrc = imageInput.style.backgroundImage;
        let updatedData = { ...data };
        let checkURL = `url('${imageURL}')`;
        const reqPath = (METHOD === "POST") ? url + "/product" : url + `/product/${productID}`
        if (currentImageSrc !== checkURL) {
            updatedData.product.itemImage = currentImageSrc.slice(5, -2);
        }
        
        const res = await fetch(reqPath, {
            method: METHOD,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });
        const json = await res.json();
        return json;
    } catch (err) {
        console.error(err);
        location.href = "./404.html";
        // 저장 실패 시 에러 처리
    }
}

imgInput.addEventListener("change", async (e) => {
    const imageFile = e.target.files[0];
    if (checkImageExtension(imageFile)) {
        await postImg(imageFile);
    } else {
        alert("유효하지 않은 파일 입니다");
        input.value = "";
    }
});

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    await saveProduct(url, token, METHOD);
    location.href = `./profile_info.html?accountName=${localStorage.getItem(
        "user-accountname"
    )}`;
});

// productID가 있는 경우
if(productID){
    submitButton.disabled = false; // 수정을 잘못 누른 경우 고려 - 수정사항 없어도 바로 저장 가능하도록
    getProduct(url, token, productID); // 저장된 데이터 불러오기
}

async function getProduct(url, token, productID) {
    const productData = await loadProduct(url, token, productID);
    updateProductInfo(productData.product);
}

function updateProductInfo(productData) { // 입력된 상품 정보 변경 시 새로 입력한 값 저장
    // 상품 이미지 보여주기
    const imageSrc = productData.itemImage;
    if (imageSrc) {
        imageInput.src = imageSrc;
        imageInput.style.backgroundImage = `url('${checkImageUrl(imageSrc, "post")}')`;
        imageInput.style.backgroundSize = "cover";
        imageInput.style.backgroundPosition = "center";
        imageInput.style.backgroundRepeat = "no-repeat";
        isValidImage = true; // 입력된 이미지 유효성 검사
    }
    productName.value = productData.itemName;
    isValidProductName = validateProductName(productName, warningMsgProductName); // 입력된 productName 유효성 검사
    
    productPrice.value = productData.price;
    isValidProductPrice = validateProductPrice(productPrice, warningMsgProductPrice); // 입력된 productPrice 유효성 검사
    
    purchaseLink.value = productData.link;
    isValidPurchaseLink = validatePurchaseLink(purchaseLink, warningMsgPurchaseLink); // 입력된 purchaseLink 유효성 검사

    validateForm(); // 입력값 유효성 검사
}

// ======== validation 함수 ========
// 상품명 validation 함수
function validateProductName(productName, warningMsgProductName) {
    const warningText = "*2~15자 이내여야 합니다.";
    if (productName.value.length >= 2 && productName.value.length <= 15) {
        validateTrueField(productName, warningMsgProductName);
        return true;
    } else {
        validateFalseField(productName, warningMsgProductName, warningText);
        return false;
    }
}

// 상품 가격 validation 함수
function validateProductPrice(productPrice, warningMsgProductPrice) {
    const warningText = "*0에서 1,000,000,000 사이 숫자만 입력해주세요";
    if (!productPrice.validity.rangeUnderflow && !productPrice.validity.rangeOverflow && productPrice.value !== '') {
        validateTrueField(productPrice, warningMsgProductPrice);
        return true;
    } else {
        validateFalseField(productPrice, warningMsgProductPrice, warningText);
        return false;
    }
}

// 상품 링크 validation 함수
function validatePurchaseLink(purchaseLink, warningMsgPurchaseLink) {
    const urlPattern = /^(https?:\/\/)?(www\.)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    const warningText = "URL 형식으로 입력해주세요";
    if (urlPattern.test(purchaseLink.value)) {
        validateTrueField(purchaseLink, warningMsgPurchaseLink);
        return true;
    } else {
        validateFalseField(purchaseLink, warningMsgPurchaseLink, warningText);
        return false;
    }
}

// 상품 이미지 validation 함수
function validateProductImage(imgInp) {
    return !!imgInp.files[0];
}

// validation 조건문이 true인 경우
function validateTrueField(input, warningMsg){
    warningMsg.style.display = "none";
    input.style.borderBottom = "1px solid #dbdbdb";
}

// validation 조건문이 false인 경우
function validateFalseField(input, warningMsg, warningMsgText){
    warningMsg.textContent = warningMsgText;
    warningMsg.style.display = "block";
    input.style.borderBottom = "1px solid red";
}

// ======== API 함수들 ========
async function loadProduct(url, token, productID) { // 저장된 데이터 가져오기
    try {
        const res = await fetch(url + `/product/detail/${productID}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
            },
        });
        const resJson = await res.json();
        return resJson;
    } catch (err) {
        console.error(err);
        location.href = "./404.html";
    }
}

async function saveImage() {
    const file = imgInput.files[0];
    const formData = new FormData();
    const reqPath = "/image/uploadfile";
    if (file) {
        formData.append("image", file);
        const res = await fetch(url + reqPath, {
            method: "POST",
            body: formData,
        });
        const json = await res.json();
        return json.filename;
    }
}

async function postImg(imageFile){
    const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch( url + "/image/uploadfile", {
            method: "POST",
            body: formData,
        });
        const json = await res.json();
        const imageURL = url + `/${json.filename}`;

        // 보여지는 이미지 업데이트
        imageInput.style.backgroundImage = `url('${imageURL}')`;
        imageInput.style.backgroundSize = "cover";
        imageInput.style.backgroundPosition = "center";
        imageInput.style.backgroundRepeat = "no-repeat";
}