import { factoryGenerator } from './factory';

const baseStructure = {
    src: 'https://placeimg.com/2480/1653/arch',
    width: 1200,
    height: 700,
    alt: 'Testbild',
};

export const factory = factoryGenerator('Rendition', baseStructure);

export default baseStructure;
