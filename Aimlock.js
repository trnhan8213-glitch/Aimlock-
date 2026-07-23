const CONFIG = {
    lockRadius: 35.0,
    smoothing: 0.88,
    maxSpeedPerFrame: 2.0,
    deadZone: 0.5,
    minIntervalMs: 20,
    decelerationNearTarget: 0.3,
    decelerationThreshold: 20.0,
    sensitivity: 0.6
};

let state = {
    crosshairX: 540.0,
    crosshairY: 960.0,
    targetX: 0.0,
    targetY: 0.0,
    filteredDeltaX: 0.0,
    filteredDeltaY: 0.0,
    isLocked: false,
    lastUpdateTime: 0,
    accumulatedDx: 0.0,
    accumulatedDy: 0.0
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lowPass(newVal, oldVal, alpha) {
    return alpha * newVal + (1 - alpha) * oldVal;
}

function readHeadPosition() {
    const baseAddr = 0x100000000;
    const offsetX = 0x4A2C;
    const offsetY = 0x4A30;
    return { x: 540.0, y: 800.0 };
}

function performDrag(dx, dy) {
    const limitedDx = clamp(dx, -CONFIG.maxSpeedPerFrame, CONFIG.maxSpeedPerFrame);
    const limitedDy = clamp(dy, -CONFIG.maxSpeedPerFrame, CONFIG.maxSpeedPerFrame);
    state.crosshairX += limitedDx;
    state.crosshairY += limitedDy;
}

function computeAimVector(crosshair, target) {
    let dx = target.x - crosshair.x;
    let dy = target.y - crosshair.y;
    const distance = Math.hypot(dx, dy);

    if (distance > CONFIG.lockRadius) {
        state.isLocked = false;
        return { dx: 0, dy: 0 };
    }

    state.isLocked = true;

    if (distance < 0.5) {
        return { dx: 0, dy: 0 };
    }

    const normDx = dx / distance;
    const normDy = dy / distance;

    let pullStrength = CONFIG.sensitivity * (distance / CONFIG.lockRadius);
    pullStrength = Math.min(pullStrength, 1.0);

    if (distance < CONFIG.decelerationThreshold) {
        const factor = distance / CONFIG.decelerationThreshold;
        pullStrength *= (CONFIG.decelerationNearTarget + (1 - CONFIG.decelerationNearTarget) * factor);
    }

    let rawDx = normDx * pullStrength * CONFIG.maxSpeedPerFrame;
    let rawDy = normDy * pullStrength * CONFIG.maxSpeedPerFrame;

    const filteredDx = lowPass(rawDx, state.filteredDeltaX, CONFIG.smoothing);
    const filteredDy = lowPass(rawDy, state.filteredDeltaY, CONFIG.smoothing);
    state.filteredDeltaX = filteredDx;
    state.filteredDeltaY = filteredDy;

    if (Math.abs(filteredDx) < CONFIG.deadZone) {
        state.filteredDeltaX = 0;
    }
    if (Math.abs(filteredDy) < CONFIG.deadZone) {
        state.filteredDeltaY = 0;
    }

    const finalDx = clamp(state.filteredDeltaX, -CONFIG.maxSpeedPerFrame, CONFIG.maxSpeedPerFrame);
    const finalDy = clamp(state.filteredDeltaY, -CONFIG.maxSpeedPerFrame, CONFIG.maxSpeedPerFrame);

    return { dx: finalDx, dy: finalDy };
}

function aimLoop(timestamp) {
    const elapsed = timestamp - state.lastUpdateTime;
    if (elapsed < CONFIG.minIntervalMs) {
        requestAnimationFrame(aimLoop);
        return;
    }
    state.lastUpdateTime = timestamp;

    const target = readHeadPosition();
    state.targetX = target.x;
    state.targetY = target.y;

    const crosshair = {
        x: state.crosshairX,
        y: state.crosshairY
    };

    const aimVec = computeAimVector(crosshair, target);

    if (state.isLocked && (Math.abs(aimVec.dx) > 0.001 || Math.abs(aimVec.dy) > 0.001)) {
        performDrag(aimVec.dx, aimVec.dy);
    }

    requestAnimationFrame(aimLoop);
}

function init() {
    state.crosshairX = 540;
    state.crosshairY = 960;
    state.lastUpdateTime = performance.now();
    state.filteredDeltaX = 0;
    state.filteredDeltaY = 0;
    state.isLocked = false;
    requestAnimationFrame(aimLoop);
}

init();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init, state, CONFIG };
}
