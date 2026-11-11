import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import __Component from './__Component';
import data from './__Component.data';

const meta = {
    component: __Component,
} satisfies Meta<typeof __Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithData: Story = { args: data };
