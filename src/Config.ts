import { IConfig } from "./IConfig";

class Config implements IConfig {
    refServer = {
        address: "http://192.168.1.86:8080",
        updateTimeout: 1000,
    };

    license = {
        apiKey: "my-api-key",
    };

    capabilities = {
        userIdleTimeout: 5000,
    };
}

export const config = new Config();