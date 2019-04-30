# React sass starterkit #

This is an opinionated frontend development kit.
It includes a small scaffolder for react components and is exporting a bundle with a global variable named Components

## Installation ##

1. npm install
2. npm scaffold
3. npm start

This will create a base set of containers and components in the app folder that you can work with and start the devserver at [http://localhost:7000](http://localhost:7000).

Alternativly you can use storybook instead for developing by running:

`npm run storybook`


## CLI commands ##

### Devserver ###

Start the devserver:
```
npm start
```

Start the devserver with a different port:
```
npm start -- --port 7777
```

Start the devserver as a hot proxy:
```
npm start -- --proxy http://proxydomain.com
```

### Creation commands ###

Create a new component:
```
npm run new ComponentName
```

Create a container component:
```
npm run new ComponentName -- -c
```

Delete a component:
```
npm run delete ComponentName
```

Delete a container component:
```
npm run delete ComponentName -- c
```

Run tests:
```
npm test
```

Update test snapshots (if added):
```
npm test -- -u
```

Scaffold an example project:
```
npm run scaffold
```

Scaffold an empty project:
```
npm run scaffold -- -e
```

Code formatting via prettier:
```
npm run fixcode
```

To only test that all files are formated correct:
```
npm run fixcode:test
```

Codechecking via eslint:
```
npm run eslint
```

Autofix via eslint:
```
npm run eslint:fix
```
