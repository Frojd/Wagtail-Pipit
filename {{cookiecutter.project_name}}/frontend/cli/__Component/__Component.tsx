import s from './__Component.module.css';

export type __ComponentProps = {
    title?: string;
};

const __Component = ({ title = '__Component' }: __ComponentProps) => {
    return <div className={s.Root}>{title}</div>;
};

export default __Component;
