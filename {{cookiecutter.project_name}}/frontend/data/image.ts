import { factory as renditionFactory } from './rendition';
import { factoryGenerator } from './factory';

const baseStructure = {
    title: 'Testimage',
    url: 'https://placeimg.com/2480/1653/arch',
    width: 2480,
    height: 1653,
    renditions: {
        small: renditionFactory({
            src: 'https://placeimg.com/300/200/arch',
            width: 300,
            height: 200,
            alt: 'Testimage small',
        }),
        medium: renditionFactory({
            src: 'https://placeimg.com/600/400/arch',
            width: 600,
            height: 400,
            alt: 'Testimage medium',
        }),
        large: renditionFactory({
            src: 'https://placeimg.com/1200/800/arch',
            width: 1200,
            height: 800,
            alt: 'Testimage large',
        }),
        xlarge: renditionFactory({
            src: 'https://placeimg.com/1646/1098/arch',
            width: 1646,
            height: 1098,
            alt: 'Testimage xlarge',
        }),
    },
    file_size: 993763,
    focal: {
        x: '50.00%',
        y: '50.00%',
    },
    caption: 'Photo: John Doe/mediabank.test',
};

export const factory = factoryGenerator('Image', baseStructure);

export default baseStructure;
