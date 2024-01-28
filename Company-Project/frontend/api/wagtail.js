import querystring from 'querystring';
import {
    keysToCamelFromSnake,
    keysToSnakeFromCamel,
} from '../utils/caseconverters';

const API_URL = process.env.WAGTAIL_API_URL;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL;

export async function getPage(path, params, options) {
    params = params || {};
    params = {
        htmlPath: path,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/page_by_path/`, params, options);
}

export async function getPasswordProtectedPage(
    restrictionId,
    pageId,
    params,
    options
) {
    params = params || {};
    return await postRequest(
        `${NEXT_PUBLIC_API_URL}/v1/password_protected_page/${restrictionId}/${pageId}/`,
        params,
        options
    );
}

export async function getAllPages() {
    return await getRequest(`${API_URL}/v1/page_relative_urls/`);
}

export async function getPagePreview(contentType, token, params, options) {
    params = params || {};
    params = {
        contentType,
        token,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/page_preview/`, params, options);
}

export async function getPublicViewData(slug, params, options) {
    return await getRequest(
        `${NEXT_PUBLIC_API_URL}/v1/external_view_data/${slug}/`,
        params,
        options
    );
}

export async function getViewData(slug, params, options) {
    return await getRequest(
        `${API_URL}/v1/external_view_data/${slug}/`,
        params,
        options
    );
}

export async function getRedirect(path, params, options) {
    params = params || {};
    params = {
        htmlPath: path,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/redirect_by_path/`, params, options);
}

export async function getRequest(url, params, options) {
    params = params || {};
    params = keysToSnakeFromCamel(params);

    let headers = options?.headers || {};
    headers = {
        'Content-Type': 'application/json',
        ...headers,
    };
    const queryString = querystring.stringify(params);

    let fetchOptions = { headers };

    if (options?.cache) {
        fetchOptions = {
            ...fetchOptions,
            cache: options.cache,
        };
    }

    if (options?.revalidate) {
        fetchOptions = {
            ...fetchOptions,
            next: {
                revalidate: options.revalidate,
            },
        };
    }
    const res = await fetch(`${url}?${queryString}`, fetchOptions);

    if (res.status < 200 || res.status >= 300) {
        const error = new WagtailApiResponseError(res, url, params);
        error.response = res;
        throw error;
    }

    const json = await res.json();
    return {
        headers: res.headers,
        json: keysToCamelFromSnake(json),
    };
}

export async function postRequest(url, params, options) {
    params = params || {};
    params = keysToSnakeFromCamel(params);

    let headers = options?.headers || {};
    headers = {
        'Content-Type': 'application/json',
        ...headers,
    };
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers,
    });

    if (res.status < 200 || res.status >= 300) {
        const error = new WagtailApiResponseError(res, url, params);
        error.response = res;
        throw error;
    }

    const json = await res.json();
    return {
        headers: res.headers,
        json: keysToCamelFromSnake(json),
    };
}

export class WagtailApiResponseError extends Error {
    constructor(res, url, params) {
        super(
            `${res.statusText}. Url: ${url}. Params: ${JSON.stringify(params)}`
        );
        this.name = 'WagtailApiResponseError';
    }
}
