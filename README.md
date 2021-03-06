Welcome, To protoReaction!
=============================
!["NodeJS Version"](https://img.shields.io/badge/NodeJS-%5E14%2E17%2E0-43853d?style=for-the-badge&logo=nodedotjs)
 !["npm Version"](https://img.shields.io/badge/npm-%5E6%2E14%2E3-ea2039?style=for-the-badge&logo=npm)
 !["pnpm Version"](https://img.shields.io/badge/pnpm-%5E6%2E9%2E1-f69220?style=for-the-badge&logo=pnpm)  
!["React Version"](https://img.shields.io/badge/React-%5E17%2E0%2E2-61dafb?style=for-the-badge&logo=react)
 !["React DOM Version"](https://img.shields.io/badge/React%20DOM-%5E17%2E0%2E2-61dafb?style=for-the-badge&logo=react)
 !["Preact Version"](https://img.shields.io/badge/Preact-%5E10%2E5%2E13-673ab8?style=for-the-badge&logo=preact)
 !["Redux Version"](https://img.shields.io/badge/Redux-%5E4%2E1%2E0-764abc?style=for-the-badge&logo=redux)  
!["Redux Saga Version"](https://img.shields.io/badge/Redux%20Saga-%5E1%2E1%2E3-86d46b?style=for-the-badge&logo=reduxsaga)
 !["Immer Version"](https://img.shields.io/badge/Immer-%5E9%2E0%2E3-00e7C3?style=for-the-badge&logo=immer)  
!["Test Code Coverage"](https://img.shields.io/badge/Test%20Coverage-97%25-43c25?style=for-the-badge)
 !["Test Status"](https://img.shields.io/badge/Test%20Status-All%20Pass%20(53)-43c25f?style=for-the-badge)
 !["Build Status"](https://img.shields.io/badge/Build%20Status-Success-43c25f?style=for-the-badge)

__protoReaction is a NodeJS application for generating fully-configured React application projects, 
which can build to either React or Preact, from a single source tree.__

__Transpilation, bundling, loaders (file loaders, CSS and SASS loaders, et al.) are fully-configured, out-of-the-box.__

__Aside from requiring zero configuration, projects generated from protoReaction include fully-configured test libraries (MochaJS, nyc, chai, enzyme, sinon, et al.), 
as well as Redux, Redux Saga middleware, and REST utilities.__

__Redux Stores, Reducers, Redux Saga middleware, and action factory utilities are already created, combined, and ready for use, out-of-the-box.__

__Development tools for React, Preact, and Redux are also included, and loaded, when a project is run in development mode.__

__Projects generated are built, tested, and run, using simple scripts.__

## Contents
[About](#about)  
[Quickstart](#quickstart)  
[Beyond Quickstart](#beyond-quickstart)  
[Project Structure](#project-structure)  
[Author And License Info](#author-and-license-info)  
[Support This Project](#support-this-project)

## About

protoReaction is a project generation tool, which creates a project, which can then transpile and bundle to either React or Preact, from a single source code tree.

protoReaction generates a fully-equipped project, made to scale, with the following (but not limited to) libraries:  
Core:
* Babel
* Webpack
* React
* Preact
* SASS
* Axios
* Immer
* Immerable Record
* Redux
* Redux Saga
* Day.js

Server
* Hapi

Test:
* Mocha + Mochawesome + Mochawesome Report Generator
* Enzyme
* Chai
* Sinon
* JSDOM
* NYC
* Karma + Karma Webpack (known issue, after the latest ModeJS minor update - working on it!)

Development:
* Webpack Dev Middleware (configured with Hapi)
* Webpack Hot Middleware (configured with Hapi)
* React Devtools
* Preact Devtools
* Redux Devtools

protoReaction projects come complete, with file loaders for fonts, stylesheets, audio, video, and image files.  
Projects are built, tested, and run, using simple scripts.

## Quickstart

#### Requirements
As of the latest update to this README, this project uses the following versions, of NodeJS, npm, and pnpm:

NodeJS: v14.17.1  
npm: v6.14.13  
pnpm: v6.9.1

Projects generated by protoReaction use pnpm, to manage workspaces (React and Preact), as well as perform tasks.  
To get started, install both pnpm and protoReaction, globally:
```shell
$ npm install -g pnpm@6.9.1 protoreaction@1.0.6
```

After successful installation of pnpm and protoReaction, you're ready, to create your first project.  
Projects are created in your current working directory.

The following command will create the project `myapp`, with version `1.0.0`, in your current directory:
```shell
$ protoreaction create myapp 1.0.0
```

Enter the project directory, install dependencies, and start the React in-memory development instance:
```shell
$ cd myapp
$ pnpm install
$ pnpm run start
```

In your web browser, navigate to:  
[http://localhost:3001/mmry/index.html](http://localhost:3001/mmry/index.html)

To view all assets being served by Hapi (JSON endpoint):  
[http://localhost:3001/available](http://localhost:3001/available)

If the in-memory build and server start were successful, you should see the following test page:  
!["Health Check Page"](readme-asset/protoreaction-healthcheck-react-development.png)

## Beyond Quickstart

#### Additional `create` CLI Args (name = value pairs, i.e., `--ARG=[VALUE]`):
* `--NAME=[NAME]`: (Overrides unnamed arg) Name of your project (REQUIRED) (will be used in auto-configuration of package.json.
* `--VERSION=[SEMVER]`: (Overrides unnamed arg) Version (semver) of your project (will be used in auto-configuration of package.json.
* `--AUTHOR_NAME=[AUTHOR NAME]`: Name of your project author (will be used in auto-configuration of package.json.
* `--AUTHOR_EMAIL=[AUTHOR EMAIL]`: Email address of your project author (will be used in auto-configuration of package.json.
* `--AUTHOR_URL=[AUTHOR URL]`: Website URL of your project author (will be used in auto-configuration of package.json.
* `--HOMEPAGE=[PROJECT HOMEPAGE]`: Website URL for your project (will be used in auto-configuration of package.json.
* `--LICENSE=[PROJECT LICENSE]`: License for your project (will be used in auto-configuration of package.json.
* `--REPO_TYPE=[REPOSITORY TYPE]`: Repository type for your project (will be used in auto-configuration of package.json.
* `--REPO_URL=[REPOSITORY URL]`: Repository URL for your project (will be used in auto-configuration of package.json.

#### Additional Scripts:

__Server Scripts:__  
To start with a React production in-memory build:
```shell
$ pnpm run start:prod
```

To start with a React production + devtools in-memory build:
```shell
$ pnpm run start:prod-dev
```

To start with a Preact development in-memory build:
```shell
$ pnpm run start:preact
```

To start with a Preact production in-memory build:
```shell
$ pnpm run start:preact:prod
```

To start with a Preact production + devtools in-memory build:
```shell
$ pnpm run start:preact:prod-dev
```

__Build Scripts (output to workspaces/[react, preact]/dist/..):__  
To build React development bundles:  
```shell
$ pnpm run build:dev
```

To build React production bundles:   
```shell
$ pnpm run build:prod
```

To build Preact development bundles:  
```shell
$ pnpm run build:preact:dev
```

To build Preact production bundles:  
```shell
$ pnpm run build:preact:prod
```

After builds are generated, they are picked up by the built-in Hapi server:
```shell
$ pnpm run start
```

After building React development (`pnpm run build:dev`), navigate to:  
[http://localhost:3001/dist/react/dev/index.html](http://localhost:3001/dist/react/dev/index.html)

To view all assets being served by Hapi (JSON endpoint):  
[http://localhost:3001/available](http://localhost:3001/available)

__Clean Scripts:__  
To clean all workspace dependency, build, and test output directories:
```shell
$ pnpm run clean
```

To clean the React dependency, build, and test output directories:
```shell
$ pnpm run clean:react
```

To clean the React dependency directory:
```shell
$ pnpm run clean:react:dependency
```

To clean the React build directory:
```shell
$ pnpm run clean:react:build
```

To clean the Preact dependency, build, and test output directories:
```shell
$ pnpm run clean:preact
```

To clean the Preact dependency directory:
```shell
$ pnpm run clean:preact:dependency
```

To clean the Preact build directory:
```shell
$ pnpm run clean:preact:build
```

To clean the test output directory:
```shell
$ pnpm run clean:test
```

__Test Scripts (output to test/output/..):__  
To run all tests, with coverage (unit + integration):
```shell
$ pnpm run test:coverage
```

To run unit tests, with coverage:
```shell
$ pnpm run test:unit:coverage
```

To run integration tests, with coverage:
```shell
$ pnpm run test:integration:coverage
```

Tests generate HTML output, which is then served by the built-in Hapi server:
```shell
$ pnpm run start
```

After testing React (`pnpm run test`), navigate to:  
[http://localhost:3001/test/report/react/mochawesome/Test_Report_myapp.html](http://localhost:3001/test/report/react/mochawesome/Test_Report_myapp.html)  
[http://localhost:3001/test/report/react/nyc/index.html](http://localhost:3001/test/report/react/nyc/index.html)

To view all assets being served by Hapi (JSON endpoint):  
[http://localhost:3001/available](http://localhost:3001/available)

#### Project Structure
Below is a general overview of the project structure, i.e., "where to find the relevant things".

Source code (at root):  
[src](/src)

Root configuration modules:  
[config](/config)

React configuration modules:  
[workspaces/react/config/](/workspaces/react/config)

Preact configuration modules:  
[workspaces/preact/config/](/workspaces/preact/config)

Test modules (/test/ directories may also be added to the root /src):  
[test/spec/](/test/spec)

Test output (genrated after running tests):  
`test/output/`

## Author And License Info
protoReaction is authored by, and copyright 2021 to present, Antonio Malcolm.  
All rights reserved.

protoReaction (A.K.A., "ProtoReaction" or "protoreaction")
 is licensed under the BSD 3-Clause license,
 and is subject to the terms of the BSD 3-Clause license,
 found in the LICENSE file, in the root directory of this project.
 If a copy of the BSD 3-Clause license cannot be found,
 as part of this project, you can obtain one, at:
 [https://opensource.org/licenses/BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)

## Support This Project
This software is built with the greatest care and attention to detail, and thoroughly tested.  
Any support is greatly appreciated!

[!["Donate: Buy Me A Coffee"](https://img.shields.io/badge/Donate-Buy%20Me%20A%20Coffee-a1644c?style=for-the-badge&logo=buymeacoffee)](https://buymeacoffee.com/antoniomalcolm)
 [!["Donate: LiberaPay"](https://img.shields.io/badge/Donate-LiberaPay-f6c915?style=for-the-badge&logo=liberapay)](https://liberapay.com/antonio-malcolm)
 [!["Donate: PayPal"](https://img.shields.io/badge/Donate-PayPal-0070ba?style=for-the-badge&logo=paypal)](https://paypal.me/antoniomalcolm)