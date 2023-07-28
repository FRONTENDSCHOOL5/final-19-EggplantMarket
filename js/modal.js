import {applyTheme} from "./contrast.js"
import { fetchApi } from "./fetch/fetchRefact.js";

const myAccountName = localStorage.getItem("user-accountname")

const openPostModal = document.querySelector(".post-modal-background"),
  openPopUpModal = document.querySelector(".modal-background"),
  displayModal = document.querySelector(".modal-content"),
  performModalActions = openPopUpModal.querySelector(".modal-content .modal-actions");

export function handleModal() {
  const openHeaderOptions = document.querySelector("header .btn-option"),
    openPostOptions = document.querySelectorAll("main .btn-option"),
    openProductOptions = document.querySelectorAll("main .product"),
    openCommentOptions = document.querySelectorAll(".btn-more");

  if (openHeaderOptions) {
    handleHeaderModal(openHeaderOptions);
    focusOnOptionButton(openHeaderOptions);
  }
  if (openPostOptions.length !== 0) {
    handlePostOptionModal(openPostOptions);
  }
  if (openCommentOptions.length !== 0) {
    handleCommentOptionModal(openCommentOptions);
  }
  if (openProductOptions.length !== 0) {
    handleProductOptionModal(openProductOptions, myAccountName);
  }
}

let lastFocusedElement;
// tab으로 focus 이동
function focusOnOptionButton(nodes) {
  nodes.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    } else if (event.key === "Enter") {
      setTimeout(() => displayModal.querySelector(".modal-description").focus());
    }
  });
}

// tab focus
function setFocusOnModalActions() {
  const focusableElements = Array.from(performModalActions.getElementsByTagName("button"));
  modalTab(focusableElements);
  focusableElements[0].focus();
  focusableElements[1].addEventListener("click", () => {
    openPopUpModal.style.visibility = "hidden";
    const cancelButton = displayModal.querySelector(".btn-cancel");
    cancelButton.focus();
  });
}

function changeTheme(inputs) {
  modalTab(inputs); // tab 이동
  for (let i = 0; i < inputs.length; i++) {
    // 테마 변경
    inputs[i].addEventListener("click", function (e) {
      if (!inputs[i].classList.contains("btn-cancel")) {
        inputs[i].click();
        localStorage.setItem("theme", e.target.id);
        applyTheme();
      }
    });
  }
}

// tab으로 이동
function modalTab(inputs){
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
    }
}

// 모달창 기능 - 상단 option 모달창
function handleHeaderModal(node) {
  node.addEventListener("click", () => {
    displayModal.textContent = ""; //displayModal 요소의 내부 내용이 누적되어 초기화하기 위해 사용
    const changeThemeBtn = createModalButton("테마 변경", "btn-theme"),
      logoutBtn = createModalButton("로그아웃", "btn-logout"),
      cancelBtn = createModalButton("취소", "btn-cancel");

    cancelBtn.addEventListener("click", () => {
      openPostModal.style.display = "none";
      node.focus();
    });
    // 테마 변경 클릭 시 새로 생성되는 하단 모달창
    changeThemeBtn.addEventListener("click", () => {
      displayModal.textContent = "";

      const modeSelectContainer = document.createElement("div");
      modeSelectContainer.classList.add("mode_select");

      const lightRadio = createModalRadio("colorSet", "light", "LIGHT", localStorage.getItem("theme") === "light"),
        highContrastRadio = createModalRadio("colorSet", "highContrast", "highContrast", localStorage.getItem("theme") === "highContrast"),
        cancelThemeBtn = createModalButton("취소", "btn-cancel", "theme");

      const inputs = [lightRadio, highContrastRadio, cancelThemeBtn];
      changeTheme(inputs);

      cancelThemeBtn.addEventListener("click", () => {
        openPostModal.style.display = "none";
        node.focus();
      });
      modeSelectContainer.append(lightRadio, highContrastRadio, cancelThemeBtn);
      displayModal.appendChild(modeSelectContainer);
    });
    logoutBtn.addEventListener("click", () => {
      editPopUp(openPopUpModal, "로그아웃하시겠어요?", "로그아웃", logOut);
      openPopUpModal.style.visibility = "visible";
      setFocusOnModalActions();
    });
    displayModal.append(changeThemeBtn, logoutBtn, cancelBtn);
    const inputs = [changeThemeBtn, logoutBtn, cancelBtn];
    modalTab(inputs);
    openPostModal.style.display = "block";
  });
}

// 게시물 option 모달창
export function handlePostOptionModal(nodes) {
  nodes.forEach((item) => {
    item.addEventListener("click", (e) => {
      const targetButton = e.currentTarget,
        targetPostId = targetButton.closest(".home-post").dataset.postid,
        postAccountName = targetButton.parentNode.querySelector("a").href.split("accountName=")[1] || window.location.href.split("accountName=")[1];

      const options = [
        { text: "수정", class: "btn-edit" },
        { text: "삭제", class: "btn-delete" },
        { text: "신고", class: "btn-report" },
        { text: "취소", class: "btn-cancel" },
      ];

      if (myAccountName === postAccountName) {
        options.splice(2, 1); // options에서 '신고하기' 없애기
      } else {
        options.splice(0, 2); // options에서 '수정', '삭제' 없애기
      }
      createOptionModal(options, targetPostId, handlePostOptionClick);
    });
    focusOnOptionButton(item);
  });
}

// 댓글 option 모달창
export function handleCommentOptionModal(nodes) {
  nodes.forEach((item) => {
    item.addEventListener("click", (e) => {
      const targetButton = e.currentTarget,
        targetCommentId = targetButton.dataset.commentid,
        postAccountName = targetButton.parentNode.querySelector("a").href.split("accountName=")[1];

      const pageUrl = new URL(window.location.href);
      const targetPostId = pageUrl.searchParams.get("postId");

      const options = [
        { text: "삭제", class: "btn-delete" },
        { text: "신고", class: "btn-report" },
        { text: "취소", class: "btn-cancel" },
      ];

      if (myAccountName === postAccountName) {
        options.splice(1, 1); // options에서 '신고하기' 없애기
      } else {
        options.splice(0, 1); // options에서 '삭제' 없애기
      }
      createOptionModal(options, targetPostId, handleCommentOptionClick, targetCommentId);
    });
    focusOnOptionButton(item);
  });
}

// 상품 option 모달창
function handleProductOptionModal(nodes, myAccountName) {
  nodes.forEach((item) => {
    item.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.productid,
        accountName = window.location.href.split("accountName=")[1];
      const options = [
        { text: "삭제", class: "btn-product-delete" },
        { text: "수정", class: "btn-product-edit" },
        { text: "웹사이트에서 상품 보기", class: "btn-product-link" },
        { text: "취소", class: "btn-cancel" },
      ];
      if (accountName !== myAccountName) {
        options.splice(0, 2); // options에서 '삭제', '수정' 없애기
      }
      createOptionModal(options, productId, handleProductOptionClick);
    });
    focusOnOptionButton(item);
  });
}

// Option 모달창 생성 및 이벤트 처리
function createOptionModal(options, targetId, clickEvent, commentId) {
  lastFocusedElement = document.activeElement; // 하단 모달을 생성하기 전에 focus인 요소

  displayModal.textContent = "";
  options.forEach((option) => {
    const button = createModalButton(option.text, option.class);
    button.addEventListener("click", () => {
      commentId ? clickEvent(option.text, option.class, targetId, commentId) : clickEvent(option.text, option.class, targetId);
    });
    displayModal.appendChild(button);
  });
  const cancelButton = displayModal.querySelector(".btn-cancel");
  cancelButton.addEventListener("click", () => {
    handleCancelClick(lastFocusedElement);
  });
  displayModal.appendChild(cancelButton);
  const inputs = document.querySelectorAll('[class^="modal-description btn-"]');
  modalTab(inputs);
  openPostModal.style.display = "block";
}

// 취소 버튼 기능
function handleCancelClick(lastFocusedElement) {
  openPostModal.style.display = "none";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

// 하단 모달창 option 생성
function createModalButton(text, className) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("modal-description");
  if (className) {
    button.classList.add(className);
  }
  return button;
}

// 고대비 테마 radio 설정
function createModalRadio(name, id, label, checked) {
  const labelElem = document.createElement("label"),
    inputElem = document.createElement("input");
  inputElem.type = "radio";
  inputElem.name = name;
  inputElem.id = id;
  inputElem.checked = checked;
  inputElem.classList.add("theme");
  labelElem.setAttribute("for", id);
  labelElem.classList.add("modal-description");
  const labelText = document.createElement("span");
  labelText.textContent = label;
  labelElem.append(inputElem, labelText);
  return labelElem;
}

// 게시물 삭제 및 신고 클릭 시
function handlePostOptionClick(optionText, optionClass, postId) {
  if (optionClass === "btn-edit") {
    location.href = `./post_upload.html?postId=${postId}`;
  } else if (optionClass === "btn-delete") {
    deletePopup("게시글", optionText, postId);
  } else if (optionClass === "btn-report") {
    reportPopup("게시글", optionText, postId);
  }
}

// 댓글 삭제 및 신고 클릭 시
function handleCommentOptionClick(optionText, optionClass, postId, commentId) {
  if (optionClass === "btn-delete") {
    deletePopup("댓글", optionText, postId, commentId);
  } else if (optionClass === "btn-report") {
    reportPopup("댓글", optionText, postId, commentId);
  }
}

// 상품 삭제 및 신고 클릭 시
function handleProductOptionClick(optionText, optionClass, productId) {
  if (optionClass === "btn-product-delete") {
    deletePopup("상품", optionText, productId);
  } else if (optionClass === "btn-product-edit") {
    location.href = `./product_upload.html?productId=${productId}`;
  } else if (optionClass === "btn-product-link") {
    location.href = "./404.html";
  }
}

// 삭제 선택 시 popup 생성
function deletePopup(popupCase, optionText, productId, commentId) {
  editPopUp(openPopUpModal, `${popupCase}을 ${optionText}할까요?`, optionText, () => {
    commentId ? deleteItem(popupCase, productId, commentId) : deleteItem(popupCase, productId);
  });
  openPopUpModal.style.visibility = "visible";
  setFocusOnModalActions();
}

// 신고 선택 시 popup 생성
function reportPopup(popupCase, optionText, productId, commentId) {
  editPopUp(openPopUpModal, `${popupCase}을 ${optionText}할까요?`, optionText, () => {
    commentId ? reportItem(productId) : reportItem(productId, commentId);
  });
  openPopUpModal.style.visibility = "visible";
  setFocusOnModalActions();
}

// 화면에 뜨는 팝업
function editPopUp(parent, description, buttonText, action) {
  parent.querySelector(".modal-description").textContent = description;
  parent.querySelector(".right-button").textContent = buttonText;
  const rightButton = parent.querySelector(".right-button");
  const clickHandler = async () => {
    await action();
    openPostModal.style.display = "none";
    openPopUpModal.style.visibility = "hidden";
    rightButton.removeEventListener("click", clickHandler);
  };
  rightButton.addEventListener("click", clickHandler);
}

// 로그아웃 시 localStorage 내용 삭제
function logOut() {
  localStorage.removeItem("user-token");
  localStorage.removeItem("user-accountname");
  location.href = "./login.html";
}

// 하단에 띄어진 모달이 아닌 배경을 클릭하면 모달창 닫기
openPostModal.addEventListener("click", (event) => {
  const targetElement = event.target;
  if (targetElement.classList.contains("post-modal-background")) {
    openPostModal.style.display = "none";
  }
});

// 팝업으로 띄어진 모달이 아닌 배경을 클릭하면 모달창 닫기
openPopUpModal.addEventListener("click", (event) => {
  const targetElement = event.target;
  if (targetElement.classList.contains("modal-background") || targetElement.classList.contains("left-button")) {
    openPopUpModal.style.visibility = "hidden";
  }
});

// ============== API 함수들 ==========
// 삭제 api
async function deleteItem(targetType, targetId, targetCommentId) {
  const reqPath = targetCommentId
    ? `/post/${targetId}/comments/${targetCommentId}`
    : targetType !== "상품"
    ? `/post/${targetId}`
    : `/product/${targetId}`; // 순서대로 댓글 주소, 게시글 주소, 상품 주소

  await fetchApi(reqPath,"DELETE",null,false)
  if (targetType === "게시글" && window.location.href.includes("detail")) {
    // 게시글이면서 detail을 포함한 것을 삭제했을 경우 전화면으로 이동하면서 새로 로딩
    location.href = document.referrer;
  } else {
    // 그 외의 경우에는 위치한 페이지에서 바로 reload()
    location.reload();
  }
}

// 신고 api
async function reportItem(targetId, targetCommentId) {
  const reqPath = targetCommentId ? `/post/${targetId}/comments/${targetCommentId}/report` : `/post/${targetId}/report`;
  await fetchApi(reqPath,"POST",null,false)
}

handleModal(); // 모달 실행
