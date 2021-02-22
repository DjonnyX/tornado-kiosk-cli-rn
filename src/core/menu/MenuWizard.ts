import { IBusinessPeriod, ICompiledLanguage, ICompiledMenu, ICurrency, NodeTypes } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { config } from "../../Config";
import { MenuWizardEventTypes, MenuNodeEventTypes } from "./events";
import { MenuNode } from "./MenuNode";

export class MenuWizard extends EventEmitter {
    static current: MenuWizard;

    protected _stateId: number = 0;
    get stateId() { return this._stateId; }

    set currency(v: ICurrency) {
        if (this._currency !== v) {
            this._currency = v;
        }
    }

    set businessPeriods(v: Array<IBusinessPeriod>) {
        if (this._businessPeriods !== v) {
            this._businessPeriods = v;
        }
    }

    set language(v: ICompiledLanguage) {
        if (this._language !== v) {
            this._language = v;
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

            this._menu = new MenuNode(this._rawMenu, null, this._businessPeriods, this._language, this._currency);
            this._menu.addListener(MenuNodeEventTypes.CHANGE, this.menuChangeHandler);
        }
    }

    protected _menu!: MenuNode;
    get menu() { return this._menu; }

    private menuChangeHandler = () => {
        this.update();

        this.emit(MenuWizardEventTypes.CHANGE);
    }

    protected _unsubscribe$ = new Subject<void>();

    constructor(protected _currency: ICurrency, protected _businessPeriods: Array<IBusinessPeriod>,
        protected _language: ICompiledLanguage) {
        super();
        MenuWizard.current = this;
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

    dispose() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();

        this._menu.dispose();
    }
}