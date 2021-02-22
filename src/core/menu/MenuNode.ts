import { IBusinessPeriod, ICompiledLanguage, ICompiledMenuNode, ICompiledProduct, ICompiledSelector, ICurrency, NodeTypes } from "@djonnyx/tornado-types";
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

    protected _children = new Array<MenuNode>();
    get children() { return this._children; }

    protected _active: boolean = true;
    public set active(v: boolean) {
        if (this._active !== v) {
            this._active = v;

            this.update();

            this.emit(MenuNodeEventTypes.CHANGE);
        }
    }
    public get active() { return this._active; }

    get scenarios() { return this.__rawNode__.scenarios; }

    private changeMenuNodeHandler = () => {
        this.emit(MenuNodeEventTypes.CHANGE);
    }

    constructor(public readonly __rawNode__: ICompiledMenuNode<T>, protected _parent: MenuNode | null, protected _businessPeriods: Array<IBusinessPeriod>,
        protected _language: ICompiledLanguage, protected _currency: ICurrency) {
        super();

        MenuNode.__id++;
        this._id = MenuNode.__id;

        this.__rawNode__.children.forEach(n => {
            const node = new MenuNode(n, this, _businessPeriods, _language, _currency);
            node.addListener(MenuNodeEventTypes.CHANGE, this.changeMenuNodeHandler);
            this._children.push(node);
        });

        if (this.__rawNode__.type === NodeTypes.PRODUCT) {
            const p: ICompiledMenuNode<ICompiledProduct> = this.__rawNode__ as any;
            p.content.structure.children.forEach(n => {
                const node = new MenuNode(n, this, _businessPeriods, _language, _currency);
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