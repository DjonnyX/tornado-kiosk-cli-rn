import { IBusinessPeriod, ICompiledMenuNode, ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { PositionWizardModes, PositionWizardTypes } from "../enums";

export interface IPositionWizard extends EventEmitter {
    readonly id: number;
    readonly type: PositionWizardTypes;
    readonly stateId: number;
    readonly rests: number;
    readonly availableQuantitiy: number;
    readonly businessPeriods: Array<IBusinessPeriod>;
    readonly mode: PositionWizardModes;
    readonly __product__: ICompiledProduct | null;
    readonly __productNode__: ICompiledMenuNode<ICompiledProduct>;
    readonly currency: ICurrency;
    readonly nestedPositions: Array<IPositionWizard>;
    readonly groups: Array<IPositionWizardGroup>;
    readonly allGroups: Array<IPositionWizardGroup>;
    readonly price: number;
    readonly sum: number;
    active: boolean;
    actualUpLimit: number;
    upLimit: number;
    downLimit: number;
    isValid: boolean;
    currentGroup: number;
    quantity: number;
    checkActivity: () => void;
    edit: () => void;
    getFormatedPrice: (withCurrency?: boolean) => string;
    getFormatedSum: (withCurrency?: boolean) => string;
    getFormatedSumPerOne: (withCurrency?: boolean) => string;
    dispose: () => void;
}

export interface IPositionWizardGroup extends EventEmitter {
    readonly index: number;
    readonly currency: ICurrency;
    readonly positions: Array<IPositionWizard>;
    readonly allPositions: Array<IPositionWizard>;
    readonly __groupNode__: ICompiledMenuNode<ICompiledSelector>;
    readonly sum: number;
    active: boolean;
    isValid: boolean;
    checkActivity: () => void;
    getFormatedSum: (withCurrency?: boolean) => string;
    dispose: () => void;
}