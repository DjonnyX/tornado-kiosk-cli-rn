import { ICompiledMenuNode, ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { priceFormatter } from "../../utils/price";
import { PositionWizardModes } from "../enums";
import { IPositionWizard, IPositionWizardGroup } from "../interfaces";
import { PositionWizardEventTypes, PositionWizardGroupEventTypes } from "./events";
import { PositionWizard } from "./PositionWizard";

export class PositionWizardGroup extends EventEmitter implements IPositionWizardGroup {
    get index() { return this._index; }

    get __groupNode__() { return this._groupNode; }

    protected _positions = new Array<IPositionWizard>();

    get mode() { return this._mode; }

    get positions() { return this._positions; }

    get currency() { return this._currency; }

    protected _isValid: boolean = true;
    get isValid() { return this._isValid; }

    protected _sum: number = 0;
    get sum() { return this._sum; }

    private onChangePositionQuantity = () => {
        // etc

        this.recalculate();
        this.validate();
        this.emit(PositionWizardGroupEventTypes.CHANGE);
    }

    constructor(
        protected _mode: PositionWizardModes,
        protected _index: number,
        protected _groupNode: ICompiledMenuNode<ICompiledSelector>,
        protected _currency: ICurrency,
    ) {
        super();

        this._groupNode.children.forEach((p, index) => {
            const position = new PositionWizard(_mode, p.content as ICompiledProduct, this._currency);
            position.addListener(PositionWizardEventTypes.CHANGE, this.onChangePositionQuantity);

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
        let s = priceFormatter(this._sum);
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