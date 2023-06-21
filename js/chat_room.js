// 채팅 입력 시 전송 버튼 활성화
const commentInput = document.getElementById('commemt-input');
const submitButton = document.querySelector('.btn-comment');

commentInput.addEventListener('input', function () {
    if (commentInput.value.trim() !== '') {
         submitButton.disabled = false;	
         submitButton.style.color = '#477958';
    } else {
         submitButton.disabled = true;	
         submitButton.style.color = '';
    }
});

// 모달창
const btnOption = document.querySelector('.btn-option');
const postModal = document.querySelector('.post-modal-background');

// option 버튼 클릭 시 모달창 나타나기
btnOption.addEventListener('click', () => {
  postModal.style.display = 'block';
});

// 띄어진 모달이 아닌 배경을 클릭하면 모달창 닫기
  postModal.addEventListener('click', (event) => {
    const targetElement = event.target;
  
    if (targetElement.classList.contains('post-modal-background')) {
      postModal.style.display = 'none';
    }
  });