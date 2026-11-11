import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import __Container from './__Container';
import data from './__Container.data';

const meta = {
    component: __Container,
} satisfies Meta<typeof __Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithData: Story = { args: data };
