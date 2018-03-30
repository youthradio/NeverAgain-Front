# NeverAgain

## Automatic Build

[![Build Status](https://travis-ci.org/youthradio/NeverAgain-Front.svg?branch=webpack)](https://travis-ci.org/youthradio/NeverAgain-Front)

1. If the build status is green passing, then a final static build with the website is pushed to [gh-pages](https://github.com/youthradio/NeverAgain-Front/tree/gh-pages)
1. Every new push, via github desktop or via github web is hooked up with [travis-ci](https://travis-ci.org/youthradio/NeverAgain-Front).

## Build the project using your computer

You need the latest [NodeJS](https://nodejs.org/en/download/package-manager/#macos) and [npm](https://nodejs.org/en/download/package-manager/#macos) installed.

1. Clone the Repository:
    ```zsh
     git clone https://github.com/youthradio/NeverAgain-Front.git
    ```
1. Install package dependency
   ```zsh
    cd NeverAgain-Front
    npm install
   ```
1. To run in dev mode 
   ```zsh
    npm run start
   ```
1. To build startic files
   ```zsh
   npm run build
   ```
5. All the static files will be on `dist/`
