import { ICompiledMenuNode, ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { PositionWizardModes, PositionWizardTypes } from "../enums";

export interface IPositionWizard extends EventEmitter {
    readonly id: number;
    readonly type: PositionWizardTypes;
    readonly stateId: number;
    readonly rests: number;
    readonly availableQuantitiy: number;
    upLimit: number;
    downLimit: number;
    isValid: boolean;
    readonly mode: PositionWizardModes;
    readonly __product__: ICompiledProduct | null;
    readonly __productNode__: ICompiledMenuNode<ICompiledProduct>;
    readonly currency: ICurrency;
    readonly nestedPositions: Array<IPositionWizard>;
    currentGroup: number;
    quantity: number;
    readonly price: number;
    readonly sum: number;
    edit: () => void;
    getFormatedPrice: (withCurrency?: boolean) => string;
    getFormatedSum: (withCurrency?: boolean) => string;
    getFormatedSumPerOne: (withCurrency?: boolean) => string;
    readonly groups: Array<IPositionWizardGroup>;
    dispose: () => void;
}

export interface IPositionWizardGroup extends EventEmitter {
    readonly index: number;
    isValid: boolean;
    readonly currency: ICurrency;
    readonly positions: Array<IPositionWizard>;
    readonly __groupNode__: ICompiledMenuNode<ICompiledSelector>;
    readonly sum: number;
    getFormatedSum: (withCurrency?: boolean) => string;
    dispose: () => void;
}