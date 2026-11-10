import type { ComponentProps } from 'react';
import dynamic from 'next/dynamic';

const LazyContainers = {
    ArticlePage: dynamic(() => import('./ArticlePage')),
    BasePage: dynamic(() => import('./BasePage')),
    HomePage: dynamic(() => import('./HomePage')),
    NotFoundPage: dynamic(() => import('./NotFoundPage')),
    PasswordProtectedPage: dynamic(() => import('./PasswordProtectedPage')),
    PureHtmlPage: dynamic(() => import('./PureHtmlPage')),
};

export default LazyContainers;

type Registry = typeof LazyContainers;

export type ContainerName = keyof Registry;

type PropsByContainer = {
    [N in ContainerName]: ComponentProps<Registry[N]>;
};

export type ContainerProps<N extends ContainerName> = PropsByContainer[N];
