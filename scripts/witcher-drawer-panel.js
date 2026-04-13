const ARGON = CONFIG.ARGON;

const SKILL_GROUPS = [
    { key: "int",  labelKey: "WITCHER.Actor.Stat.Int"  },
    { key: "ref",  labelKey: "WITCHER.Actor.Stat.Ref"  },
    { key: "dex",  labelKey: "WITCHER.Actor.Stat.Dex"  },
    { key: "body", labelKey: "WITCHER.Actor.Stat.Body" },
    { key: "emp",  labelKey: "WITCHER.Actor.Stat.Emp"  },
    { key: "cra",  labelKey: "WITCHER.Actor.Stat.Cra"  },
    { key: "will", labelKey: "WITCHER.Actor.Stat.Will" },
];

export class WitcherDrawerPanel extends ARGON.DRAWER.DrawerPanel {

    get title() {
        return game.i18n.localize("WITCHER.HUD.Skills");
    }

    get categories() {
        const actor = this.actor;
        const skills = actor.system.skills;
        if (!skills) return [];

        const categories = [];

        for (const group of SKILL_GROUPS) {
            const groupSkills = skills[group.key];
            if (!groupSkills) continue;

            const buttons = Object.entries(groupSkills).map(([key, skill]) => {
                const label = game.i18n.localize(skill.label);
                const value = String(skill.modifiedValue ?? skill.value ?? 0);
                return new ARGON.DRAWER.DrawerButton([
                    {
                        label,
                        onClick: () => actor.rollSkill(key),
                    },
                    {
                        label: value,
                        style: "display:flex;justify-content:flex-end;",
                        onClick: () => actor.rollSkill(key),
                    },
                ]);
            });

            if (buttons.length) {
                categories.push({
                    gridCols: "7fr 1fr",
                    captions: [
                        { label: game.i18n.localize(group.labelKey) },
                        { label: "" },
                    ],
                    buttons,
                });
            }
        }

        return categories;
    }
}
