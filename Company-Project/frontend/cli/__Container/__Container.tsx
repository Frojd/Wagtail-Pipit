import { basePageWrap } from '__CONTAINERS__/BasePage';
import s from './__Container.module.css';

export type __ContainerProps = {
    title?: string;
};

const __Container = ({ title = '__Container' }: __ContainerProps) => {
    return <div className={s.Root}>{title}</div>;
};

export default basePageWrap(__Container);
