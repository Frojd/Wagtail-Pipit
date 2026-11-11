import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HomePage from './HomePage';
import data from './HomePage.data';

const meta = {
    component: HomePage,
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithData: Story = { args: data };
