import { ICompiledMenuNode, ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { IPositionWizardPosition } from "../interfaces";
import { PositionWizardPositionEventTypes } from "./events";

export class PositionWizardPosition extends EventEmitter implements IPositionWizardPosition {
    get index() { return this._index; }

    get id() { return this._productNode.content.id; }

    get __productNode__() { return this._productNode; }

    protected _quantity: number = 0;
    set quantity(v: number) {
        if (this._quantity !== v) {
            this._quantity = v;

            this.recalculate();
            this.emit(PositionWizardPositionEventTypes.CHANGE_QUANTITY);
        }
    }
    get quantity() { return this._quantity; }

    get currency() { return this._currency; }

    protected _sum: number = 0;
    get sum() { return this._sum; }

    get price() { return this._productNode.content.prices[this._currency.id || ""]?.value || 0; }

    constructor(
        protected _index: number,
        protected _productNode: ICompiledMenuNode<ICompiledProduct>,
        protected _currency: ICurrency,
    ) {
        super();

        this.recalculate();
    }

    protected recalculate(): void {
        this._sum = this.price * this._quantity;
    }

    getFormatedPrice(withCurrency: boolean = false): string {
        let s = (this.price * 0.01).toFixed(2);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    getFormatedSum(withCurrency: boolean = false): string {
        let s = (this._sum * 0.01).toFixed(2);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    dispose() {
        // etc
    }
}