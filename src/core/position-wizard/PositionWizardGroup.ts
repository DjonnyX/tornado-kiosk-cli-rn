import { ICompiledMenuNode, ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { IPositionWizardGroup, IPositionWizardPosition } from "../interfaces";
import { PositionWizardGroupEventTypes, PositionWizardPositionEventTypes } from "./events";
import { PositionWizardPosition } from "./PositionWizardPosition";

export class PositionWizardGroup extends EventEmitter implements IPositionWizardGroup {
    get index() { return this._index; }

    get __groupNode__() { return this._groupNode; }

    protected _quantity: number = 0;
    set quantity(v: number) {
        if (this._quantity !== v) {
            this._quantity = v;

            this.emit(PositionWizardPositionEventTypes.CHANGE_QUANTITY);
        }
    }
    get quantity() { return this._quantity; }

    protected _positions = new Array<IPositionWizardPosition>();

    get positions() { return this._positions; }

    get currency() { return this._currency; }

    protected _isValid: boolean = true;
    get isValid() { return this._isValid; }

    protected _sum: number = 0;
    get sum() { return this._sum; }

    private onChangePositionQuantity = (target: IPositionWizardPosition) => {
        // etc
        this.recalculate();
        this.validate();
        this.emit(PositionWizardGroupEventTypes.CHANGE);
    }

    constructor(
        protected _index: number,
        protected _groupNode: ICompiledMenuNode<ICompiledSelector>,
        protected _currency: ICurrency,
    ) {
        super();

        this._groupNode.children.forEach((p, index) => {
            const position = new PositionWizardPosition(index, p as ICompiledMenuNode<ICompiledProduct>, this._currency);
            position.addListener(PositionWizardPositionEventTypes.CHANGE_QUANTITY, this.onChangePositionQuantity);

            this._positions.push(position);
        });

        this.recalculate();
    }

    protected recalculate() {
        let sum = 0;
        this._positions.forEach(p => {
            sum += p.sum;
        });

        this._sum = sum;
    }

    protected validate(): boolean {
        this._positions.forEach(p => {
            // etc
        });

        this._isValid = true;
        return true;
    }

    getFormatedSum(withCurrency: boolean = false): string {
        let s = (this._sum * 0.01).toFixed(2);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    dispose() {
        this._positions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });
    }
}