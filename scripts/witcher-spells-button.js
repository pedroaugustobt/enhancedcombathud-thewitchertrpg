import { ICONS } from "./module.js";
import { WitcherItemButton } from "./witcher-weapon-button.js";

const ARGON = CONFIG.ARGON;

export class WitcherMagicPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {

    get label() {
        return game.i18n.localize("WITCHER.HUD.Magic");
    }

    get icon() {
        return ICONS.magic;
    }

    async _getPanel() {
        const actor = this.actor;
        const { AccordionPanel, AccordionPanelCategory } = ARGON.MAIN.BUTTON_PANELS.ACCORDION;
        const categories = [];

        const signs = actor.getList("spell").filter(s => s.system.class === "Witcher");
        if (signs.length > 0) {
            categories.push(new AccordionPanelCategory({
                label: game.i18n.localize("WITCHER.HUD.Signs"),
                buttons: signs.map(s => new WitcherItemButton({ item: s })),
            }));
        }

        const spells = actor.getList("spell").filter(s => s.system.class !== "Witcher");
        if (spells.length > 0) {
            categories.push(new AccordionPanelCategory({
                label: game.i18n.localize("WITCHER.HUD.Spells"),
                buttons: spells.map(s => new WitcherItemButton({ item: s })),
            }));
        }

        const hexes = actor.getList("hex");
        if (hexes.length > 0) {
            categories.push(new AccordionPanelCategory({
                label: game.i18n.localize("WITCHER.HUD.Hexes"),
                buttons: hexes.map(h => new WitcherItemButton({ item: h })),
            }));
        }

        const rituals = actor.getList("ritual");
        if (rituals.length > 0) {
            categories.push(new AccordionPanelCategory({
                label: game.i18n.localize("WITCHER.HUD.Rituals"),
                buttons: rituals.map(r => new WitcherItemButton({ item: r })),
            }));
        }

        if (categories.length === 0) {
            categories.push(new AccordionPanelCategory({
                label: game.i18n.localize("WITCHER.HUD.NoMagic"),
                buttons: [],
            }));
        }

        return new AccordionPanel({
            accordionPanelCategories: categories,
            id: `witcher-magic-panel-${actor.id}`,
        });
    }
}
