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
├── .storybook      # Configuration for storybook
├── api             # Contains api libraries for communicating with Wagtail
├── app             # Contains the Next.js [App Router](https://nextjs.org/docs/app) routes
├── cli             # Contains the cli tool for generating new components
├── components      # Contains all Components
├── config          # Contains various configurations, ex for jest
├── containers      # Contains all Containers
├── data            # Hold fixtures and factories for storybook and tests
├── i18n            # Contains locale config and the module for translation strings
├── index.css       # Entrypoing for global css from styles
├── jest.config.ts  # Configuration for jest
├── next.config.ts  # Configuration for Next.js
├── public          # Static files to be served by Next.js
├── routing         # Shared page loading and rendering used by the app routes
├── setupTests.ts   # Test suite configurations
├── stories         # Default storybook directory
├── styles          # Global styling (h1, h2, resets etc)
└── utils           # Where you should place your utility functions
```


To get up and running we first need to install the npm dependencies from the frontend directory:
```bash
cd frontend     # if not there already
npm ci
```

`npm run typecheck` runs TypeScript 7. The `typescript` package in `node_modules` is the TypeScript 6 compatibility package `@typescript/typescript6`, kept for ESLint and Storybook. It has no `tsserver.js`, so editor settings that point at the workspace TypeScript, such as "Use Workspace Version", `typescript.tsdk` or typescript-language-server, do not work. Use the TypeScript version bundled with your editor or the TypeScript 7 native language service.

Next, we start [Storybook](https://storybook.js.org/)
```bash
npm run storybook
```

From here, start your preferred browser and navigate to `http://localhost:3001`.  You should see a list of all
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
npm run new:component Button
```

This will create the following files:
```
├── components
│   ├── Button
│   │   ├── Button.data.ts
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
```

#### Button.data.ts
Exporting an object representing the `props` the component will use in the dev-server,
which will be passed down from higher order components/containers in the actual app.
`satisfies ButtonProps` makes TypeScript check the object against the component props.

#### Button.module.css
The stylesheet for the component. It uses [CSS Modules](https://github.com/css-modules/css-modules) where class names are scoped locally.

#### index.ts
Decides what the module exports. It defaults to the component `Button` and its `ButtonProps` type, and you can almost always ignore this file.

#### Button.stories.tsx
Declares the stories for the [Storybook integration](https://storybook.js.org/). You can ignore this for now.

#### Button.tsx
The TypeScript code for the React component. `ButtonProps` declares the props it accepts.

#### Button.test.tsx
Tests for the component. It will run when you run "npm run test"


### Writing the component

Let’s start coding the component, modify `Button.tsx` so that it looks like this:
```tsx
import s from './Button.module.css';

export type ButtonProps = {
    onClick?: () => void;
    text?: string;
};

const Button = ({ onClick, text }: ButtonProps) => (
    <button className={s.Button} onClick={onClick}>
        {text}
    </button>
);

export default Button;
```

This allows us to render a Button which accepts the props `onClick` and `text`. React 19 ignores
`propTypes` and `defaultProps` on function components, so give props their defaults in the
argument list instead, for example `({ onClick, text = 'Click me' }: ButtonProps)`.

### Providing data for storybook

We need to provide the props `text` and `onClick` to our component to be able to work with it in the dev server.
Replace the contents of `Button.data.ts` with:
```ts
import type { ButtonProps } from './Button';

export default {
    text: 'Button text',
    onClick: () => console.log('clicked'),
} satisfies ButtonProps;
```

Now if you look at the component in the browser on [http://localhost:3001/?path=/story/components-button--with-data](http://localhost:3001/?path=/story/components-button--with-data) you
should see the text "Button text" and if you click it you should see "clicked" in the browser console.

To be able to mock the props like this is very handy since you can develop the whole frontend without
the actual Wagtail implementation in place. It helps you to test the frontend in an isolated context and in a team
setting you can have different members of your team working on the frontend and backend without blocking each other.

### Add styling

To style the component, we simply add some css-rules to `Button.module.css`:

```css
.Button {
    background: #ff4040;
    color: white;
    border: none;
    padding: 10px 15px;
}
```

Please note that since [CSS modules](https://github.com/css-modules/css-modules) are beeing used here, you can only apply styling on your component context.

In a real-life scenario, you would probably want to add your colors to file such `./styles/variables.css` and use them
in your stylesheet rather than using hex-colors. But you can work however you like and this boilerplate does not
enforce anything.


## Building your first `Container`

Now we have the components we need for building our container. We will call this container _WordCountPage_.  If we were
building a backend for this as well, it would be represented by a Wagtail-model with the same name. 

The received props this container will handle will be a camelCased version of that model's serialization,
read more about models and serialization in our [Backend Developer Guide](./backend-developer-guide.md)

From a React-point of view, a container is the same thing as a component. We keep them separated only to make our
code nice and tidy.  From our point of view a container differs from a component in the following ways:
- The container handles the state and pass it down to its components
- The container is responsible for the layout of the components it uses, the component styling should not affect the component's placement
- The container handles javascript bindings and pass it down to its components. i.e. a click handler should be defined in the container and be passed down via props


To build our container, launch the scaffolder again, this time with `new:container`
```bash
npm run new:container WordCountPage
```
Now you should see your newly created container in `./containers/WordCountPage`, already registered in `./containers/LazyContainers.ts`

### Writing the container

We now need to import our components and place them in our container:

```tsx
import { PureComponent } from 'react';
import { basePageWrap } from '../BasePage';
import s from './WordCountPage.module.css';

import i18n from '../../i18n';

import Button from '../../components/Button';
import RawHtml from '../../components/RawHtml';

export type WordCountPageProps = {
    richText?: string;
};

class WordCountPage extends PureComponent<WordCountPageProps> {
    state = {};

    handleWordCountClick = () => {
        const { richText = '' } = this.props;
        const quickAndDirtyWordCount = richText.replace(/<[^>]+>/g, ' ')
            .split(' ').filter(x => x).length;

        alert(`This article contains ${quickAndDirtyWordCount} words`);
    }

    render() {
        const {richText} = this.props;
        return (
            <div className={s.WordCountPage}>
                <div className={`${s.Section} ${s.SectionBody}`}>
                    <RawHtml html={richText} />
                </div>
                <div className={`${s.Section} ${s.SectionButton}`}>
                    <Button text={i18n.t('wordcountpage.buttonText')} onClick={this.handleWordCountClick} />
                </div>
            </div>
        );
    }
}

export default basePageWrap(WordCountPage);
```

First we import our components then we declare a click-handler for our button `handleWordCountClick`, note that we use fat-arrow (`=>`) functions here
to make sure that the `this` keyword refers to the `WordCountPage` instance inside of that function scope.  In this
particular case, we just do a very quick and dirty wordcount of the component prop "richText" which will be provided
by Wagtail (from `WordCountPage.data.ts` in the dev-server).

In the render-function, we simply wrap our components in div-elements because we want to put some margins on
them.

Finally we pass along the required `props` to our components and we are done!

Please note that we are using the function `i18n.t` for the Button text.  This is because our app
will be internationalized. You could simply write the string "Count words" if you only target one language,
but for now, add an English translation for our button text.

Open the file `./i18n/translations/en.json` and replace it with this:
```json
{
    "wordcountpage": {
        "buttonText": "Count words"
    }
}
```

### Providing data for the storybook

As with the component, we need to provide storybook data. This should look as your Wagtail Page-serialization. 

In our case, we only care about the `richText`-field. Replace the contents of `WordCountPage.data.ts` with:
```ts
import type { WordCountPageProps } from './WordCountPage';

export default {
    richText: '<p>paragraph one</p><p>Another paragraph</p>',
} satisfies WordCountPageProps;
```

### Add styling

When styling the container-level, we mostly do the layout. Add some margins:

```css
.WordCountPage {
    max-width: 600px;
}

.Section {
    margin-bottom: 20px;
}
```

Now you should have a working page Container on `http://localhost:3001/WordCountPage`.

## Customizing the scaffolder
@todo

## Command reference
@todo

## General recommendations
@todo
