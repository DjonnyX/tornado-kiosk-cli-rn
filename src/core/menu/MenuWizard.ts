import { IBusinessPeriod, ICompiledLanguage, ICompiledMenu, ICompiledOrderType, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { config } from "../../Config";
import { Debounse } from "../../utils/debounse";
import { ScenarioProcessing } from "../scenarios";
import { MenuWizardEventTypes, MenuNodeEventTypes } from "./events";
import { MenuNode } from "./MenuNode";

export class MenuWizard extends EventEmitter {
    static current: MenuWizard;

    protected _stateId: number = 0;
    get stateId() { return this._stateId; }

    set currency(v: ICurrency) {
        if (this._currency !== v) {
            this._currency = v;

            if (!!this._menu) {
                this._menu.currency = v;
            }
        }
    }

    set businessPeriods(v: Array<IBusinessPeriod>) {
        if (this._businessPeriods !== v) {
            this._businessPeriods = v;

            if (!!this._menu) {
                this._menu.businessPeriods = v;
            }
        }
    }

    set orderTypes(v: Array<ICompiledOrderType>) {
        if (this._orderTypes !== v) {
            this._orderTypes = v;

            if (!!this._menu) {
                this._menu.orderTypes = v;
            }
        }
    }

    set language(v: ICompiledLanguage) {
        if (this._language !== v) {
            this._language = v;

            if (!!this._menu) {
                this._menu.language = v;
            }
        }
    }

    protected _currentOrderType: ICompiledOrderType | undefined = undefined;
    set currentOrderType(v: ICompiledOrderType) {
        if (this._currentOrderType !== v) {
            this._currentOrderType = v;

            if (!!this._menu) {
                ScenarioProcessing.checkOrderTypeActivity(this._menu, this._currentOrderType);
            }
        }
    }

    protected _rawMenu!: ICompiledMenu;
    set rawMenu(v: ICompiledMenu) {
        if (this._rawMenu !== v) {
            this._rawMenu = v;

            if (!!this._menu) {
                this._menu.removeAllListeners();
                this._menu.dispose();
            }

            this._menu = new MenuNode(this._rawMenu, null,
                this._businessPeriods,
                this._orderTypes,
                this._language,
                this._currency);

            if (!!this._currentOrderType) {
                ScenarioProcessing.checkOrderTypeActivity(this._menu, this._currentOrderType);
            }

            this._menu.addListener(MenuNodeEventTypes.CHANGE, this.menuChangeHandler);

            this.update();
            this._changeDebounse.call();
        }
    }

    protected _menu!: MenuNode;
    get menu() { return this._menu; }

    private menuChangeHandler = () => {
        this.update();

        this._changeDebounse.call();
    }

    protected emitChangeState = (): void => {
        this.emit(MenuWizardEventTypes.CHANGE);
    }

    protected _changeDebounse = new Debounse(this.emitChangeState, 10);

    protected _unsubscribe$ = new Subject<void>();

    constructor(protected _currency: ICurrency,
        protected _businessPeriods: Array<IBusinessPeriod>,
        protected _orderTypes: Array<ICompiledOrderType>,
        protected _language: ICompiledLanguage) {
        super();
        MenuWizard.current = this;

        this.startUpdatingTimer();
    }

    protected startUpdatingTimer(): void {
        interval(config.capabilities.checkActivityInterval).pipe(
            takeUntil(this._unsubscribe$),
        ).subscribe(() => {
            this._menu.checkActivity();
        });
    }

    protected updateStateId(): void {
        this._stateId++;
    }

    protected update(): void {
        this.updateStateId();
    }

    dispose(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();

        this._menu.dispose();
    }
}