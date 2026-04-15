import { hpColor } from "./module.js";

const ARGON = CONFIG.ARGON;

export class WitcherPortraitPanel extends ARGON.PORTRAIT.PortraitPanel {

    get description() {
        const actor = this.actor;
        if (actor.type === "character") {
            const profession = actor.getList("profession")[0]?.name ?? "";
            return profession;
        }
        if (actor.type === "monster") {
            return game.i18n.localize("WITCHER.HUD.Monster");
        }
        return "";
    }

    get isDead() {
        return (this.actor.system.derivedStats?.hp?.value ?? 1) <= 0;
    }

    async getStatBlocks() {
        const hp = this.actor.system.derivedStats.hp ?? { value: 0, max: 0 };
        const sta = this.actor.system.derivedStats.sta ?? { value: 0, max: 0 };
        const vigor = this.actor.system.derivedStats.vigor ?? { value: 0, max: 0 };
        const adrenaline = this.actor.system.adrenaline?.value ?? null;
        const luck = this.actor.system.stats?.luck?.value ?? null;

        const blocks = [
            [
                { text: game.i18n.localize("WITCHER.HUD.Stat.HP"),  color: "#999999" },
                { text: `${hp.value}`,  color: hpColor(hp.value, hp.max), id: "argon-hp-value" },
                { text: ` / ${hp.max}`, color: "#777777" },
            ],
            [
                { text: game.i18n.localize("WITCHER.HUD.Stat.STA"), color: "#999999" },
                { text: `${sta.value}`,  color: "#4fc3f7", id: "argon-sta-value" },
                { text: ` / ${sta.max}`, color: "#777777" },
            ],
        ];

        if (vigor.max > 0) {
            blocks.push([
                { text: game.i18n.localize("WITCHER.HUD.Stat.VIG"), color: "#999999" },
                { text: `${vigor.max}`,  color: "#ce93d8", id: "argon-vigor-value" },
                { text: ` / ${vigor.value}`, color: "#777777" },
            ]);
        }

        if (adrenaline !== null) {
            blocks.push([
                { text: game.i18n.localize("WITCHER.HUD.Stat.ADR"), color: "#999999" },
                { text: `${adrenaline}`, color: "#ff7043", id: "argon-adrenaline-value" },
            ]);
        }

        if (luck !== null) {
            blocks.push([
                { text: game.i18n.localize("WITCHER.HUD.Stat.LCK"), color: "#999999" },
                { text: `${luck}`, color: "#ffd54f", id: "argon-luck-value" },
            ]);
        }

        return blocks;
    }

    async _renderInner(data) {
        await super._renderInner(data);

        const SECONDARY = new Set(["argon-vigor-value", "argon-adrenaline-value", "argon-luck-value"]);
        const blocks = [...this.element.querySelectorAll(".portrait-stat-block:not(.player-details)")];
        const secondary = blocks.filter(b => SECONDARY.has(b.querySelector("[id]")?.id));
        const primary = blocks.filter(b => !secondary.includes(b));

        if (secondary.length === 0) return;

        const wrapper = document.createElement("div");
        wrapper.className = "witcher-stats-wrapper";

        const topRow = document.createElement("div");
        topRow.className = "witcher-stat-row";
        const btmRow = document.createElement("div");
        btmRow.className = "witcher-stat-row";

        for (const b of secondary) topRow.appendChild(b);
        for (const b of primary) btmRow.appendChild(b);

        wrapper.appendChild(topRow);
        wrapper.appendChild(btmRow);
        this.element.appendChild(wrapper);
    }
}
