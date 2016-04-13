# w20-material-theme
W20 theme using Angular Material as the main styling library.

## Start up

### Prerequisites

This project requires [NodeJS](https://nodejs.org/en/), [Node Package Manager (NPM)](https://www.npmjs.com/) (normally comes with NodeJS), [Bower](http://bower.io), ang [Gulp](http://gulpjs.com/).

To install Bower and Gulp through NPM:

```
npm install -g bower
npm install -g gulp-cli
```
NPM will install Bower and Gulp globally, so you can reuse them in other projects !

```
git clone -b demo https://github.com/Magador/w20-material-theme.git
cd w20-material-theme
npm install
bower install
```

### Run the proof of concept

```
gulp
```

It will serve the app through `browser-sync` then open a new tab with the default OS Internet app to [`http://localhost:3000`](http://localhost:3000)
Each time a `.css`, `.html`, `.js`, `.json` or images change, the tab reloads.