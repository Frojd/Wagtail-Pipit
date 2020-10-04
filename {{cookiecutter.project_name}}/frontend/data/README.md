# About the data-modules

These files are intended to ease the data-scaffolding for frontend components and make sure that
what is mapped in the frontend tests is structures that looks the same way as they would be exported
from the wagtail API. If an API change, (for example the Custom Image Serializer) we can reflect the change
in these factories and the frontend test suite will fail for all modules not compatible with the change.

## Usage

We cold get a generic structure of an object by simply importing it from the file:

```js
import imageStructure from './image';
```

This would give us representation of an image.

Each file _should_ also contains a factory which can be used to override the fields you care about. Kind of like
how factory-boy works:

```js
import { factory as imageFactory } from './image';

const imageStructure = imageFactory({
    url: 'https://place-hold.it/300x500',
    width: 300,
    height: 500,
});
```

the imageStructure will still have fields except the overriden ones. like ´alt´ and so on.

### Example "Component/ImageGallery.data.js"

The below code will give you a list of images in various dimensions

```js
import {factory as imageFactory} from '../../data/image'

export default {
    title: "Whatever..."
    images: [[100, 200], [200, 300], [300, 200]].map(x => imageFactory({url: `https://place-hold.it/${x[0]}x${x[1]}`, width: x[0], height: x[1]}))
}
```
