import EventEmitter from "eventemitter3";
import { ICompiledLanguage, ICompiledOrderType, ICompiledProduct, ICurrency, IOrder } from "@djonnyx/tornado-types";
import { IPositionWizard } from "./IPositionWizard";
import { MenuNode } from "../menu/MenuNode";
import { IOrderData } from "../../services";

export interface IOrderWizard extends EventEmitter {
    fireChangeMenu(): void;
    result: IOrder | undefined;
    lastPosition: IPositionWizard | null;
    currentPosition: IPositionWizard | null;
    viewingPosition: IPositionWizard | null;
    readonly onChangePosition: () => void;
    readonly stateId: number;
    readonly sum: number;
    readonly positions: Array<IPositionWizard>;
    suffix: string;
    currency: ICurrency;
    language: ICompiledLanguage;
    orderType: ICompiledOrderType;
    respawn(): void;
    gotoPreviousGroup(): void;
    gotoNextGroup(): void;
    addViewingProduct(): void;
    removeViewingPosition(): void;
    closeViewingPosition(): void;
    editProduct: (productNode: MenuNode<ICompiledProduct>) => void;
    editPosition: (productNode: IPositionWizard) => void;
    editCancel: () => void;
    findPosition: (position: IPositionWizard) => IPositionWizard | undefined;
    add: (position: IPositionWizard, isTemp?: boolean) => IPositionWizard;
    remove: (position: IPositionWizard) => void;
    reset: () => void;
    getFormatedSum: (withCurrency?: boolean) => string;
    toOrderData: () => IOrderData;
    dispose: () => void;
}