# Frontend developer guide

Throughout this tutorial, we’ll walk you through the creation of a basic `Container`

A `Container` is a collection of multiple _Components_ and is usually where your React state lives. 
In a Wagtail context, you can think of it as the visual representation of your Page-model, but
you could also use them to build a form or some other module if you find it suitable.

It consists of three parts:

- [Getting started](#getting-started)
- [Building the required components](#building-your-first-component)
- [Building your container](#building-your-first-container)

This document also provides info regarding the following topics:
- [Customizing the scaffolder](#customizing-the-scaffolder) 
- [Command reference](#command-reference) 
- [General recommendations](#general-recommendations)


## Getting started

The whole frontend of the project is located in `/frontend/`. Here is an overview of 
the contents (Some files omitted for brevity):
```bash
.
├── app     # The source root folder of your frontend app
│__ ├── assets      # Contains all statical assets, such as fonts, images, etc.
│__ ├── components  # Contains all Components
│__ ├── containers  # Contains all Containers
│__ ├── i18n        # Contains internationalization strings and module for handeling those
│__ ├── index.js    # Entry point for your frontend application
│__ ├── main.js     # What will be exposed to client via webpack, exposing React and your frontend app
│__ ├── styles      # Global styling (h1, h2, resets, etc)
│__ └── utils       # Where you should place your utility functions
├── bin         # Root folder for scripts called in npm
└── internals   # Contains templates for scaffolding and code for the dev-server
```

To get up and running we first need to install the npm dependencies from the frontend directory:
```bash
cd frontend     # if not there already
npm i
```

Next, we start the frontend dev-server:
```bash
npm start
```

From here, start your preferred browser and navigate to `http://localhost:7000`.  You should see a list of all
components and containers that exist in the application. If not, look in your terminal the window for any
webpack errors and try to resolve those.

You can run any component or container in your browser by clicking on it.
If you do any change in your code the browser will automatically refresh and display your changes. 


## Building your first `Component`

For this tutorial, we are going to build a very basic article page and add a button which will give us the
article word count.

The boilerplate already provides a `RawHtml` component for rendering RichText content, but we will also need to 
add a `Button` component.

Start by scaffolding a component using the CLI:
```bash
npm run new Button
```

This will create the following files:
```
./app/components/Button/Button.data.js
./app/components/Button/Button.scss
./app/components/Button/index.js
./app/components/Button/Buttons.stories.js
./app/components/Button/Button.js
./app/components/Button/Button.test.js
```

#### Button.data.js
Exporting a JS-object representing the `props` the component will use in the dev-server,
which will be passed down from higher order components/containers in the actual app

#### Button.scss
The stylesheet for the component. We encouraged that all styling in this file has no reference outside of the
`.Button` context, according to [BEM Methodology](https://en.bem.info/methodology/quick-start/)

#### index.js
Decides what the module exports. It defaults to the component `Button` and you can almost always ignore this file.

#### Buttons.stories.js
Declares the stories for the [Storybook integration](https://storybook.js.org/). You can ignore this for now.

#### Button.js
The javascript code for the react component.

#### Button.test.js
Tests for the component. It will run when you run "npm run test"


### Writing the javascript/jsx

Let’s start coding the javascript, modify the `Button.js` so that it looks like this:
```js
import React from 'react';
import './Button.scss';

const Button = ({onClick, text}) => (
    <button className="Button" onClick={onClick}>
        {text}
    </button>
);

Button.propTypes = {};

Button.defaultProps = {};

export default Button;
```

This allows us to render a Button which accepts the props `onClick` and `text`. In a real-life scenario,
you would also want to specify [`propTypes`](https://reactjs.org/docs/typechecking-with-proptypes.html) and
[`defaultProps`](https://reactjs.org/docs/typechecking-with-proptypes.html#default-prop-values) but that is 
outside the scope for this tutorial.

### Providing data for the dev-server

We need to provide the props `text` and `onClick` to our component to be able to work with it in the dev server.
Add the following to `Button.data.js`:
```
export default {
    'text': 'Button text',
    'onClick': function() {console.log('clicked');}
};
```

Now if you look at the component in the browser on [http://localhost:7000/Button](http://localhost:7000/Button) you
should see the text "Button text" and if you click it you should see "clicked" in the browser console.  *Note:* You
need to refresh the browser.

To be able to mock the props like this is very handy since you can develop the whole frontend without
the actual Wagtail implementation in place. It helps you to test the frontend in an isolated context and in a team
setting you can have different members of your team working on the frontend and backend without blocking each other.

### Add styling

To style the component, we simply add some scss-rules to `Button.scss`:

```scss
@import 'Styles/includes.scss';

.Button {
    background: #ff4040;
    color: white;
    border: none;
    padding: 10px 15px;
}
```

We recommend that all styling in this file have no reference outside of the `.Button` context, 
since we follow the [BEM Methodology](https://en.bem.info/methodology/quick-start/).

In a real-life scenario, you would probably want to add your colors to `./app/styles/variables.scss` and use them
in your stylesheet rather than using hex-colors. But you can work however you like and this boilerplate does not
enforce anything.


## Building your first `Container`

Now we have the components we need for building our container. We will call this container _WordCountPage_.  If we were
building a backend for this as well, it would be represented by a Wagtail-model with the same name. 

The received props this container will handle will be a camelCased version of that model's serialization,
read more about models and serialization in our [Backend Developer Guide](./backend-developer-guide.md)

From a React-point of view, a container is the same thing as a component.  We keep them separated only to make our
code nice and tidy.  From our point of view a container differs from a component in the following ways:
- The container handles the state and pass it down to its components
- The container is responsible for the layout of the components it uses, the component styling should not affect the component's placement
- The container handles javascript bindings and pass it down to its components. i.e. a click handler should be defined in the container and be passed down via props


To build our container, launch the scaffolder again, this time using the flag `-c` for `Container`
```bash
npm run new WordCountPage -- -c
```
Now you should see your newly created container in `./app/containers/WordCountPage`

### Building the container javascript/jsx

We now need to import our components and place them in our container:

```js
import React, { PureComponent } from 'react';
import { basePageWrap } from '../BasePage';
import './WordCountPage.scss';

import i18n from '../../i18n';

import Button from 'Components/Button';
import RawHtml from 'Components/RawHtml';

class WordCountPage extends PureComponent {
    state = {};

    static defaultProps = {};

    static propTypes = {};

    handleWordCountClick = () => {
        const quickAndDirtyWordCount = this.props.richtext.replace(/<[^>]+>/g, ' ')
            .split(' ').filter(x => x).length;

        alert(`This article contains ${quickAndDirtyWordCount} words`);
    }

    render() {
        const {richtext} = this.props;
        return (
            <div className="WordCountPage">
                <div className="WordCountPage__Section WordCountPage__Section--body">
                    <RawHtml html={richtext} />
                </div>
                <div className="WordCountPage__Section WordCountPage__Section--button">
                    <Button text={i18n.t('wordcountpage.buttonText')} onClick={this.handleWordCountClick} />
                </div>
            </div>
        );
    }
}

export default basePageWrap(WordCountPage);
```

First we import our components, note that we have aliases for the components folder,
so you can import `Components/ComponentName` instead of `../Components/ComponentName`. This works no matter where
you try to import the component.

Now we declare a click-handler for our button `handleWordCountClick`, note that we use fat-arrow (`=>`) functions here
to make sure that the `this` keyword refers to the `WordCountPage` instance inside of that function scope.  In this
particular case, we just do a very quick and dirty wordcount of the component prop "richtext" which will be provided
by Wagtail (from `WordCountPage.data.js` in the dev-server).

In the render-function, we simply wrap our components in div-elements because we want to put some margins on
them.

Finally we pass along the required `props` to our components and we are done!

Please note that we are using the function `i18n.t` for the Button text.  This is because our app
will be internationalized.  You could simply write the string "Count words" if you only target one language,
but for now, add an English translation for our button text.

Open the file `./app/i18n/translations/en.json` and replace it with this:
```json
{
    "wordcountpage": {
        "buttonText": "Count words"
    }
}
```

### Providing data for the dev-server

As with the component, we need to provide dev-server data. This should look as your Wagtail Page-serialization. 

In our case, we only care about the `richtext`-field. Add to `WordCountPage.data.js` like:
```
export default {
    'richtext': '<p>paragraph one</p><p>Another paragraph</p>'
};
```

### Add styling

When styling the container-level, we mostly do the layout. Add some margins:

```scss
@import 'Styles/includes.scss';

.WordCountPage {
    max-width: 600px;
    
    &__Section {
        margin-bottom: 20px;
    }
}
```

Now you should have a working page Container on `http://localhost:7000/WordCountPage`.

## Customizing the scaffolder
@todo

## Command reference
@todo

## General recommendations
@todo
