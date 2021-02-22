import EventEmitter from "eventemitter3";
import { IBusinessPeriod, ICompiledLanguage, ICompiledMenuNode, ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";
import { IPositionWizard } from "./IPositionWizard";

export interface IOrderWizard extends EventEmitter {
    readonly stateId: number;
    readonly sum: number;
    readonly positions: Array<IPositionWizard>;
    currency: ICurrency;
    language: ICompiledLanguage;
    businessPeriods: Array<IBusinessPeriod>;
    editProduct: (productNode: ICompiledMenuNode<ICompiledProduct>) => void;
    editCancel: () => void;
    findPosition: (position: IPositionWizard) => IPositionWizard | undefined;
    add: (position: IPositionWizard, isTemp?: boolean) => IPositionWizard;
    remove: (position: IPositionWizard) => void;
    reset: () => void;
    getFormatedSum: (withCurrency?: boolean) => string;
    dispose: () => void;
}