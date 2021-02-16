import { ICompiledMenuNode, ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { priceFormatter } from "../../utils/price";
import { IPositionWizardPosition } from "../interfaces";
import { PositionWizardPositionEventTypes } from "./events";

export class PositionWizardPosition extends EventEmitter implements IPositionWizardPosition {
    protected static __id = 0;

    get index() { return this._index; }

    protected _id: number = 0;

    get id() {
        return this._id;
    }

    protected _stateId: number = 0;

    get stateId() {
        return this._stateId;
    }

    get productId() { return this._productNode.content.id; }

    get __productNode__() { return this._productNode; }

    protected _quantity: number = 0;
    set quantity(v: number) {
        if (this._quantity !== v) {
            this._quantity = v;

            this.recalculate();
            this.update();

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

        PositionWizardPosition.__id++;
        this._id = PositionWizardPosition.__id;

        this.recalculate();
    }

    protected recalculate(): void {
        this._sum = this.price * this._quantity;
    }

    protected update(): void {
        this._stateId++;
    }

    getFormatedPrice(withCurrency: boolean = false): string {
        let s = priceFormatter(this.price);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    getFormatedSum(withCurrency: boolean = false): string {
        let s = priceFormatter(this._sum);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    dispose() {
        // etc
    }
}