const submitButton = document.querySelector('.btn-save');
const inpsProfile = document.querySelectorAll('#upload-product input');
const imgInp = document.querySelector('#product-img-upload');
const produceName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const purchaseLink = document.querySelector('#purchase-link');

// 프로필 정보 불러오기
const url = "https://api.mandarin.weniv.co.kr",
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTEzYWY5YjJjYjIwNTY2MzQ1M2NiNSIsImV4cCI6MTY5MjQ2MzI3NiwiaWF0IjoxNjg3Mjc5Mjc2fQ.LVM0nvI_mtCKFUK5R58WpWq7oxM-VcP1xfereldLh7Y",
    userID = "ellie"

/////// 
let validItemName = false;
let validItemPrice = false;
let validItemLink = false;
let validImage = false;

inpsProfile.forEach(item => {
    item.addEventListener('change', async () => {
        await validateProfile(item);

        if (validItemName && validItemPrice && validItemLink && validImage) {
            console.log('다 통과했는디');
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    });
});

// 유효성 검사
async function validateProfile(target) {

    // 상품명 validation
    if (target.id === 'product-name') {
        if (!target.validity.tooShort && !target.validity.tooLong) {
            validItemName = true;
        } else {
            document.querySelector('.warning-msg-productname').textContent = '*2~15자 이내여야 합니다.'
            document.querySelector(`.warning-msg-productname`).style.display = 'block'
            validItemName = false;
        }
    }

    // 상품 가격 validation
    if (target.id === 'product-price'){
        validItemPrice = true;
    }

    // 상품 링크 validation
    if (target.id === 'purchase-link') {
        // url 형식
        // if (target.validity.patternMismatch) {
        //     document.querySelector('.warning-msg-purchaselink').textContent = 'URL 형식으로 입력해주세요'
        //     document.querySelector(`.warning-msg-purchaselink`).style.display = 'block'
        //     validItemLink = false;
        // } else {
        //     validItemLink = true;
        // }
        validItemLink = true;
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
    console.log(json);
    // return json;
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
    const formData = new FormData();
    const imageFile = e.target.files[0];
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
});

submitButton.addEventListener('click', async (e) => {
    e.preventDefault()
    await saveProduct(url, token);
    console.log('상품 등록 완료')
})

// async function run(url, token, accountName) {
//     const profileData = await Load_userinfo(url, token, accountName);
//     introUpdate(profileData.profile);
// }

// run(url, token, userID);