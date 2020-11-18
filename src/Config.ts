import { IConfig } from "./IConfig";

class Config implements IConfig {
    refServer = {
        address: "http://192.168.8.103:8080",
        updateTimeout: 1000,
    };

    license = {
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmFiZGRhMmMwNzcwMjUwNTBlOTlhMmMiLCJlbWFpbCI6ImRqb25ueXhAZ21haWwuY29tIiwiaWF0IjoxNjA1NzA2NDczfQ.ySYmVO50XcgzE99IbyT-mAQRUvbl98JHVlty34FzFWI",
    };

    capabilities = {
        userIdleTimeout: 5000,
    };
}

export const config = new Config();