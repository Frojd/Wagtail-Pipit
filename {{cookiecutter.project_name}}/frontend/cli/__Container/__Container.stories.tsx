import type { Meta } from '@storybook/nextjs-vite';
import __Container from './__Container';
import data from './__Container.data';

export default {
    component: __Container,
} satisfies Meta<typeof __Container>;

export const __ContainerWithData = () => <__Container {...data} />;
export const __ContainerWithoutData = () => <__Container />;
