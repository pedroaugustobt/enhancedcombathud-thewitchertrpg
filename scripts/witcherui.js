import { WitcherPortraitPanel } from "./witcher-portrait-panel.js";
import { WitcherDrawerPanel } from "./witcher-drawer-panel.js";
import { WitcherMovementHud, registerMovementHooks } from "./witcher-movement-hud.js";
import { WitcherWeaponSets } from "./witcher-weapon-sets.js";
import { WitcherMainActionPanel, WitcherFullRoundActionPanel, WitcherPassPanel } from "./witcher-actions-panel.js";
import { WitcherRestHud } from "./witcher-rest-hud.js";

export function initConfig(CoreHUD) {
    if (game.system.id !== "TheWitcherTRPG") return;

    CoreHUD.definePortraitPanel(WitcherPortraitPanel);
    CoreHUD.defineDrawerPanel(WitcherDrawerPanel);
    CoreHUD.defineMainPanels([
        WitcherMainActionPanel,
        WitcherFullRoundActionPanel,
        WitcherPassPanel,
    ]);
    CoreHUD.defineMovementHud(WitcherMovementHud);
    CoreHUD.defineWeaponSets(WitcherWeaponSets);
    CoreHUD.defineButtonHud(WitcherRestHud);
    CoreHUD.defineSupportedActorTypes(["character", "monster"]);

    registerMovementHooks();
}
