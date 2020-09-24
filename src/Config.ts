import { IConfig } from "./IConfig"

class Config implements IConfig {
    refServer = {
        address: "http://192.168.1.7:8080",
        updateTimeout: 1000,
    };

    license = {
        apiKey: "my-api-key",
    };
}

export const config = new Config();