import querystring from 'querystring';
import type { BasePageProps } from '../containers/BasePage';
import type {
    ContainerName,
    ContainerProps,
} from '../containers/LazyContainers';
import {
    keysToCamelFromSnake,
    keysToSnakeFromCamel,
} from '../utils/caseconverters';
import type { KeyConvertible } from '../utils/caseconverters';

const API_URL = process.env.WAGTAIL_API_URL;
// Relative to the browser origin, for requests made from client components
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL;

export type ApiResponse<T> = { headers: Headers; json: T };

export type RequestHeaders = Record<string, string | null>;

export type RequestOptions = {
    headers?: RequestHeaders;
    cache?: RequestCache;
    revalidate?: number;
};

export type QueryParams = Record<
    string,
    string | string[] | number | boolean | null | undefined
>;

export type Redirect = {
    destination: string;
    isPermanent: boolean;
};

export type PageProps = ContainerProps<ContainerName> &
    Pick<BasePageProps, 'seo'>;

export type PageData = {
    componentName: string;
    componentProps: PageProps;
    redirect?: undefined;
};

export type RedirectData = {
    redirect: Redirect;
    componentName?: undefined;
    componentProps?: undefined;
};

export type PageOrRedirectData = PageData | RedirectData;

export type RedirectByPathData = Redirect & {
    oldPath: string;
};

export type PageRelativeUrlsData = {
    meta: { totalCount: number };
    items: { title: string; relativeUrl?: string }[];
};

function withoutNullHeaders(headers: RequestHeaders): Record<string, string> {
    const present: Record<string, string> = {};
    for (const [name, value] of Object.entries(headers)) {
        if (value !== null) {
            present[name] = value;
        }
    }
    return present;
}

export async function getPage(
    path: string,
    params?: QueryParams,
    options?: RequestOptions
): Promise<ApiResponse<PageOrRedirectData>> {
    params = params || {};
    params = {
        htmlPath: path,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/page_by_path/`, params, options);
}

export async function getPasswordProtectedPage(
    restrictionId: number,
    pageId: number,
    params?: KeyConvertible,
    options?: RequestOptions
): Promise<ApiResponse<null>> {
    params = params || {};
    return await postRequest<null>(
        `${NEXT_PUBLIC_API_URL}/v1/password_protected_page/${restrictionId}/${pageId}/`,
        params,
        options
    );
}

export async function getCsrfToken(): Promise<string> {
    const { json } = await getRequest<{ csrfToken: string }>(
        `${NEXT_PUBLIC_API_URL}/v1/csrf_token/`
    );
    return json.csrfToken;
}

export async function getAllPages(): Promise<
    ApiResponse<PageRelativeUrlsData>
> {
    return await getRequest(`${API_URL}/v1/page_relative_urls/`);
}

export async function validatePreviewToken(
    contentType: string,
    token: string,
    options?: RequestOptions
): Promise<ApiResponse<{ valid: true }>> {
    const params = {
        contentType,
        token,
    };

    return await getRequest(
        `${API_URL}/v1/validate_preview_token/`,
        params,
        options
    );
}

export async function getPagePreview(
    contentType: string | string[],
    token: string | string[],
    params?: QueryParams,
    options?: RequestOptions
): Promise<ApiResponse<PageData>> {
    params = params || {};
    params = {
        contentType,
        token,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/page_preview/`, params, options);
}

export async function getPublicViewData(
    slug: string,
    params?: QueryParams,
    options?: RequestOptions
): Promise<ApiResponse<PageOrRedirectData>> {
    return await getRequest(
        `${NEXT_PUBLIC_API_URL}/v1/external_view_data/${slug}/`,
        params,
        options
    );
}

export async function getViewData(
    slug: string,
    params?: QueryParams,
    options?: RequestOptions
): Promise<ApiResponse<PageOrRedirectData>> {
    return await getRequest(
        `${API_URL}/v1/external_view_data/${slug}/`,
        params,
        options
    );
}

export async function getRedirect(
    path: string,
    params?: QueryParams,
    options?: RequestOptions
): Promise<ApiResponse<RedirectByPathData>> {
    params = params || {};
    params = {
        htmlPath: path,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/redirect_by_path/`, params, options);
}

export async function getRequest<T>(
    url: string,
    params?: QueryParams,
    options?: RequestOptions
): Promise<ApiResponse<T>> {
    params = params || {};
    params = keysToSnakeFromCamel(params) as QueryParams;

    let headers = withoutNullHeaders(options?.headers || {});
    headers = {
        'Content-Type': 'application/json',
        ...headers,
    };
    const queryString = querystring.stringify(params);

    let fetchOptions: RequestInit = { headers };

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
        throw error;
    }

    const json: KeyConvertible = await res.json();
    return {
        headers: res.headers,
        json: keysToCamelFromSnake(json) as T,
    };
}

export async function postRequest<T>(
    url: string,
    params?: KeyConvertible,
    options?: RequestOptions
): Promise<ApiResponse<T | null>> {
    params = params || {};
    params = keysToSnakeFromCamel(params);

    let headers = withoutNullHeaders(options?.headers || {});
    headers = {
        'Content-Type': 'application/json',
        ...headers,
    };
    if (!headers['X-CSRFToken']) {
        headers['X-CSRFToken'] = await getCsrfToken();
    }
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers,
    });

    if (res.status < 200 || res.status >= 300) {
        const error = new WagtailApiResponseError(res, url, params);
        throw error;
    }

    if (res.status === 204) {
        return { headers: res.headers, json: null };
    }

    const json: KeyConvertible = await res.json();
    return {
        headers: res.headers,
        json: keysToCamelFromSnake(json) as T,
    };
}

export class WagtailApiResponseError extends Error {
    readonly response: Response;

    constructor(res: Response, url: string, params: KeyConvertible) {
        super(
            `${res.statusText}. Url: ${url}. Params: ${JSON.stringify(params)}`
        );
        this.name = 'WagtailApiResponseError';
        this.response = res;
    }
}
