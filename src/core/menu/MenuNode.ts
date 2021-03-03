import {
    IBusinessPeriod, ICompiledLanguage, ICompiledMenuNode, ICompiledOrderType, ICompiledProduct, ICompiledSelector,
    ICurrency, NodeTypes
} from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { ScenarioProcessing } from "../scenarios";
import { MenuNodeEventTypes } from "./events";

export class MenuNode<T = ICompiledSelector | ICompiledProduct | any> extends EventEmitter {
    protected static __id = 0;

    protected _id: number = 0;

    get id() {
        return this._id;
    }

    get index() {
        return this.__rawNode__.index;
    }

    get type() {
        return this.__rawNode__.type;
    }

    get parent() {
        return this._parent;
    }

    protected _stateId: number = 0;

    get stateId() {
        return this._stateId;
    }

    set currency(v: ICurrency) {
        if (this._currency !== v) {
            this._currency = v;

            this._children.forEach(c => {
                c.currency = v;
            });
        }
    }

    set businessPeriods(v: Array<IBusinessPeriod>) {
        if (this._businessPeriods !== v) {
            this._businessPeriods = v;

            this._children.forEach(c => {
                c.businessPeriods = v;
            });
        }
    }

    set orderTypes(v: Array<ICompiledOrderType>) {
        if (this._orderTypes !== v) {
            this._orderTypes = v;

            this._children.forEach(c => {
                c.orderTypes = v;
            });
        }
    }

    set language(v: ICompiledLanguage) {
        if (this._language !== v) {
            this._language = v;

            this._children.forEach(c => {
                c.language = v;
            });
        }
    }

    protected _children = new Array<MenuNode>();
    get children() { return this._children; }

    protected _activeChildren = new Array<MenuNode>();
    get activeChildren() { return this._children.filter(c => c.active); }

    protected _active: boolean = true;
    public set active(v: boolean) {
        if (this._active !== v) {
            this._active = v;

            this.update();

            this.emit(MenuNodeEventTypes.CHANGE);
        }
    }
    public get active() { return this._active; }

    protected _visibleByBusinessPeriod: boolean = true;
    public set visibleByBusinessPeriod(v: boolean) {
        if (this._visibleByBusinessPeriod !== v) {
            this._visibleByBusinessPeriod = v;

            this.active = this._visibleByOrderType && this._visibleByBusinessPeriod;
        }
    }
    public get visibleByBusinessPeriod() { return this._visibleByBusinessPeriod; }

    protected _visibleByOrderType: boolean = true;
    public set visibleByOrderType(v: boolean) {
        if (this._visibleByOrderType !== v) {
            this._visibleByOrderType = v;

            this.active = this._visibleByOrderType && this._visibleByBusinessPeriod;
        }
    }
    public get visibleByOrderType() { return this._visibleByOrderType; }

    get scenarios() { return this.__rawNode__.scenarios; }

    private changeMenuNodeHandler = () => {
        this.emit(MenuNodeEventTypes.CHANGE);
    }

    constructor(public readonly __rawNode__: ICompiledMenuNode<T>, protected _parent: MenuNode | null,
        protected _businessPeriods: Array<IBusinessPeriod>,
        protected _orderTypes: Array<ICompiledOrderType>,
        protected _language: ICompiledLanguage,
        protected _currency: ICurrency) {
        super();

        MenuNode.__id++;
        this._id = MenuNode.__id;

        this.__rawNode__.children.forEach(n => {
            const node = new MenuNode(n, this, _businessPeriods, _orderTypes, _language, _currency);
            node.addListener(MenuNodeEventTypes.CHANGE, this.changeMenuNodeHandler);
            this._children.push(node);
        });

        if (this.__rawNode__.type === NodeTypes.PRODUCT) {
            const p: ICompiledMenuNode<ICompiledProduct> = this.__rawNode__ as any;
            p.content.structure.children.forEach(n => {
                const node = new MenuNode(n, this, _businessPeriods, _orderTypes, _language, _currency);
                node.addListener(MenuNodeEventTypes.CHANGE, this.changeMenuNodeHandler);
                this._children.push(node);
            });
        }

        ScenarioProcessing.applyPeriodicScenariosForNode(this, {
            businessPeriods: this._businessPeriods,
        });
    }

    protected update(): void {
        this._stateId++;
    }

    checkActivity(): void {
        this._children.forEach(n => {
            n.checkActivity();
        })

        ScenarioProcessing.applyPeriodicScenariosForNode(this, {
            businessPeriods: this._businessPeriods,
        });
    }

    dispose(): void {
        this.removeAllListeners();

        this._children.forEach(node => {
            node.dispose();
        });
    }
}