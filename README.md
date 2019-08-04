# Typescript API Scaffolding

This project is meant to have all the necessary frameworks and boiler plate code in place to quickly create a RESTful API with [NodeJS](https://nodejs.org/en/about/), [Express](https://www.npmjs.com/package/express), and [Typescript](https://www.typescriptlang.org/).

## Development

In order to run the project and perform development, clone the repo:

```bash
git clone https://github.com/nick-palmer/typescript-api-scaffolding.git
```

Download the dependencies.

```bash
npm install
```

To run compile the Typescript and run the application:

```bash
npm start
```

To run the app in development mode where code changes will trigger a build and restart through [nodemon](https://www.npmjs.com/package/nodemon):

```bash
npm run start:watch
```

## Testing

Execute test cases:

```bash
npm test
```

This will execute all Typescript test cases in the `./test` directory and provide a summary of the results.

## Configuration

### SSL Support

To enable SSL, update the following settings in the `environment.ts` file to specify the path to the cretificate files:

```
// HTTPS Settings
useHttps: false,
httpsCertPath: "/path/to/cert.crt",
httpsKeyPath: "/path/to/key",
httpsPort: 8443,
```