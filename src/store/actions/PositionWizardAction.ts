import { Action } from "redux";
import { ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";
import { PositionWizardModes } from "../../core/enums";
import { IPositionWizard } from "../../core/interfaces";

export enum PositionWizardActionTypes {
    CREATE = "TORNADO/position-wizard/create",
    EDIT = "TORNADO/position-wizard/edit",
    RESET = "TORNADO/position-wizard/reset",
}

interface IPositionWizardCreateAction extends Action<PositionWizardActionTypes.CREATE> {
    product: ICompiledProduct;
    currency: ICurrency;
}

interface IPositionWizardEditAction extends Action<PositionWizardActionTypes.EDIT> {
    position: IPositionWizard;
    currency: ICurrency;
}

interface IPositionWizardActionReset extends Action<PositionWizardActionTypes.RESET> { }

export class PositionWizardActions {
    static create = (product: ICompiledProduct, currency: ICurrency): IPositionWizardCreateAction => ({
        type: PositionWizardActionTypes.CREATE,
        product,
        currency,
    });
    
    static edit = (position: IPositionWizard, currency: ICurrency): IPositionWizardEditAction => ({
        type: PositionWizardActionTypes.EDIT,
        position,
        currency,
    });

    static reset = (): IPositionWizardActionReset => ({
        type: PositionWizardActionTypes.RESET,
    });
}

export type TPositionWizardActions = IPositionWizardCreateAction | IPositionWizardEditAction | IPositionWizardActionReset;