import { registerSettings } from "./settings.js";
import { initConfig } from "./witcherui.js";

Hooks.once("init", () => {
    registerSettings();
});

Hooks.on("argonInit", initConfig);
