# Using static site generation

One nice feature of Next.js is that it can both be used for Server-Side Rendering (SSR) and Static Site Generation (SSG), Pipit uses SSR by default, but also supports SSG. This guide will show you how.


## Requirements

Make sure you read through our [Getting started guide](/docs/getting-started-guide.md) and have everything installed.


## Reconfiguring

Open the frontend directory

```
cd frontend
```

Now proceed to disable SSR functions and enable SSG functions

- In `frontend/pages/[...path].js`, comment out `getServerSideProps` and un-comment `getStaticProps` and `getStaticPaths`
- In `frontend/pages/_preview`, uncomment `getStaticProps` and comment out `getServerSideProps`
- In `frontend/pages/index.js`, uncomment the line below `// For SSG` and comment out the line after `// For SSR`

- Open `next.config.js` and add/change `output` to export.

    ```js
    const nextConfig = {
        output: 'export',
        ...
    }
    ```


## Exporting

After that, create a html [export](https://nextjs.org/docs/advanced-features/static-html-export).

```
npm run build
```

This will create a folder called `/frontend/out` that will contain your website exported as static html files.

Continue by opening the dir and run a webserver as its root

```
cd out
python3 -m http.server 8000
```

Finally open [http://localhost:8000](http://localhost:8000) in your favorite browser and you should see your website.
