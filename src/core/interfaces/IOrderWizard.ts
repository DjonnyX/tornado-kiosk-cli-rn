import EventEmitter from "eventemitter3";
import { ICompiledLanguage, ICompiledMenuNode, ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";
import { IPositionWizard } from "./IPositionWizard";

export interface IOrderWizard extends EventEmitter {
    readonly stateId: number;
    readonly sum: number;
    readonly positions: Array<IPositionWizard>;
    currency: ICurrency;
    language: ICompiledLanguage;
    editProduct: (productNode: ICompiledMenuNode<ICompiledProduct>) => void;
    editCancel: () => void;
    findPosition: (position: IPositionWizard) => IPositionWizard | undefined;
    add: (position: IPositionWizard) => void;
    remove: (position: IPositionWizard) => void;
    reset: () => void;
    getFormatedSum: (withCurrency?: boolean) => string;
    dispose: () => void;
}