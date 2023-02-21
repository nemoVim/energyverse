export async function getReq(fetch, path) {
    const res = await fetch(path);

    return await checkRes(res);
}

export async function postReq(fetch, path, data) {
    const res = await fetch(path, {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
    });
    return await checkRes(res);
}

export async function putReq(fetch, path, data) {
    const res = await fetch(path, {
        method: 'put',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await checkRes(res);
}

async function checkRes(res) {
    const resData = await res.json();
    if (resData.status === 200) {
        return resData.msg;
    } else {
        throw new Error(resData.msg);
    }
}

export function createRes(status, msg) {
    const res = new Response(JSON.stringify({
        status: status,
        msg: msg,
    }));
    return res;
}
