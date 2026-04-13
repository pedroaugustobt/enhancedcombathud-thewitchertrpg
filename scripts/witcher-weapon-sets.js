import { MODULE_ID } from "./module.js";

const ARGON = CONFIG.ARGON;

export class WitcherWeaponSets extends ARGON.WeaponSets {

    get template() {
        return `modules/${MODULE_ID}/templates/witcherWeaponSets.hbs`;
    }

    async getDefaultSets() {
        const equipped = this.actor
            .getList("weapon")
            .filter(w => w.system.equipped && !w.system.isAmmo);

        return {
            1: { primary: equipped[0]?.uuid ?? null, secondary: null },
            2: { primary: equipped[1]?.uuid ?? null, secondary: null },
            3: { primary: equipped[2]?.uuid ?? null, secondary: null },
            4: { primary: equipped[3]?.uuid ?? null, secondary: null },
            5: { primary: equipped[4]?.uuid ?? null, secondary: null },
        };
    }

    async _onSetChange({ sets, active }) {
        const activeSet = sets[active];
        const allWeapons = this.actor.getList("weapon").filter(w => !w.system.isAmmo);

        const updates = [];
        for (const weapon of allWeapons) {
            const inActiveSet = weapon === activeSet?.primary;
            if (weapon.system.equipped !== inActiveSet) {
                updates.push({ _id: weapon.id, "system.equipped": inActiveSet });
            }
        }
        if (updates.length) {
            await this.actor.updateEmbeddedDocuments("Item", updates);
            ui.ARGON?.refresh();
        }
    }
}
