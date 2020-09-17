export interface IConfig {
    refServer: {
        address: string;
        updateTimeout: number;
    },
    license: {
        apiKey: string;
    }
}