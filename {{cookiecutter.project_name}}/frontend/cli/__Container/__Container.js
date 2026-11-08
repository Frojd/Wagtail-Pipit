import { basePageWrap } from '__CONTAINERS__/BasePage';
import s from './__Container.module.css';

const __Container = () => {
    return <div className={s.Root}>__Container</div>;
};

export default basePageWrap(__Container);
