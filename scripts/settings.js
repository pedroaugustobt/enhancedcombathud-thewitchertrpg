import { MODULE_ID } from "./module.js";

export function registerSettings() {
    game.settings.register(MODULE_ID, "enableDisengage", {
        name: "WITCHER.Settings.EnableDisengage",
        hint: "WITCHER.Settings.EnableDisengageHint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        restricted: true,
    });
}
