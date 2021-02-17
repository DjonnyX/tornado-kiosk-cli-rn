import { ICompiledMenuNode, ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { priceFormatter } from "../../utils/price";
import { PositionWizardModes } from "../enums";
import { IPositionWizard, IPositionWizardGroup, IPositionWizardPosition } from "../interfaces";
import { PositionWizardEventTypes, PositionWizardGroupEventTypes } from "./events";
import { PositionWizardGroup } from "./PositionWizardGroup";

export class PositionWizard extends EventEmitter implements IPositionWizard {
    protected static __id = 0;

    static from(position: IPositionWizard, mode: PositionWizardModes): IPositionWizard {
        const editedPosition = new PositionWizard(mode, position.__product__ as ICompiledProduct, position.currency);

        editedPosition.quantity = position.quantity;

        editedPosition._groups.forEach((g, i) => {
            g.positions.forEach((p, j) => {
                p.quantity = position.groups[i].positions[j].quantity;
            });
        });

        return editedPosition;
    }

    protected _id: number = 0;

    get id() {
        return this._id;
    }

    protected _stateId: number = 0;

    get stateId() {
        return this._stateId;
    }

    get rests() {
        return 10; // нужно сделать rests у продукта
    }

    get mode() { return this._mode; }

    get __product__() { return this._product; }

    get price() { return this.__product__.prices[this._currency.id || ""]?.value || 0; }

    get currency() { return this._currency; }

    protected _quantity: number = 0;
    set quantity(v: number) {
        if (this._quantity !== v) {
            this._quantity = v;

            this.recalculate();
            this.update();

            this.emit(PositionWizardEventTypes.CHANGE);
        }
    }
    get quantity() { return this._quantity; }

    protected _groups = new Array<IPositionWizardGroup>();

    get groups() { return this._groups; }

    protected _isValid: boolean = true;
    get isValid() { return this._isValid; }

    protected _sum: number = 0;
    get sum() { return this._sum; }

    protected _sumPerOne: number = 0;
    get sumPerOne() { return this._sumPerOne; }

    protected _currentGroup: number = 0;
    set currentGroup(v: number) {
        if (this._currentGroup !== v) {
            this._currentGroup = v;
        }
    }
    get currentGroup() { return this._currentGroup; }

    get nestedPositions() {
        const result = new Array<IPositionWizardPosition>();
        this._groups.forEach(g => {
            g.positions.forEach(p => {
                if (p.quantity > 0) {
                    result.push(p);
                }
            });
        });

        return result;
    }

    private onChangePositionQuantity = () => {
        // etc

        this.recalculate();
        this.validate();
        this.update();

        this.emit(PositionWizardEventTypes.CHANGE);
    }

    constructor(
        protected _mode: PositionWizardModes,
        protected _product: ICompiledProduct,
        protected _currency: ICurrency,
    ) {
        super();

        PositionWizard.__id++;
        this._id = PositionWizard.__id;

        this._product.structure.children.forEach((s, index) => {
            const group = new PositionWizardGroup(index, s as ICompiledMenuNode<ICompiledSelector>, this._currency);
            group.addListener(PositionWizardGroupEventTypes.CHANGE, this.onChangePositionQuantity);

            this._groups.push(group);
        });

        this.recalculate();
        this.validate();
        this.update();
    }

    protected recalculate() {
        let sum = 0;
        this._groups.forEach(g => {
            sum += g.sum;
        });

        this._sumPerOne = sum + this.price;

        this._sum = this._sumPerOne * this._quantity;
    }

    protected validate(): boolean {
        this._groups.forEach(g => {
            if (!g.isValid) {
                this._isValid = false;
                return false;
            }
        });

        this._isValid = true;
        return true;
    }

    protected update(): void {
        this._stateId++;
    }

    getFormatedSum(withCurrency: boolean = false): string {
        let s = priceFormatter(this._sum);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    getFormatedSumPerOne(withCurrency: boolean = false): string {
        let s = priceFormatter(this._sumPerOne);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    dispose() {
        this._groups.forEach(g => {
            g.removeAllListeners();
            g.dispose();
        });
    }
}