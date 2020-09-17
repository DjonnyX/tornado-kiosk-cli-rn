import { IConfig } from "./IConfig"

class Config implements IConfig {
    refServer = {
        address: "http://192.168.0.11:8080",
        updateTimeout: 10000,
    };

    license = {
        apiKey: "my-api-key",
    };
}

export const config = new Config();