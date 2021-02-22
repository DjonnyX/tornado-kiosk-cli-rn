export interface IConfig {
    refServer: {
        address: string;
        updateTimeout: number;
    };
    capabilities: {
        userIdleTimeout: number;
        priceDigest: number;
        checkActivityInterval: number;
    };
}