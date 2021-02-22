import { IBusinessPeriod, IScenario, ScenarioCommonActionTypes, ScenarioProductActionTypes, ScenarioSelectorActionTypes } from "@djonnyx/tornado-types";
import { IPositionWizard, IPositionWizardGroup } from "../interfaces";
import { MenuNode } from "../menu/MenuNode";

interface IPeriodicData {
    businessPeriods: Array<IBusinessPeriod>;
}

export class ScenarioProcessing {
    static getNormalizedDownLimit(value: number): number {
        return value < 0 ? 0 : value;
    }

    static getNormalizedUpLimit(value: number): number {
        return value <= 0 ? Number.MAX_SAFE_INTEGER : value;
    }

    static setupPosition(position: IPositionWizard): void {
        const scenarios: Array<IScenario> = position.__node__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                if (s.active) {
                    ScenarioProcessing.setupPositionLimits(position, s);
                }
            });
        }

        if (!!position.groups && position.groups.length > 0) {
            position.groups.forEach(g => {
                if (!!g.positions && g.positions.length > 0) {
                    g.positions.forEach(p => {
                        ScenarioProcessing.setupPosition(p);

                        g.__node__.scenarios.forEach(s => {
                            if (s.active) {
                                // Мержинг лимитов группы
                                ScenarioProcessing.mergePositionLimitsWithGroup(p, s);
                            }
                        });
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
        const scenarios: Array<IScenario> = position.__node__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                if (s.active) {
                    switch (s.action) {
                        case ScenarioProductActionTypes.DOWN_LIMIT: {
                            const normalizedValue = ScenarioProcessing.getNormalizedDownLimit(parseInt(s.value as any));
                            const isValid = position.quantity >= normalizedValue;
                            if (!isValid) {
                                isPositionValid = false;
                            }
                            break;
                        }
                        case ScenarioProductActionTypes.UP_LIMIT: {
                            const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));
                            const isValid = position.quantity <= normalizedValue;
                            if (!isValid) {
                                isPositionValid = false;
                            }
                            break;
                        }
                    }
                }
            });
        }

        if (!!position.groups && position.groups.length > 0) {
            position.groups.forEach(g => {
                let isGroupValid = true;
                let isModifiersValid = true;
                if (!!g.__node__.scenarios && g.__node__.scenarios.length > 0) {
                    let groupTotalQnt: number = -1;
                    g.__node__.scenarios.forEach(s => {
                        if (s.active) {
                            switch (s.action) {
                                case "min-usage": {//ScenarioSelectorActionTypes.MIN_USAGE: {
                                    if (groupTotalQnt === -1) {
                                        groupTotalQnt = ScenarioProcessing.getTotalProductsQuantity(g);
                                    }
                                    const val = ScenarioProcessing.getNormalizedDownLimit(parseInt(s.value as any));
                                    /*const diff = val - groupTotalQnt;
                                    g.positions.forEach(p => {
                                        p.actualUpLimit = Math.min(diff, p.upLimit);
                                    });*/
                                    const isValid = groupTotalQnt >= val;
                                    if (!isValid) {
                                        isGroupValid = false;
                                    }
                                    break;
                                }
                                case ScenarioSelectorActionTypes.MAX_USAGE: {
                                    if (groupTotalQnt === -1) {
                                        groupTotalQnt = ScenarioProcessing.getTotalProductsQuantity(g);
                                    }
                                    const val = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));

                                    const diff = val - groupTotalQnt;
                                    g.positions.forEach(p => {
                                        // динамическое обновление верхнего предела
                                        p.actualUpLimit = Math.min(p.quantity + diff, p.upLimit);
                                    });

                                    const isValid = groupTotalQnt <= val;
                                    if (!isValid) {
                                        isGroupValid = false;
                                    }
                                    break;
                                }
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

    static normalizeTime(time?: number): number {
        const date = time !== undefined ? new Date(time) : new Date();

        const dayTime = (time !== undefined ? date.getUTCMinutes() : date.getMinutes()) * 60000
            + (time !== undefined ? date.getUTCHours() : date.getHours()) * 3600000;

        return dayTime;
    }

    static checkBusinessPeriod = (ids: Array<string>, periodicData: IPeriodicData): boolean => {
        if (!ids || !ids.length) {
            return false;
        }

        const bps = periodicData.businessPeriods.filter(bp => ids.indexOf(bp.id || "") > -1);
        const activities = new Array<boolean>();
        for (let i = 0, l1 = bps.length; i < l1; i++) {
            const bp = bps[i];
            for (let j = 0, l2 = bp.schedule.length; j < l2; j++) {
                const schedule = bp.schedule[j];

                const date = new Date();
                const current = ScenarioProcessing.normalizeTime();

                const start = ScenarioProcessing.normalizeTime(schedule?.time?.start);
                const end = ScenarioProcessing.normalizeTime(schedule?.time?.end);

                const isDayChecked = !!schedule.weekDays && schedule.weekDays.indexOf(date.getDay()) > -1;
                const isTimeChecked = start <= current && current <= end;

                activities.push(!!isDayChecked && !!isTimeChecked);
            }
        }

        let result = false;
        if (activities.length > 0) {
            activities.forEach(a => {
                if (a) {
                    result = true;
                }
            });
        }

        return result;
    }

    /**
     * Применение периодичных сценариев 
     */
    static applyPeriodicScenariosForNode(node: MenuNode, periodicData: IPeriodicData): void {
        const scenarios: Array<IScenario> = node.__rawNode__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                if (s.active) {
                    switch (s.action) {
                        case ScenarioCommonActionTypes.VISIBLE_BY_BUSINESS_PERIOD: {
                            const isActive = ScenarioProcessing.checkBusinessPeriod(s.value as Array<string>, periodicData);
                            node.active = isActive;
                            break;
                        }
                    }
                }
            });
        }

        if (!!node.children && node.children.length > 0) {
            node.children.forEach(c => {
                if (!!c.__rawNode__.scenarios && c.__rawNode__.scenarios.length > 0) {
                    c.__rawNode__.scenarios.forEach(s => {
                        if (s.active) {
                            switch (s.action) {
                                case ScenarioCommonActionTypes.VISIBLE_BY_BUSINESS_PERIOD: {
                                    const isActive = ScenarioProcessing.checkBusinessPeriod(s.value as Array<string>, periodicData);
                                    c.active = isActive;
                                    break;
                                }
                            }
                        }
                    });
                }

                c.children.forEach(p => {
                    ScenarioProcessing.applyPeriodicScenariosForNode(p, periodicData);
                });
            });
        }
    }

    private static setupPositionLimits(p: IPositionWizard, s: IScenario): void {
        if (s.active) {
            switch (s.action) {
                case ScenarioProductActionTypes.DOWN_LIMIT: {
                    const normalizedValue = ScenarioProcessing.getNormalizedDownLimit(parseInt(s.value as any));
                    p.downLimit = normalizedValue;

                    // Выставляется дефолтовое минимальное количество,
                    // которое нельзя уменьшать. Это формирование позиции
                    // с предустановленным выбором
                    p.quantity = p.downLimit;
                    break;
                }
                case ScenarioProductActionTypes.UP_LIMIT: {
                    const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));
                    p.upLimit = normalizedValue;
                    break;
                }
            }
        }
    }

    /**
     * Мержинг пределов
     * Мержится только верхний предел
     */
    private static mergePositionLimitsWithGroup(p: IPositionWizard, s: IScenario): void {
        if (s.active) {
            switch (s.action) {
                case "min-usage": {//ScenarioSelectorActionTypes.MIN_USAGE: {
                    // p.downLimit = Math.max(p.downLimit, normalizedValue);
                    break;
                }
                case ScenarioSelectorActionTypes.MAX_USAGE: {
                    const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));
                    p.upLimit = Math.min(p.upLimit, normalizedValue);
                    break;
                }
            }
        }
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