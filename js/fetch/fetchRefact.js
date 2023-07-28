const url = "https://api.mandarin.weniv.co.kr",
    token = localStorage.getItem('user-token');

async function fetchApi(reqPath, method, bodyData, toJson=true, needToken=true){
    try{
        const option = {
            method: method,
            headers: {
                "Content-type": "application/json"
            }
        };
        if (needToken) option.headers.Authorization = `Bearer ${token}`;
        if (bodyData) option.body = JSON.stringify(bodyData);

        const res = await fetch(url+reqPath,option)
        if(!toJson) return;

        return (await res.json())
    } catch (err) {
        // location.href = './404.html'
    }
}

function fetchClosure(reqpath, cnt){
    let reqCnt = 0;
    const getData = async () => {
       return fetchApi(reqpath + `?limit=${cnt}&skip=${reqCnt++ * cnt}`, "GET");
    }
    return getData
}

async function PostImage(item){
    const formData = new FormData();
    formData.append("image", item);
    
    const res = await fetch(url + "/image/uploadfile", {
        method: "POST",
        body: formData
    });

    const json = await res.json();
    return json.filename;
}

export {fetchApi, fetchClosure, PostImage};