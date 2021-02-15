import { ICompiledMenuNode, ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { PositionWizardModes } from "../enums";

export interface IPositionWizard extends EventEmitter {
    readonly id: number;
    readonly stateId: number;
    readonly mode: PositionWizardModes;
    readonly __product__: ICompiledProduct | null;
    readonly currency: ICurrency;
    currentGroup: number;
    quantity: number;
    readonly sum: number;
    getFormatedSum: (withCurrency?: boolean) => string;
    readonly groups: Array<IPositionWizardGroup>;
    dispose: () => void;
}

export interface IPositionWizardGroup extends EventEmitter {
    readonly index: number;
    readonly isValid: boolean;
    readonly currency: ICurrency;
    readonly positions: Array<IPositionWizardPosition>;
    readonly __groupNode__: ICompiledMenuNode<ICompiledSelector>;
    readonly sum: number;
    getFormatedSum: (withCurrency?: boolean) => string;
    dispose: () => void;
}

export interface IPositionWizardPosition extends EventEmitter {
    readonly id: string;
    readonly index: number;
    readonly currency: ICurrency;
    quantity: number;
    readonly price: number;
    readonly sum: number;
    getFormatedPrice: (withCurrency?: boolean) => string;
    getFormatedSum: (withCurrency?: boolean) => string;
    readonly __productNode__: ICompiledMenuNode<ICompiledProduct>;
    dispose: () => void;
}
