import { ICONS } from "./module.js";

const ARGON = CONFIG.ARGON;

export class WitcherItemButton extends ARGON.MAIN.BUTTONS.ItemButton {

    get label() {
        return this.item.name;
    }

    get icon() {
        return this.item.img;
    }

    /**
     * For weapons with ammunition, it displays the quantity.
     * Spells, hexes, rituals, and signs do not display quantity.
     */
    get quantity() {
        const type = this.item.type;
        if (type === "spell" || type === "hex" || type === "ritual") return null;
        const sys = this.item.system;
        if (sys.quantity != null && Number.isNumeric(sys.quantity)) {
            return sys.quantity;
        }
        return null;
    }

    get targets() {
        return this.item?.type === "weapon" ? 1 : 0;
    }

    async _onLeftClick(_event) {
        const { item, actor } = this;
        if (item.isConsumable) {
            this._tooltip?._destroy();
            this._tooltip = null;

            const itemId = item.id;
            const itemUuid = item.uuid;
            const wasStored = !!item.system?.isStored;
            const quantity = Number(item.system?.quantity) || 0;

            if (wasStored && quantity <= 1) {
                const containers = actor.items.filter(
                    i => Array.isArray(i.system?.content) && i.system.content.includes(itemUuid)
                );
                for (const container of containers) {
                    const cleaned = container.system.content.filter(uuid => uuid !== itemUuid);
                    await container.update({ "system.content": cleaned });
                }
            }

            await actor.useItem(itemId);

            return;
        }
        
        switch (item.type) {
            case "weapon":
                await actor.weaponAttack(item);
                break;
            case "spell":
            case "hex":
            case "ritual":
                await actor.castSpell(item);
                break;
            default:
                item.sheet.render(true);
        }
    }

    async _onRightClick(_event) {
        this.item.sheet.render(true);
    }

    get hasTooltip() {
        return ["weapon", "spell", "hex", "ritual"].includes(this.item?.type) || this.item?.isConsumable;
    }

    get tooltipOrientation() {
        return TooltipManager.TOOLTIP_DIRECTIONS.RIGHT;
    }

    async getTooltipData() {
        const item = this.item;
        if (!item) return null;

        const sys = item.system;

        const detail = (labelKey, value) => {
            if (value === undefined || value === null || value === "") return null;
            return { label: game.i18n.localize(labelKey), value };
        };

        const coerce = (v) => {
            if (!v) return "";
            if (typeof v === "string") return v;
            if (typeof v === "object" && "value" in v) return v.value ?? "";
            return String(v);
        };

        if (item.type === "weapon") {
            return null;
        }

        if (item.isConsumable) {
            return {
                title: item.name,
                description: coerce(sys.effect) || coerce(sys.description),
                details: [
                    detail("WITCHER.HUD.Tooltip.Time", sys.time),
                    detail("WITCHER.HUD.Tooltip.Toxicity", sys.toxicity),
                ].filter(Boolean),
            };
        }

        return {
            title: item.name,
            description: coerce(sys.effect),
            details: [
                detail("WITCHER.HUD.Tooltip.StaminaCost", sys.stamina),
                detail("WITCHER.HUD.Tooltip.Range", sys.range),
                detail("WITCHER.HUD.Tooltip.Duration", sys.duration),
                detail("WITCHER.HUD.Tooltip.Defense", sys.defence),
                detail("WITCHER.HUD.Tooltip.PreparationTime", sys.preparationTime),
                detail("WITCHER.HUD.Tooltip.DifficultyCheck", sys.difficultyCheck),
            ].filter(Boolean),
        };
    }
}

export class WitcherVerbalCombatButton extends ARGON.MAIN.BUTTONS.ActionButton {

    get label() {
        return game.i18n.localize("WITCHER.HUD.VerbalCombat");
    }

    get icon() {
        return ICONS.verbalCombat;
    }

    async _onLeftClick(_event) {
        await this.actor.verbalCombat();
    }
}
