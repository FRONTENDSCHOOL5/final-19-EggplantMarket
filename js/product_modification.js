import { validateProductName, validateProductPrice, validatePurchaseLink, validateProductImage, } from "./validation.js";

const submitButton = document.querySelector(".btn-save");
const inpsProduct = document.querySelectorAll("#upload-product input");
const imgInp = document.querySelector("#product-img-upload");
const imageInput = document.querySelector(".product-img");
const productName = document.querySelector("#product-name");
const productPrice = document.querySelector("#product-price");
const purchaseLink = document.querySelector("#purchase-link");
const warningMsgProductName = document.querySelector(".warning-msg-productname");
const warningMsgProductPrice = document.querySelector(".warning-msg-productprice");
const warningMsgPurchaseLink = document.querySelector(".warning-msg-purchaselink");

const url = "https://api.mandarin.weniv.co.kr",
  token = localStorage.getItem("user-token");

////////

document.addEventListener("DOMContentLoaded", function () {
  const btnUpload = document.querySelector(".btn-upload");
  const productImgUpload = document.getElementById("product-img-upload");

  btnUpload.addEventListener("keydown", function (event) {
      if (event.key === "Tab" && !event.shiftKey) {
          event.preventDefault();
          productImgUpload.focus();
      }
  });
});

let validItemName = false;
let validItemPrice = false;
let validItemLink = false;
let validImage = false;

inpsProduct.forEach((item) => {
  item.addEventListener("change", async () => {
    if (
      item === productName || item === productPrice || item === purchaseLink
    ) {
      item.value = item.value.trim();
    }
    await validateProduct(item);

    // if (productName.value === "" || productName.value.length === 1) {
    //   submitButton.disabled = true;
    // } else {
      if (validItemName || validItemPrice || validItemLink || validImage) {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      // }
    }
  });
});

async function validateProduct(target) {
  // 상품명 validation
  if (target === productName) {
    validItemName = validateProductName(productName, warningMsgProductName);
  }

  // 상품 가격 validation
  if (target === productPrice) {
    validItemPrice = validateProductPrice(productPrice, warningMsgProductPrice);
  }

  // 상품 링크 validation
  if (target === purchaseLink) {
    validItemLink = validatePurchaseLink(purchaseLink, warningMsgPurchaseLink);
  }

  // 상품 이미지 validation
  if (target === imgInp) {
    validImage = validateProductImage(imgInp);
  }
}

// productID가 있는 경우 그 외에는 겹침
async function saveProduct(url, token, productID) {
  const reqPath = "/product/";

  // 가격
  const price = parseInt(productPrice.value);
  // 이미지 넣기
  const fileName = await postImg();
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

  // 다른 부분
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
    const res = await fetch(url + reqPath + productID, {
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
    // 저장이 되지만 put에서 404 에러가 발생한다....
  }
}

async function postImg() {
  const file = imgInp.files[0];
  const formData = new FormData();
  const reqPath = "/image/uploadfile";
  if (file) {
    formData.append("image",file);
    const res = await fetch(url + reqPath, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    return json.filename;
  }
}

imgInp.addEventListener("change", async (e) => {
  const imageFile = e.target.files[0];
  if (checkImageExtension(imageFile)) {
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await fetch( url + "/image/uploadfile",
      {
        method: "POST",
        body: formData,
      }
    );
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

// 조금 다름
submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  await saveProduct(url, token, productID);
  location.href = `./profile_info.html?accountName=${localStorage.getItem(
    "user-accountname"
  )}`;
});

// postID가 있는 경우 false
submitButton.disabled = false;

async function Load_product(url, token, productID) {
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

function productUpdate(productData) {
  // 프로필 이미지 보여주기
  const imageSrc = productData.itemImage;
  if (imageSrc) {
    imageInput.src = imageSrc;
    imageInput.style.backgroundImage = `url('${checkImageUrl( imageSrc, "post" )}')`;
    imageInput.style.backgroundSize = "cover";
    imageInput.style.backgroundPosition = "center";
    imageInput.style.backgroundRepeat = "no-repeat";
  }
  productName.value = productData.itemName;
  productPrice.value = productData.price;
  purchaseLink.value = productData.link;
}

async function run(url, token, productID) {
  const productData = await Load_product(url, token, productID);
  productUpdate(productData.product);
}

run(url, token, productID);
