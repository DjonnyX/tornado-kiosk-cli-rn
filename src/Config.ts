import { IConfig } from "./IConfig"

class Config implements IConfig {
    refServer = {
        address: "127.0.0.1:8080",
        updateTimeout: 30000,
    };

    license = {
        apiKey: "my-api-key",
    };
}

export const config = new Config();