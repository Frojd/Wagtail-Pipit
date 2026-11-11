import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Hero from './Hero';
import data from './Hero.data';

const meta = {
    component: Hero,
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithData: Story = { args: data };
