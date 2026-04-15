import { ICONS, MODULE_ID } from "./module.js";
import { WitcherItemButton, WitcherVerbalCombatButton } from "./witcher-weapon-button.js";
import { WitcherMagicPanelButton } from "./witcher-spells-button.js";

const ARGON = CONFIG.ARGON;

// ===================================================================
// BRAWLING MANEUVER BUTTON
// ===================================================================
class WitcherBrawlingActionButton extends ARGON.MAIN.BUTTONS.ItemButton {

    constructor({ labelKey, descriptionKey, icon = ICONS.brawling }) {
        super({ item: { name: game.i18n.localize(labelKey), img: icon } });
        this._labelKey = labelKey;
        this._descriptionKey = descriptionKey;
        this._icon = icon;
    }

    get label() {
        return game.i18n.localize(this._labelKey);
    }

    get icon() {
        return this._icon;
    }

    get hasTooltip() {
        return true;
    }

    get tooltipOrientation() {
        return TooltipManager.TOOLTIP_DIRECTIONS.RIGHT;
    }

    async getTooltipData() {
        return {
            title: game.i18n.localize(this._labelKey),
            description: game.i18n.localize(this._descriptionKey),
        };
    }

    async _onLeftClick(_event) {
        const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        ChatMessage.create({
            speaker,
            content: `<p><strong>${this.actor.name}</strong> ${game.i18n.localize("WITCHER.HUD.Brawling.UsesManeuver")} <strong>${game.i18n.localize(this._labelKey)}</strong>.</p>`,
        });
    }
}

// ===================================================================
// PANEL: BRAWLING
// ===================================================================
class WitcherBrawlingPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {

    get label() {
        return game.i18n.localize("WITCHER.HUD.Brawling.Label");
    }

    get icon() {
        return ICONS.brawling;
    }

    async _getPanel() {
        const { AccordionPanel, AccordionPanelCategory } = ARGON.MAIN.BUTTON_PANELS.ACCORDION;

        const maneuvers = [
            { labelKey: "WITCHER.HUD.Brawling.PushKick",  descriptionKey: "WITCHER.HUD.Brawling.PushKickDesc",  icon: ICONS.brawling },
            { labelKey: "WITCHER.HUD.Brawling.Disarm",    descriptionKey: "WITCHER.HUD.Brawling.DisarmDesc",    icon: ICONS.brawling },
            { labelKey: "WITCHER.HUD.Brawling.Grapple",   descriptionKey: "WITCHER.HUD.Brawling.GrappleDesc",   icon: ICONS.brawling },
            { labelKey: "WITCHER.HUD.Brawling.Pin",       descriptionKey: "WITCHER.HUD.Brawling.PinDesc",       icon: ICONS.brawling },
            { labelKey: "WITCHER.HUD.Brawling.Choke",     descriptionKey: "WITCHER.HUD.Brawling.ChokeDesc",     icon: ICONS.brawling },
            { labelKey: "WITCHER.HUD.Brawling.Throw",     descriptionKey: "WITCHER.HUD.Brawling.ThrowDesc",     icon: ICONS.brawling },
            { labelKey: "WITCHER.HUD.Brawling.Trip",      descriptionKey: "WITCHER.HUD.Brawling.TripDesc",      icon: ICONS.brawling },
        ];

        return new AccordionPanel({
            accordionPanelCategories: [
                new AccordionPanelCategory({
                    label: game.i18n.localize("WITCHER.HUD.Brawling.Label"),
                    buttons: maneuvers.map(m => new WitcherBrawlingActionButton(m)),
                }),
            ],
            id: `witcher-brawling-panel-${this.actor.id}`,
        });
    }
}

// ===================================================================
// PANEL: SPECIAL ATTACKS
// ===================================================================
class WitcherSpecialAttacksPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {

    get label() {
        return game.i18n.localize("WITCHER.HUD.SpecialAttacks.Label");
    }

    get icon() {
        return ICONS.specialAttacks;
    }

    async _getPanel() {
        const { AccordionPanel, AccordionPanelCategory } = ARGON.MAIN.BUTTON_PANELS.ACCORDION;

        const attacks = [
            { labelKey: "WITCHER.HUD.SpecialAttacks.PommelStrike", descriptionKey: "WITCHER.HUD.SpecialAttacks.PommelStrikeDesc", icon: ICONS.specialAttacks },
            { labelKey: "WITCHER.HUD.SpecialAttacks.Disarm",       descriptionKey: "WITCHER.HUD.SpecialAttacks.DisarmDesc",       icon: ICONS.specialAttacks },
            { labelKey: "WITCHER.HUD.SpecialAttacks.Trip",         descriptionKey: "WITCHER.HUD.SpecialAttacks.TripDesc",         icon: ICONS.specialAttacks },
            { labelKey: "WITCHER.HUD.SpecialAttacks.Feint",        descriptionKey: "WITCHER.HUD.SpecialAttacks.FeintDesc",        icon: ICONS.specialAttacks },
        ];

        return new AccordionPanel({
            accordionPanelCategories: [
                new AccordionPanelCategory({
                    label: game.i18n.localize("WITCHER.HUD.SpecialAttacks.Label"),
                    buttons: attacks.map(a => new WitcherBrawlingActionButton(a)),
                }),
            ],
            id: `witcher-special-attacks-panel-${this.actor.id}`,
        });
    }
}

// ===================================================================
// PANEL: CONSUMABLE ITEMS
// ===================================================================
class WitcherConsumablesPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {

    get label() {
        return game.i18n.localize("WITCHER.HUD.UseItem");
    }

    get icon() {
        return ICONS.useItem;
    }

    async _getPanel() {
        const { AccordionPanel, AccordionPanelCategory } = ARGON.MAIN.BUTTON_PANELS.ACCORDION;

        const consumables = this.actor.items.filter(i => i.isConsumable && i.type !== "mutagen");
        const buttons = consumables.map(i => new WitcherItemButton({ item: i }));

        const category = buttons.length > 0
            ? new AccordionPanelCategory({ label: game.i18n.localize("WITCHER.HUD.Consumables"), buttons })
            : new AccordionPanelCategory({ label: game.i18n.localize("WITCHER.HUD.NoConsumables"), buttons: [] });

        return new AccordionPanel({
            accordionPanelCategories: [category],
            id: `witcher-consumables-panel-${this.actor.id}`,
        });
    }
}

// ===================================================================
// SPECIAL ACTION BUTTON (full-round actions)
// ===================================================================
class WitcherSpecialActionButton extends ARGON.MAIN.BUTTONS.ActionButton {

    constructor({ labelKey, icon, colorScheme = 0, onClick, tooltipDescFn }) {
        super();
        this._labelKey = labelKey;
        this._icon = icon;
        this._colorScheme = colorScheme;
        this._onClick = onClick;
        this._tooltipDescFn = tooltipDescFn ?? null;
    }

    get label() {
        return game.i18n.localize(this._labelKey);
    }

    get icon() {
        return this._icon;
    }

    get colorScheme() {
        return this._colorScheme;
    }

    get hasTooltip() {
        return this._tooltipDescFn !== null;
    }

    get tooltipOrientation() {
        return TooltipManager.TOOLTIP_DIRECTIONS.UP;
    }

    async getTooltipData() {
        return {
            title: game.i18n.localize(this._labelKey),
            description: this._tooltipDescFn(this.actor),
        };
    }

    async _onLeftClick(_event) {
        if (typeof this._onClick === "function") {
            await this._onClick(this.actor);
        }
    }
}

// ===================================================================
// END TURN BUTTON
// ===================================================================
class WitcherEndTurnButton extends ARGON.MAIN.BUTTONS.ActionButton {

    get label() {
        return game.i18n.localize("WITCHER.HUD.EndTurn");
    }

    get icon() {
        return ICONS.endTurn;
    }

    get colorScheme() {
        return 4;
    }

    async _onLeftClick(_event) {
        await game.combat?.nextTurn();
    }
}

// ===================================================================
// HELPERS
// ===================================================================
function buildWeaponButtons(actor) {
    const buttons = [];
    const weapons = actor.getList("weapon").filter(w => w.system.equipped && !w.system.isAmmo);
    for (const weapon of weapons) {
        buttons.push(new WitcherItemButton({ item: weapon }));
    }
    buttons.push(new WitcherVerbalCombatButton());
    return buttons;
}

function makeFullRoundButtons() {
    const speaker = (actor) => ChatMessage.getSpeaker({ actor });

    const buttons = [
        new WitcherSpecialActionButton({
            labelKey: "WITCHER.HUD.ActivelyDodge",
            icon: ICONS.dodge,
            colorScheme: 2,
            tooltipDescFn: () => game.i18n.localize("WITCHER.HUD.ActivelyDodgeMsg"),
            onClick: async (actor) => {
                ChatMessage.create({
                    speaker: speaker(actor),
                    content: `<p><strong>${actor.name}</strong> ${game.i18n.localize("WITCHER.HUD.ActivelyDodgeMsg")}</p>`,
                });
            },
        }),
        new ARGON.MAIN.BUTTONS.SplitButton(
            new WitcherSpecialActionButton({
                labelKey: "WITCHER.HUD.Run",
                icon: ICONS.run,
                colorScheme: 2,
                tooltipDescFn: (actor) => {
                    const speed = actor.system.derivedStats?.run?.value ?? 0;
                    return `${game.i18n.localize("WITCHER.HUD.RunMsg")} ${speed}m.`;
                },
                onClick: async (actor) => {
                    const runSpeed = actor.system.derivedStats?.run?.value ?? 0;
                    ChatMessage.create({
                        speaker: speaker(actor),
                        content: `<p><strong>${actor.name}</strong> ${game.i18n.localize("WITCHER.HUD.RunMsg")} <strong>${runSpeed}m</strong>.</p>`,
                    });
                },
            }),
            new WitcherSpecialActionButton({
                labelKey: "WITCHER.HUD.Aim",
                icon: ICONS.aim,
                colorScheme: 2,
                tooltipDescFn: () => game.i18n.localize("WITCHER.HUD.AimMsg"),
                onClick: async (actor) => {
                    ChatMessage.create({
                        speaker: speaker(actor),
                        content: `<p><strong>${actor.name}</strong> ${game.i18n.localize("WITCHER.HUD.AimMsg")}</p>`,
                    });
                },
            }),
        ),
        new ARGON.MAIN.BUTTONS.SplitButton(
            new WitcherSpecialActionButton({
                labelKey: "WITCHER.HUD.Recovery",
                icon: ICONS.recovery,
                colorScheme: 2,
                tooltipDescFn: (actor) => {
                    const rec = actor.system.derivedStats?.rec?.value ?? 0;
                    return `${game.i18n.localize("WITCHER.HUD.RecoveryMsg")} ${rec}.`;
                },
                onClick: async (actor) => {
                    await actor.sheet._onRecoverSta();
                    const recMsg = actor.system.derivedStats?.rec?.value ?? 0;
                    ChatMessage.create({
                        speaker: speaker(actor),
                        content: `<p><strong>${actor.name}</strong> ${game.i18n.localize("WITCHER.HUD.RecoveryMsg")} <strong>${recMsg}</strong>.</p>`,
                    });
                },
            }),
            new WitcherSpecialActionButton({
                labelKey: "WITCHER.HUD.Charge",
                icon: ICONS.charge,
                colorScheme: 2,
                tooltipDescFn: () => game.i18n.localize("WITCHER.HUD.ChargeMsg"),
                onClick: async (actor) => {
                    ChatMessage.create({
                        speaker: speaker(actor),
                        content: `<p><strong>${actor.name}</strong> ${game.i18n.localize("WITCHER.HUD.ChargeMsg")}</p>`,
                    });
                },
            }),
        ),
        new WitcherSpecialActionButton({
            labelKey: "WITCHER.HUD.HoldingAction",
            icon: ICONS.holdingAction,
            colorScheme: 2,
            tooltipDescFn: () => game.i18n.localize("WITCHER.HUD.HoldingActionMsg"),
            onClick: async (actor) => {
                ChatMessage.create({
                    speaker: speaker(actor),
                    content: `<p><strong>${actor.name}</strong> ${game.i18n.localize("WITCHER.HUD.HoldingActionMsg")}</p>`,
                });
            },
        }),
    ];

    if (game.settings.get(MODULE_ID, "enableDisengage")) {
        buttons.push(new WitcherSpecialActionButton({
            labelKey: "WITCHER.HUD.Disengage",
            icon: ICONS.disengage,
            colorScheme: 2,
            tooltipDescFn: () => game.i18n.localize("WITCHER.HUD.DisengageMsg"),
            onClick: async (actor) => {
                ChatMessage.create({
                    speaker: speaker(actor),
                    content: `<p><strong>${actor.name}</strong> ${game.i18n.localize("WITCHER.HUD.DisengageMsg")}</p>`,
                });
            },
        }));
    }

    return buttons;
}

// ===================================================================
// ACTION PANELS
// ===================================================================
export class WitcherMainActionPanel extends ARGON.MAIN.ActionPanel {

    get label() {
        return "WITCHER.HUD.MainExtraAction";
    }

    get maxActions() { return null; }
    get currentActions() { return null; }

    async _getButtons() {
        const buttons = buildWeaponButtons(this.actor);

        const hasMagic =
            this.actor.getList("spell").length > 0 ||
            this.actor.getList("hex").length > 0 ||
            this.actor.getList("ritual").length > 0;
        if (hasMagic) buttons.push(new WitcherMagicPanelButton());

        buttons.push(new WitcherBrawlingPanelButton());
        buttons.push(new WitcherSpecialAttacksPanelButton());
        buttons.push(new WitcherConsumablesPanelButton());

        return buttons;
    }
}

export class WitcherFullRoundActionPanel extends ARGON.MAIN.ActionPanel {

    get label() {
        return "WITCHER.HUD.FullRoundAction";
    }

    get maxActions() { return null; }
    get currentActions() { return null; }

    async _getButtons() {
        return makeFullRoundButtons();
    }
}

export class WitcherPassPanel extends ARGON.MAIN.ActionPanel {

    get label() {
        return "WITCHER.HUD.PassPanel";
    }

    get maxActions() { return null; }
    get currentActions() { return null; }

    async _getButtons() {
        return [new WitcherEndTurnButton()];
    }
}
