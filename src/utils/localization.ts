import { ICompiledLanguage } from "@djonnyx/tornado-types";

export const localize = (lang: ICompiledLanguage, key: string, ...args: Array<string>): string => {
    let result: string = lang?.translation[key]?.value || "";

    if (!!args && args.length > 0) {
        args.forEach((arg, i) => {
            const replaceKey = "${[" + String(i + 1) + "]}";
            result = result.replace(replaceKey, arg);
        });
    }

    return result;
}