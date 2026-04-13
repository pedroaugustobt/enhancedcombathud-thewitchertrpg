const ARGON = CONFIG.ARGON;

export class WitcherRestHud extends ARGON.ButtonHud {

    get visible() {
        return !game.combat?.started;
    }

    async _getButtons() {
        return [
            {
                label: game.i18n.localize("WITCHER.HUD.Rest.Daily"),
                onClick: () => this.actor.sheet._onHeal(),
                icon: "fas fa-bed",
            },
        ];
    }
}
