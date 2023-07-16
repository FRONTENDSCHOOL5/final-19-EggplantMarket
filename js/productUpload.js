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
  item.addEventListener("change", async () => {
    if (item === productName || item === productPrice || item === purchaseLink) {
      item.value = item.value.trim();
    }
    await validateProduct(item);

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

async function validateProduct(target) {
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
  const reqPath = "/product";

  // 가격
  const price = parseInt(productPrice.value);
  // 이미지 넣기
  const fileName = await uploadImage();
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

  if(METHOD === "POST"){  // 상품 등록 클릭 시 
    try {
      // POST 요청
      const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      location.href = "./404.html";
      // 저장 실패 시 에러 처리
    }
  } else { // 상품 수정 클릭 시
    try {
      const currentImageSrc = imageInput.style.backgroundImage;
      // 이미지 데이터 저장할 변수 선언
      let updatedData;
      let checkURL = `url('${imageURL}')`;
      // 현재 이미지 소스와 다른 경우 데이터의 이미지 URL을 업데이트
      if (currentImageSrc !== checkURL) {
        updatedData = { ...data };
        updatedData.product.itemImage = currentImageSrc.slice(5, -2);
      }
      // PUT에 요청
      const res = await fetch(url + reqPath + `/${productID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData || data),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      location.href = "./404.html";
      // 저장 실패 시 에러 처리
    }
  }
}

async function uploadImage() {
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

imgInput.addEventListener("change", async (e) => {
  const imageFile = e.target.files[0];
  if (checkImageExtension(imageFile)) {
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
  } else {
    alert("유효하지 않은 파일 입니다");
    input.value = "";
  }
});

submitButton.addEventListener("click", async (e) => {
  if(METHOD === "PUT"){
    e.target.disabled = true;
  }
  e.preventDefault();
  await saveProduct(url, token, METHOD);
  location.href = `./profile_info.html?accountName=${localStorage.getItem(
    "user-accountname"
  )}`;
});

// productID가 있는 경우
if(productID){
  submitButton.disabled = false; // 수정을 잘못 누른 경우 고려 - 수정사항 없어도 바로 저장 가능하도록

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

  // 저장된 상품 정보 화면에 보여주기
  function updateProductInfo(productData) {
    // 프로필 이미지 보여주기
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

  async function getProduct(url, token, productID) {
    const productData = await loadProduct(url, token, productID);
    updateProductInfo(productData.product);
  }

  getProduct(url, token, productID);
}

// 상품명 validation 함수
function validateProductName(productName, warningMsgProductName) {
  if (productName.value.length >= 2 && productName.value.length <= 15) {
    warningMsgProductName.style.display = "none";
    productName.style.borderBottom = "1px solid #dbdbdb";
    return true;
  } else {
    warningMsgProductName.textContent = "*2~15자 이내여야 합니다.";
    warningMsgProductName.style.display = "block";
    productName.style.borderBottom = "1px solid red";
    return false;
  }
}

// 상품 가격 validation 함수
function validateProductPrice(productPrice, warningMsgProductPrice) {
  if (!productPrice.validity.rangeUnderflow && !productPrice.validity.rangeOverflow) {
    warningMsgProductPrice.style.display = "none";
    productPrice.style.borderBottom = "1px solid #dbdbdb";
    return true;
  } else {
    warningMsgProductPrice.textContent = "*너무 숫자가 커요!";
    warningMsgProductPrice.style.display = "block";
    productPrice.style.borderBottom = "1px solid red";
    return false;
  }
}

// 상품 링크 validation 함수
function validatePurchaseLink(purchaseLink, warningMsgPurchaseLink) {
  const urlPattern = /^(https?:\/\/)?(www\.)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  if (urlPattern.test(purchaseLink.value)) {
    warningMsgPurchaseLink.style.display = "none";
    purchaseLink.style.borderBottom = "1px solid #dbdbdb";
    return true;
  } else {
    warningMsgPurchaseLink.textContent = "URL 형식으로 입력해주세요";
    warningMsgPurchaseLink.style.display = "block";
    purchaseLink.style.borderBottom = "1px solid red";
    return false;
  }
}

// 상품 이미지 validation 함수
function validateProductImage(imgInp) {
  // 이미지가 선택되었는지 확인
  if (imgInp.files[0]) {
    return true;
  } else {
    return false;
  }
}