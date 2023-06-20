const uploadButton = document.querySelector('#upload-btn');
const imglist = document.querySelector('.upload-imgs-list');
const contentInp = document.querySelector('textarea');
const imgInp = document.querySelector('#input-file');

// ---- start of 버튼 활성화 ----

let validContent = false;
let validImg = false;

// 텍스트 입력
contentInp.addEventListener('change', () => {
    // 텍스트 입력되면 valid
    if (contentInp.value !== '') {
        validContent = true;
    } else {
        validContent = false;
    }
});

// 이미지 입력
(function () {
    imgInp.addEventListener('change', (e) => readURL(e.target));

    function readURL(input) {
        // 이미지 하나씩 여러개 추가할 수 있는 상태, 3개 한정은 아직 구현하지 않음
        if (input.files && input.files[0]) {

            // 이미지 입력되면 valid
            validImg = true;

            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                const li = document.createElement('li');
                li.innerHTML = `<div class="img-cover">
                <img src=${e.target.result} alt="이미지 미리보기">
                <button class="btn-remove"></button>
            </div>`;
                imglist.append(li);
            });
            reader.readAsDataURL(input.files[0]);
        }
    }
})()

// 이미지 삭제
imglist.addEventListener('click', (e) => {
    e.preventDefault();
    // 이벤트 위임
    if (e.target.className === 'btn-remove') {
        e.target.closest('li').remove();

        if (imglist.children.length === 0) {
            // 이미지 추가한 거 다 삭제하면 invalid
            validImg = false;
            isValid()
        }
    }
})

// 이벤트 리스너 차례로 동작함
imgInp.addEventListener('change', isValid);
contentInp.addEventListener('change', isValid);

function isValid() {
    // console.log('contentInp : ', validContent, 'validImg : ', validImg);
    if (validImg || validContent) {
        // console.log('둘중하나는 입력됨');
        uploadButton.disabled = false;
    } else {
        // console.log('둘 다 입력안됨');
        uploadButton.disabled = true;
    }
}

// ---- end of 버튼 활성화 ----