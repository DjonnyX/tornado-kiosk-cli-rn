import { IConfig } from "./IConfig";

class Config implements IConfig {
    refServer = {
        address: "http://192.168.8.105:8080",
        updateTimeout: 60000,
        apiKeyTokenSalt: "qahtERQsPUI9O1FxnS8askPQ8lWmXlzwKIzWcXLtgBveAcorE7rGHMyXypQfvMwxk0HOHtHqKvWVmRGhQ3mL9sx8GYh9rzTg64c5loZlvG0eFEmfxRFGw6mBIGDnAT9voByVvR5i4Ei5jMeoh8bgJUcK15A4NDp7lytsrBtJ6Gt1Fpvggk07DOBbs92z6aMRemeK49pfnqUdPZNQW7RjqWNjzpKdMJHZqsJo3q8rnRI1AOprMH9HRTSSZIW78tvR4k19pQJ14mwqjDNgvmGzypk8Wwa8pOdDd8TuaTQs4YRmf6Fx1mLe87Ua35Hvc9q3k7MF8kKPRJFLuAa12bcQ",
    };

    capabilities = {
        userIdleTimeout: 60000,
        priceDigest: 0,
    };
}

export const config = new Config();