export const MODULE_ID = "enhancedcombathud-TheWitcherTRPG";

export const ICONS = {
    run: `modules/${MODULE_ID}/icons/run.svg`,
    dodge: `modules/${MODULE_ID}/icons/dodge.svg`,
    aim: `modules/${MODULE_ID}/icons/targeting.svg`,
    recovery: `modules/${MODULE_ID}/icons/regen.svg`,
    charge: `modules/${MODULE_ID}/icons/shield-bash.svg`,
    verbalCombat: `modules/${MODULE_ID}/icons/convince.svg`,
    magic: `modules/${MODULE_ID}/icons/spell-book.svg`,
    useItem: `modules/${MODULE_ID}/icons/drink-me.svg`,
    endTurn: `modules/${MODULE_ID}/icons/duration.svg`,
    brawling: `modules/${MODULE_ID}/icons/high-punch.svg`,
    specialAttacks: `modules/${MODULE_ID}/icons/mighty-force.svg`,
    holdingAction: `modules/${MODULE_ID}/icons/rogue.svg`,
    disengage: `modules/${MODULE_ID}/icons/journey.svg`,
};

export function hpColor(value, max) {
    if (!max || max <= 0) return "#ffffff";
    const pct = value / max;
    if (pct > 0.5) return "#69f0ae";
    if (pct > 0.25) return "#ffca28";
    return "#ef5350";
}
