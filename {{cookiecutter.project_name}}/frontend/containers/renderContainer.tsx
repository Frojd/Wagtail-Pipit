import type { ComponentType } from 'react';
import LazyContainers from './LazyContainers';
import type { ContainerName, ContainerProps } from './LazyContainers';

const containers: {
    [N in ContainerName]: ComponentType<ContainerProps<N>>;
} = LazyContainers;

export const isContainerName = (name: string): name is ContainerName =>
    Object.hasOwn(LazyContainers, name);

// TypeScript rejects a JSX spread of an indexed access props type, a plain type parameter passes
const renderComponent = <P extends object>(
    Component: ComponentType<P>,
    props: P
) => <Component {...props} />;

export const renderContainer = <N extends ContainerName>(
    name: N,
    props: ContainerProps<N>
) => renderComponent<ContainerProps<N>>(containers[name], props);
