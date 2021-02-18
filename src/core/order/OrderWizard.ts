import { ICompiledLanguage, ICompiledMenuNode, ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { priceFormatter } from "../../utils/price";
import { PositionWizardModes, PositionWizardTypes } from "../enums";
import { IOrderWizard, IPositionWizard } from "../interfaces";
import { PositionWizard } from "../position-wizard";
import { PositionWizardEventTypes } from "../position-wizard/events";
import { OrderWizardEventTypes } from "./events";

export class OrderWizard extends EventEmitter implements IOrderWizard {
    static current: OrderWizard;

    protected _stateId: number = 0;
    get stateId() { return this._stateId; }

    protected _positions = new Array<IPositionWizard>();
    get positions() { return this._positions; }

    get currentPosition() {
        return this._editingPositions.length > 0 ? this._editingPositions[this._editingPositions.length - 1] : null;
    }

    protected _editingPositions = new Array<IPositionWizard>();
    get editingPositions() { return this._editingPositions; }

    protected _lastPosition: IPositionWizard | null = null;
    get lastPosition() { return this._lastPosition; }

    set currency(v: ICurrency) {
        if (this._currency !== v) {
            this._currency = v;
        }
    }

    set language(v: ICompiledLanguage) {
        if (this._language !== v) {
            this._language = v;
        }
    }

    protected _sum: number = 0;
    get sum() { return this._sum; }

    private onChangePosition = () => {
        this.update();

        this.emit(OrderWizardEventTypes.CHANGE);
    }

    private onEditPosition = (position: IPositionWizard) => {
        if (position.mode === PositionWizardModes.NEW && position.type === PositionWizardTypes.PRODUCT) {
            return;
        }

        if (position.groups.length > 0) {
            this.edit(position);
        }
    }

    constructor(protected _currency: ICurrency, protected _language: ICompiledLanguage) {
        super();
        OrderWizard.current = this;
    }

    protected recalculate() {
        let sum = 0;
        this._positions.forEach(p => {
            sum += p.sum;
        });

        this._sum = sum;
    }

    protected updateStateId(): void {
        this._stateId++;
    }

    protected update(): void {
        this.recalculate();
        this.updateStateId();
    }

    gotoPreviousGroup(): void {
        if (!this.currentPosition) {
            return;
        }

        if (this.currentPosition.groups.length > 0) {
            this.currentPosition.currentGroup--;

            this.updateStateId();

            this.emit(OrderWizardEventTypes.CHANGE);
        }
    }

    gotoNextGroup(): void {
        const currentPosition = this.currentPosition;
        if (!currentPosition) {
            return;
        }

        if (currentPosition.currentGroup < currentPosition.groups.length - 1) {
            currentPosition.currentGroup++;

            this.updateStateId();

            this.emit(OrderWizardEventTypes.CHANGE);
        } else {
            if (currentPosition.type !== PositionWizardTypes.MODIFIER
                && currentPosition.mode !== PositionWizardModes.EDIT) {
                this.add(currentPosition);
            }

            this.editCancel();
        }
    }

    findPosition(position: IPositionWizard): IPositionWizard | undefined {
        return this._positions.find(p => p.id === position.id);
    }

    new(): void {
        this._stateId = 1;
        this._sum = 0;

        this.emit(OrderWizardEventTypes.CHANGE);
    }

    editProduct(productNode: ICompiledMenuNode<ICompiledProduct>) {
        const position = new PositionWizard(PositionWizardModes.NEW, productNode, this._currency);
        position.addListener(PositionWizardEventTypes.EDIT, this.onEditPosition);
        position.quantity = 1;

        if (position.groups.length === 0) {
            this.add(position);
            position.dispose();
        } else {
            this._editingPositions.push(position);

            this.update();

            this.emit(OrderWizardEventTypes.CHANGE);
        }
    }

    edit(position: IPositionWizard) {
        this._editingPositions.push(position);

        this.update();

        this.emit(OrderWizardEventTypes.CHANGE);
    }

    editCancel(): void {
        const currentPosition = this.currentPosition;

        if (!currentPosition) {
            return;
        }

        currentPosition.currentGroup = 0;

        if (currentPosition.mode === PositionWizardModes.EDIT) {
            // etc
        } else
            if (currentPosition.mode === PositionWizardModes.NEW) {
                currentPosition.removeAllListeners();
                currentPosition.dispose();
            }
        this._editingPositions.splice(this._editingPositions.findIndex(ep => ep === currentPosition), 1);

        this.update();

        this.emit(OrderWizardEventTypes.CHANGE);
    }

    add(position: IPositionWizard): void {
        if (position.mode === PositionWizardModes.EDIT) {
            throw Error("Position with mode \"edit\" can not be added to order.");
        }

        if (position.type === PositionWizardTypes.MODIFIER) {
            throw Error("Position with type \"modifier\" can not be added to order.");
        }

        const editedPosition = PositionWizard.from(position, PositionWizardModes.EDIT);
        this._positions.push(editedPosition);
        editedPosition.addListener(PositionWizardEventTypes.CHANGE, this.onChangePosition);
        editedPosition.addListener(PositionWizardEventTypes.EDIT, this.onEditPosition);

        this._lastPosition = editedPosition;

        this.update();

        this.emit(OrderWizardEventTypes.CHANGE);
    }

    remove(position: IPositionWizard): void {
        this._positions.splice(this._positions.findIndex(p => p.id === position.id), 1);

        position.removeAllListeners();
        position.dispose();

        this.update();

        this.emit(OrderWizardEventTypes.CHANGE);
    }

    reset(): void {
        this._positions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });
        this._positions = [];

        this._editingPositions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });
        this._editingPositions = [];

        this._lastPosition = null;

        this._stateId = 0;
        this._sum = 0;

        this.emit(OrderWizardEventTypes.CHANGE);
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

        this._editingPositions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });

        this._lastPosition = null;
    }
}