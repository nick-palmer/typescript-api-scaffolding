export const config =  {
    // Application Settings
    app: {
        name: "ts-api-scaffolding",
        version: "0.1.0",
        environment: "dev"
    },

    // Logging Settings
    log: {
        directory: "./logs/",
        level: "debug",
        format: "combined",
        rotateDuration: "1d",
        maxSize: "10K",
        archive: true,
        maxFiles: "30d"
    },

    // HTTP Settings
    httpPort: 8080,

    // HTTPS Settings
    useHttps: false,
    httpsCertPath: "",
    httpsKeyPath: "",
    httpsPort: 8443,

    // Database Settings
    managementDatabase: {
        name: "",
        host: "",
        user: "",
        password: ""
    },

    // User Session Settings
    session: {
        secretKey: "W0u1dN'7U1Ik32N0",
        tokenExpireTime: 86400
    }
};
