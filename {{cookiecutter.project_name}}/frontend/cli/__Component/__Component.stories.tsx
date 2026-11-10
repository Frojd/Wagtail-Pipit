import type { Meta } from '@storybook/nextjs-vite';
import __Component from './__Component';
import data from './__Component.data';

export default {
    component: __Component,
} satisfies Meta<typeof __Component>;

export const __ComponentWithData = () => <__Component {...data} />;
export const __ComponentWithoutData = () => <__Component />;
