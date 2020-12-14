import dynamic from 'next/dynamic';

export default {
    ArticlePage: dynamic(() => import('./ArticlePage')),
    BasePage: dynamic(() => import('./BasePage')),
    HomePage: dynamic(() => import('./HomePage')),
    NotFoundPage: dynamic(() => import('./NotFoundPage')),
    PasswordProtectedPage: dynamic(() => import('./PasswordProtectedPage')),
    PureHtmlPage: dynamic(() => import('./PureHtmlPage')),
};
