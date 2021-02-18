import EventEmitter from "eventemitter3";
import { ICompiledMenuNode, ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import { PositionWizardModes, PositionWizardTypes } from "../enums";
import { IPositionWizard, IPositionWizardGroup } from "../interfaces";
import { PositionWizardEventTypes } from "./events";
import { PositionWizardGroup } from "./PositionWizardGroup";
import { priceFormatter } from "../../utils/price";

export class PositionWizard extends EventEmitter implements IPositionWizard {
    protected static __id = 0;

    static from(position: IPositionWizard, mode: PositionWizardModes): IPositionWizard {
        const editedPosition = new PositionWizard(mode, position.__product__ as ICompiledProduct, position.currency);

        PositionWizard.copyAttributes(position, editedPosition);

        return editedPosition;
    }

    protected static copyAttributes(src: IPositionWizard, position: IPositionWizard) {
        position.quantity = src.quantity;

        position.groups.forEach((g, i) => {
            g.positions.forEach((p, j) => {
                PositionWizard.copyAttributes(src.groups[i].positions[j], p);
            });
        });
    }

    protected _id: number = 0;

    get id() {
        return this._id;
    }

    protected _stateId: number = 0;

    get stateId() {
        return this._stateId;
    }

    get type() {
        return this._type;
    }

    get rests() {
        return 10; // нужно сделать rests у продукта
    }

    get availableQuantitiy() {
        return Math.min(this.rests, 5); // нужно сделать лимиты по модификаторам
    }

    get mode() { return this._mode; }

    get __product__() { return this._product; }

    get price() { return this.__product__.prices[this._currency.id || ""]?.value || 0; }

    get currency() { return this._currency; }

    protected _quantity: number = 0;
    get quantity() { return this._quantity; }
    set quantity(v: number) {
        if (this._quantity !== v) {
            this._quantity = v;

            this.recalculate();
            this.validate();
            this.update();

            this.emit(PositionWizardEventTypes.CHANGE);

            if (this.type === PositionWizardTypes.MODIFIER) {
                if (this._quantity > 0 && this._groups.length > 0 && !this._isValid) {
                    this.emit(PositionWizardEventTypes.EDIT, this);
                }
            }
        }
    }

    edit() {
        if (this._mode === PositionWizardModes.NEW) {
            throw Error("Position with mode \"new\" can not to edit.");
        }

        console.warn("edit")

        if (this._groups.length > 0) {
            console.warn("emit")
            this.emit(PositionWizardEventTypes.EDIT, this);
        }
    }

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
        const result = new Array<IPositionWizard>();
        this._groups.forEach(g => {
            g.positions.forEach(p => {
                if (p.quantity > 0) {
                    result.push(p);
                    result.push(...p.nestedPositions);
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

    private onEditPosition = (target: IPositionWizard) => {
        this.emit(PositionWizardEventTypes.EDIT, target);
    }

    constructor(
        protected _mode: PositionWizardModes,
        protected _product: ICompiledProduct,
        protected _currency: ICurrency,
        protected _type: PositionWizardTypes = PositionWizardTypes.PRODUCT,
    ) {
        super();

        PositionWizard.__id++;
        this._id = PositionWizard.__id;

        this._product.structure.children.forEach((s, index) => {
            const group = new PositionWizardGroup(index, s as ICompiledMenuNode<ICompiledSelector>, this._currency);
            group.addListener(PositionWizardEventTypes.CHANGE, this.onChangePositionQuantity);
            group.addListener(PositionWizardEventTypes.EDIT, this.onEditPosition);

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