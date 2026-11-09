import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import CatchAllPage from '../../routing/catchAll';
import type { CatchAllProps } from '../../routing/catchAll';

export { generateMetadata } from '../../routing/catchAll';

export default async function DraftPage(props: CatchAllProps) {
    const { isEnabled } = await draftMode();

    if (!isEnabled) {
        return notFound();
    }

    return <CatchAllPage {...props} />;
}
