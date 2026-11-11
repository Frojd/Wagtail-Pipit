import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RawHtml from './RawHtml';
import data from './RawHtml.data';

const meta = {
    component: RawHtml,
} satisfies Meta<typeof RawHtml>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithData: Story = { args: data };
