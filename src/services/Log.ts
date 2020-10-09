import { NativeLog } from "../native/Log";

export class Log {
    static i(tag: string, message: string) {
        NativeLog.i(tag, message);
    }
}