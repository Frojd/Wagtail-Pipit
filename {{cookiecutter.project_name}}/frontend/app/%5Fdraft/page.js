import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import CatchAllPage from '../page';

export default async function DraftPage(props) {
    const { isEnabled } = await draftMode();

    if (!isEnabled) {
        return notFound();
    }

    return <CatchAllPage {...props} />;
}
