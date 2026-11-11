import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NotFoundPage from './NotFoundPage';
import data from './NotFoundPage.data';

const meta = {
    component: NotFoundPage,
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithData: Story = { args: data };
