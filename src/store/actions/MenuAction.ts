import { Action } from "redux";
import { MenuWizard } from "../../core/menu/MenuWizard";

export enum MenuActionTypes {
    SET_WIZARD = "TORNADO/menu/set-wizard",
    UPDATE_STATE_ID = "TORNADO/menu/update-state-id",
}

interface IMenuActionSetWizard extends Action<MenuActionTypes.SET_WIZARD> {
    wizard: MenuWizard | undefined;
}

interface IMenuActionUpdateStateId extends Action<MenuActionTypes.UPDATE_STATE_ID> {
    stateId: number;
}

export class MenuActions {
    static setWizard = (wizard: MenuWizard | undefined): IMenuActionSetWizard => ({
        type: MenuActionTypes.SET_WIZARD,
        wizard,
    });

    static updateStateId = (stateId: number): IMenuActionUpdateStateId => ({
        type: MenuActionTypes.UPDATE_STATE_ID,
        stateId,
    });
}

export type TMenuActions = IMenuActionUpdateStateId | IMenuActionSetWizard;