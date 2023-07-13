// 상품명 validation
export function validateProductName(productName, warningMsgProductName) {
  if (!productName.validity.tooShort && !productName.validity.tooLong) {
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

// 상품 가격 validation
export function validateProductPrice(productPrice, warningMsgProductPrice) {
  if (
    !productPrice.validity.rangeUnderflow &&
    !productPrice.validity.rangeOverflow
  ) {
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

// 상품 링크 validation
export function validatePurchaseLink(purchaseLink, warningMsgPurchaseLink) {
  const urlPattern =
    /^(https?:\/\/)?(www\.)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
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

// 상품 이미지 validation
export function validateProductImage(imgInp) {
  // 이미지가 선택되었는지 확인
  if (imgInp.files[0]) {
    return true;
  } else {
    return false;
  }
}
