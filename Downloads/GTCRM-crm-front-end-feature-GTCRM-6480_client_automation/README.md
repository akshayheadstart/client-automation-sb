# GTCRM-crm-front-end

![TeamCity build status](https://teamcity.shiftboolean.com/app/rest/builds/buildType:id:Gtcrm_GtcrmAdmin_Build/statusIcon.svg)
![React Version](https://img.shields.io/badge/React-17.0.2-181717?style=for-the-badge&logo=react&style=flat-square")
![Backend](https://img.shields.io/badge/Backend%20With-FastAPI-brightgreen?style=flat-square)
![Security](https://img.shields.io/static/v1?message=Protected&logo=snyk&labelColor=white&color=green&logoColor=4C4A73&label=%20SNYK&style=flat-square)
![Material UI](https://img.shields.io/static/v1?message=^5.2.8&logo=MUI&labelColor=white&color=green&logoColor=007FFF&label=%20MUI&style=flat-square)

#### **Admin Dashboard**

### Development API URL

https://dev.shiftboolean.com/docs

### Prerequisites

1. Before start the work with react application you are going to need NPM (or Yarn, alternatively)

2. If you don't have it installed on your system, then you need to head to the official [Node.js](https://nodejs.org/en/) website to download and install Node, which also includes NPM (Node Package Management).

- npm
  you can install it globally from here

```
 $ npm install npm@latest -g
```

3. To check if both NodeJS and NPM were installed successfully, in your project's terminal, run:

```
node --v
```

### Getting Started

1. First clone the project

```
 git clone https://github.com/shiftboolean/GTCRM-crm-front-end.git
```

2. Then change your project directory

```
 cd <project-root>
```

## Installation

Install the dependencies using NPM for deterministic installs, but Yarn install will work just as well.

```
 $ yarn install  or npm install
```

### Start your React App

Run the project using npm start and see the project in browser

```
$ npm run dev
```

You can now access the server at http://localhost:3006

### Simple build for your local dev

```
$ npm run build
```

If you want to watch file change in api development. You should run

```
 $ npm dev
```

### About the project

This is a simple CRM project written in React and JavaScript. This was specifically written for school or educational organization. You can easily install this system in your own server.
This project is about an admin dashboard where admins can see their school or organization's application details. And after login they can see admin dashboard with the details of student applications.

## Folder Structure

After cloning, your project should look like this:

```
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.js
    ├── App.test.js
    ├── Redux
    ├── __test__
    ├── components
    ├── constants
    ├── hooks
    ├── icons
    ├── images
    ├── index.css
    ├── index.js
    ├── layout
    ├── logo.svg
    ├── pages
    ├── reportWebVitals.js
    ├── routes
    ├── services
    ├── setupTests.js
    ├── store
    ├── styles
    └── utils
├── index.html
```

## Environment File Needed

```bash
VITE_API_BASE_URL = ********
VITE_SITE_KEY = *********
REACT_APP_RAZOR_PAY_KEY_ID = **********
REACT_APP_COLLEGE_ID = ***************
PORT = 3006
```

## Configuration

You can adjust various development settings by setting environment variables in your shell or with [.env](#Environment File Needed).

| Variable   |    Development     |     Production     | Usage                                                                                                                                                                                                                                                                                                                                                                                                           |
| :--------- | :----------------: | :----------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BROWSER    | :white_check_mark: |        :x:         | By default, Create React App will open the default system browser, favoring Chrome on macOS.                                                                                                                                                                                                                                                                                                                    |
| HOST       | :white_check_mark: |        :x:         | By default, the development web server binds to `localhost`. You may use this variable to specify a different host.                                                                                                                                                                                                                                                                                             |
| PORT       | :white_check_mark: |        :x:         | By default, the development web server will attempt to listen on port 3006 or prompt you to attempt the next available port. You may use this variable to specify a different port.                                                                                                                                                                                                                             |
| HTTPS      | :white_check_mark: |        :x:         | When set to `true`, Create React App will run the development server in `https` mode.                                                                                                                                                                                                                                                                                                                           |
| PUBLIC_URL |        :x:         | :white_check_mark: | Create React App assumes your application is hosted at the serving web server's root or a subpath as specified in [`package.json` (`homepage`)](#Folder Structure). Normally, Create React App ignores the hostname. You may use this variable to force assets to be referenced verbatim to the url you provide (hostname included). This may be particularly useful when using a CDN to host your application. |

## Update sources

Some packages usages might change, so you should run npm prune & npm install often. A common way to update is by doing

```
$ git pull
$ npm prune
$ npm install
```

## Debugging in the Editor

This feature is currently only supported by Visual Studio Code and WebStorm.

Visual Studio Code and WebStorm support debugging out of the box with Create React App. This enables you as a developer to write and debug your React code without leaving the editor, and most importantly it enables you to have a continuous development workflow, where context switching is minimal, as you don’t have to switch between tools.

### Visual Studio Code

You would need to have the latest version of [VS Code](https://code.visualstudio.com/) and VS Code [Chrome Debugger Extension](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/) installed.

Then add the block below to your `launch.json` file and put it inside the .vscode folder in your app’s root directory.

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceRoot}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

## Change log

## Troubleshooting

`npm start` doesn’t detect changes
When you save a file while `npm start` is running, the browser should refresh with the updated code.
If this doesn’t happen, try one of the following workarounds:

- If your project is in a Dropbox folder, try moving it out.

- If the watcher doesn’t see a file called `index.js` and you’re referencing it by the folder name, you need to restart the watcher due to a Webpack bug.

- Some editors like Vim and IntelliJ have a “safe write” feature that currently breaks the watcher. You will need to disable it.

- If your project path contains parentheses, try moving the project to a path without them. This is caused by a Webpack watcher bug.

- On Linux and macOS, you might need to tweak system settings to allow more watchers.

- Having problems with VS Code Debugging? Please see their [troubleshooting guide](https://github.com/Microsoft/vscode-chrome-debug/blob/master/README.md#troubleshooting).

## Dependencies Tree

```shell
gtcrm@0.1.2-b2
+-- @emotion/react@11.10.0
+-- @emotion/styled@11.9.3
+-- @mui/icons-material@5.8.3
+-- @mui/lab@5.0.0-alpha.70
+-- @mui/material@5.10.1
+-- @mui/system@5.10.0
+-- @mui/x-date-pickers@5.0.0-beta.1
+-- @reduxjs/toolkit@1.8.3
+-- @testing-library/jest-dom@5.16.5
+-- @testing-library/react@12.1.5
+-- @testing-library/user-event@13.5.0
+-- axios@0.27.2
+-- chart.js@3.9.1
+-- d3-scale@4.0.2
+-- date-fns@2.29.1
+-- font-awesome@4.7.0
+-- grapesjs-preset-webpage@0.1.11
+-- grapesjs@0.19.5
+-- jest-canvas-mock@2.4.0
+-- js-cookie@3.0.1
+-- jwt-decode@3.1.2
+-- lottie-web@5.9.6
+-- react-apexcharts@1.3.9
+-- react-chartjs-2@4.3.1
+-- react-d3-tree@3.3.4
+-- react-dom@17.0.2
+-- react-email-editor@1.6.0
+-- react-error-boundary@3.1.4
+-- react-funnel-pipeline@0.1.2
+-- react-intersection-observer-hook@2.0.4
+-- react-masonry-css@1.0.16
+-- react-medium-image-zoom@5.0.2
+-- react-quill@2.0.0
+-- react-redux@8.0.2
+-- react-router-dom@6.3.0
+-- react-simple-maps@2.3.0
+-- react-tooltip@4.2.21
+-- react@17.0.2
+-- rsuite@5.16.4
+-- sass@1.54.4
+-- simplebar-react@2.4.1
+-- web-vitals@2.1.4
`-- yup@0.32.11



```

## Creating PR for Release

_Change release version in query parameter_

[Use Query Parameters to fetch Release Pull request Section
](https://github.com/shiftboolean/GTCRM-crm-front-end/compare/master...release/1.1.0?template=release_template.md)
