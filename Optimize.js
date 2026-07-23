const CONFIG = {
    lockRadius: 30.0,
    smoothing: 0.92,
    maxSpeed: 1.8,
    deadZone: 0.4,
    intervalMs: 16,
    decelNear: 0.25,
    decelDist: 18.0,
    sensitivity: 0.55
};

let cx = 540.0, cy = 960.0;
let tx = 0.0, ty = 0.0;
let fdx = 0.0, fdy = 0.0;
let locked = false;
let lastTime = 0;

function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function readTarget() {
    return { x: 540.0, y: 800.0 };
}

function touchDrag(dx, dy) {
    dx = clamp(dx, -CONFIG.maxSpeed, CONFIG.maxSpeed);
    dy = clamp(dy, -CONFIG.maxSpeed, CONFIG.maxSpeed);
    cx += dx;
    cy += dy;
}

function aimLoop(ts) {
    if (ts - lastTime < CONFIG.intervalMs) {
        requestAnimationFrame(aimLoop);
        return;
    }
    lastTime = ts;

    const t = readTarget();
    tx = t.x;
    ty = t.y;

    const dx = tx - cx;
    const dy = ty - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > CONFIG.lockRadius) {
        locked = false;
        requestAnimationFrame(aimLoop);
        return;
    }
    locked = true;

    if (dist < 0.3) {
        requestAnimationFrame(aimLoop);
        return;
    }

    const normX = dx / dist;
    const normY = dy / dist;

    let strength = CONFIG.sensitivity * (dist / CONFIG.lockRadius);
    if (strength > 1.0) strength = 1.0;

    if (dist < CONFIG.decelDist) {
        const f = dist / CONFIG.decelDist;
        strength *= CONFIG.decelNear + (1.0 - CONFIG.decelNear) * f;
    }

    let rawX = normX * strength * CONFIG.maxSpeed;
    let rawY = normY * strength * CONFIG.maxSpeed;

    fdx = lerp(rawX, fdx, CONFIG.smoothing);
    fdy = lerp(rawY, fdy, CONFIG.smoothing);

    if (Math.abs(fdx) < CONFIG.deadZone) fdx = 0;
    if (Math.abs(fdy) < CONFIG.deadZone) fdy = 0;

    const finalX = clamp(fdx, -CONFIG.maxSpeed, CONFIG.maxSpeed);
    const finalY = clamp(fdy, -CONFIG.maxSpeed, CONFIG.maxSpeed);

    if (locked && (Math.abs(finalX) > 0.001 || Math.abs(finalY) > 0.001)) {
        touchDrag(finalX, finalY);
    }

    requestAnimationFrame(aimLoop);
}

function init() {
    cx = 540;
    cy = 960;
    fdx = 0;
    fdy = 0;
    locked = false;
    lastTime = performance.now();
    requestAnimationFrame(aimLoop);
}

init();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init, CONFIG };
}
