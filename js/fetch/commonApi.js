const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem('user-token');

const API = async function (method, reqUrl, bodyData) {
    try {
        const reqOption = {
            method: method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json',
            },
        }

        if(bodyData){
            reqOption.body = JSON.stringify(bodyData)
        }
        
        const res = await fetch(url + reqUrl, reqOption);
        return res.json();
    } catch (err) {
        location.href='./404.html'
    }
}

const POST_API_NO_TOKEN = async (reqUrl, bodyData) => {
    const res = await fetch(url + reqUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });
    const json = await res.json();
    return json;
};

const POST_API_IMAGE = async (formData) => {
    const res = await fetch(url + "/image/uploadfile", {
        method: "POST",
        body: formData
    });

    const json = await res.json();
    return json.filename;
}

// 무한스크롤에 쓰일 클로저 api