import { MenuWizard } from "../../core/menu/MenuWizard";

export interface IMenuState {
    wizard: MenuWizard | undefined;
    stateId: number;
}
