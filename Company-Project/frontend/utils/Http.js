// import { getCookie } from './Cookie';

const parseJSON = (response) => response.json();

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

const buildHeaders = () => {
    return {
        ...defaultHeaders,
    };
};

// const buildHeadersWithCsrf = () => {
//     return {
//         'X-CSRFToken': getCookie('csrftoken'),
//         ...defaultHeaders,
//     }
// }

const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
};

const httpGet = (url) =>
    fetch(url, {
        headers: buildHeaders(),
        credentials: 'same-origin',
    })
        .then(checkStatus)
        .then(parseJSON);

const httpPostWithCsrfToken = (url, data) =>
    fetch(url, {
        method: 'post',
        headers: buildHeadersWithCsrf(),
        body: JSON.stringify(data),
        credentials: 'same-origin',
    })
        .then(checkStatus)
        .then(parseJSON);

const httpPost = (url, data) =>
    fetch(url, {
        method: 'post',
        headers: buildHeaders(),
        body: JSON.stringify(data),
        credentials: 'same-origin',
    })
        .then(checkStatus)
        .then(parseJSON);

export { httpPostWithCsrfToken, httpGet, httpPost };
