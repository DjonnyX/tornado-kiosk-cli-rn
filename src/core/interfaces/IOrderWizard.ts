import EventEmitter from "eventemitter3";
import { ICompiledLanguage, ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";
import { IPositionWizard } from "./IPositionWizard";

export interface IOrderWizard extends EventEmitter {
    readonly stateId: number;
    readonly sum: number;
    readonly positions: Array<IPositionWizard>;
    currency: ICurrency;
    language: ICompiledLanguage;
    edit: (product: ICompiledProduct) => void;
    editCancel: (remove?: boolean) => void;
    findPosition: (position: IPositionWizard) => IPositionWizard | undefined;
    add: (position: IPositionWizard) => void;
    remove: (position: IPositionWizard) => void;
    getFormatedSum: (withCurrency?: boolean) => string;
    dispose: () => void;
}