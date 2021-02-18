import { IScenario, ScenarioProductActionTypes, ScenarioSelectorActionTypes } from "@djonnyx/tornado-types";
import { IPositionWizard, IPositionWizardGroup } from "../interfaces";

export class ScenarioProcessing {
    static getNormalizedDownLimit(value: number): number {
        return value < 0 ? 0 : value;
    }
    
    static getNormalizedUpLimit(value: number): number {
        return value <= 0 ? Number.MAX_SAFE_INTEGER : value;
    }

    static setupPosition(position: IPositionWizard): void {
        const scenarios: Array<IScenario> = position.__productNode__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                switch (s.action) {
                    case ScenarioProductActionTypes.DOWN_LIMIT: {
                        const normalizedValue = ScenarioProcessing.getNormalizedDownLimit(Number(s.value));
                        position.downLimit = normalizedValue;

                        // Выставляется дефолтовое минимальное количество,
                        // которое нельзя уменьшать. Это формирование позиции
                        // с предустановленным выбором
                        position.quantity = position.downLimit;
                        break;
                    }
                    case ScenarioProductActionTypes.UP_LIMIT: {
                        const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(Number(s.value));
                        position.upLimit = normalizedValue;
                        break;
                    }
                }
            });
        }

        if (!!position.groups && position.groups.length > 0) {
            position.groups.forEach(g => {

                if (!!g.__groupNode__.scenarios && g.__groupNode__.scenarios.length > 0) {
                    g.__groupNode__.scenarios.forEach(s => {
                        if (!!g.positions && g.positions.length > 0) {
                            g.positions.forEach(p => {
                                ScenarioProcessing.setupPosition(p);

                                // Мержинг лимитов группы
                                switch (s.action) {
                                    case "min-usage": {//ScenarioSelectorActionTypes.MIN_USAGE: {
                                        const normalizedValue = ScenarioProcessing.getNormalizedDownLimit(Number(s.value));
                                        p.downLimit = Math.max(p.downLimit, normalizedValue);
                                        break;
                                    }
                                    case ScenarioSelectorActionTypes.MAX_USAGE: {
                                        const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(Number(s.value));
                                        p.upLimit = Math.min(p.upLimit, normalizedValue);
                                        break;
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    /**
     * Валидация состояния позиции
     */
    static validatePosition(position: IPositionWizard): boolean {
        let isPositionValid = true;
        const scenarios: Array<IScenario> = position.__productNode__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                switch (s.action) {
                    case ScenarioProductActionTypes.DOWN_LIMIT: {
                        const normalizedValue = ScenarioProcessing.getNormalizedDownLimit(Number(s.value));
                        const isValid = position.quantity >= normalizedValue;
                        if (!isValid) {
                            isPositionValid = false;
                        }
                        break;
                    }
                    case ScenarioProductActionTypes.UP_LIMIT: {
                        const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(Number(s.value));
                        const isValid = position.quantity <= normalizedValue;
                        if (!isValid) {
                            isPositionValid = false;
                        }
                        break;
                    }
                }
            });
        }

        if (!!position.groups && position.groups.length > 0) {
            position.groups.forEach(g => {
                let isGroupValid = true;
                let isModifiersValid = true;
                if (!!g.__groupNode__.scenarios && g.__groupNode__.scenarios.length > 0) {
                    let groupTotalQnt: number = -1;
                    g.__groupNode__.scenarios.forEach(s => {
                        switch (s.action) {
                            case "min-usage": {//ScenarioSelectorActionTypes.MIN_USAGE: {
                                if (groupTotalQnt === -1) {
                                    groupTotalQnt = ScenarioProcessing.getTotalProductsQuantity(g);
                                }
                                const isValid = groupTotalQnt >= Number(s.value);
                                if (!isValid) {
                                    isGroupValid = false;
                                }
                                break;
                            }
                            case ScenarioSelectorActionTypes.MAX_USAGE: {
                                if (groupTotalQnt === -1) {
                                    groupTotalQnt = ScenarioProcessing.getTotalProductsQuantity(g);
                                }
                                const isValid = groupTotalQnt <= Number(s.value);
                                if (!isValid) {
                                    isGroupValid = false;
                                }
                                break;
                            }
                        }
                    });
                }

                isModifiersValid = ScenarioProcessing.isModifiersValid(g);

                // Выставляется флаг значения валидации группы продукта
                g.isValid = isGroupValid && isModifiersValid;

                if (!g.isValid) {
                    isPositionValid = false;
                }
            });
        }

        // Выставляется флаг значения валидации контейнера продукта
        position.isValid = isPositionValid;

        return position.isValid;
    }

    private static isModifiersValid(group: IPositionWizardGroup): boolean {
        let result = true;
        for (let i = 0, l = group.positions.length; i < l; i++) {
            const p = group.positions[i];
            if (p.quantity > 0) {
                const isModifierValid = ScenarioProcessing.validatePosition(p);
                if (!isModifierValid) {
                    result = false;
                }
                p.isValid = isModifierValid;
            } else {
                p.isValid = true;
            }
        }

        return result;
    }

    private static getTotalProductsQuantity(group: IPositionWizardGroup): number {
        let result = 0;

        if (!!group.positions && group.positions.length > 0) {
            group.positions.forEach(p => {
                result += p.quantity;
            })
        }

        return result;
    }
}