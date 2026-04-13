const ARGON = CONFIG.ARGON;

export class WitcherMovementHud extends ARGON.MovementHud {

    get movementMax() {
        const spd = this.actor.system.stats?.spd?.value || 1;
        return Math.ceil(spd / 2);
    }
}

export function registerMovementHooks() {
    const refreshMovement = (subject) => {
        const parent = subject?.parent ?? subject;
        if (parent !== ui.ARGON?._actor) return;
        ui.ARGON.components.movement?.updateMovement();
    };

    Hooks.on("updateActor", refreshMovement);
    Hooks.on("createActiveEffect", refreshMovement);
    Hooks.on("deleteActiveEffect", refreshMovement);
    Hooks.on("updateActiveEffect", refreshMovement);
}
