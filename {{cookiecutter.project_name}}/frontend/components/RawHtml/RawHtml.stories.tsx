import React from 'react';
import type { Meta } from '@storybook/nextjs-vite';
import RawHtml from './RawHtml';

import data from './RawHtml.data';

export default { component: RawHtml } satisfies Meta<typeof RawHtml>;

export const RawHtmlWithoutData = () => <RawHtml />;
export const RawHtmlWithData = () => <RawHtml {...data} />;
