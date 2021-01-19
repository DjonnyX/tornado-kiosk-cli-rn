import { Action } from "redux";

export enum SystemActionTypes {
    SET_SERIAL_NUMBER = "TORNADO/system/set-serial-number",
    SET_NAME = "TORNADO/system/set-name",
}

interface ISystemSetSerialNumber extends Action<SystemActionTypes.SET_SERIAL_NUMBER> {
    serialNumber: string | undefined;
}

interface ISystemSetTerminalName extends Action<SystemActionTypes.SET_NAME> {
    name: string | undefined;
}

export class SystemActions {
    static setSerialNumber = (serialNumber: string | undefined): ISystemSetSerialNumber => ({
        type: SystemActionTypes.SET_SERIAL_NUMBER,
        serialNumber,
    });
    
    static setName = (name: string | undefined): ISystemSetTerminalName => ({
        type: SystemActionTypes.SET_NAME,
        name,
    });
}

export type TSystemActions = ISystemSetSerialNumber | ISystemSetTerminalName;