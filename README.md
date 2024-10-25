# Workflow App

## Description

`Workflow App` is a frontend application for the `devpool-final-frontend` project. It is built using Angular and provides a user-friendly interface for managing workflows.

## Demo
You can view a live demo of the application [here](https://app.kirato.online).

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Build](#build)
- [Testing](#testing)
- [Mock API](#mock-api)
- [Dependencies](#dependencies)
- [DevDependencies](#devdependencies)

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/workflow-app.git
cd workflow-app
npm install
```

## Environment Variables
The application uses environment variables to configure the API URL. Create a `env.config.ts` file in the root of the project and add the following:

```ts
import { InjectionToken } from "@angular/core";

export type EnvConfig = {
  apiUrl: string;
};

export const ENV_CONFIG = new InjectionToken<EnvConfig>('ENV_CONFIG', {
  factory: () => {
    return { apiUrl: 'http://localhost:3000' };
  }
});
```

## Development
To start the development server, run:
  
  ```bash
  npm start
  ```

This will start the Angular development server and you can access the application at http://localhost:4200.

## Build
To build the project for production, run:
  
  ```bash 
  npm run build
  ```

The build artifacts will be stored in the dist/ directory.

## Testing
To run the unit tests, use:
  
  ```bash
  npm test
  ```

This will execute the unit tests using Karma and Jasmine.

## Mock API
To start the mock API server, run:

```bash
npm run mock-api
```


This will start a JSON server using the mock data located in ./mock/budget-api/v1.json.

## Dependencies
- @angular/animations: ^18.2.0
- @angular/common: ^18.2.0
- @angular/compiler: ^18.2.0
- @angular/core: ^18.2.0
- @angular/forms: ^18.2.0
- @angular/platform-browser: ^18.2.0
- @angular/platform-browser-dynamic: ^18.2.0
- @angular/router: ^18.2.0
- bootstrap: ^5.3.3
- bootstrap-icons: ^1.11.3
- jwt-decode: ^4.0.0
- lucide-angular: ^0.453.0
- ngx-bootstrap: ^18.1.1
- rxjs: ~7.8.0
- tslib: ^2.3.0
- zone.js: ~0.14.10

## DevDependencies
- @angular-devkit/build-angular: ^18.2.8
- @angular/cli: ^18.2.8
- @angular/compiler-cli: ^18.2.0
- @types/jasmine: ~5.1.0
- jasmine-core: ~5.2.0
- json-server: 0.17.3
- json-server-auth: 2.1.0
- karma: ~6.4.0
- karma-chrome-launcher: ~3.2.0
- karma-coverage: ~2.2.0
- karma-jasmine: ~5.1.0
- karma-jasmine-html-reporter: ~2.1.0
- prettier: ^3.3.3
- prettier-plugin-organize-imports: ^4.1.0
- typescript: ~5.5.2
