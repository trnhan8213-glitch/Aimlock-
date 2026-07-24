var gameRegion = "libil2cpp.so";

function fixShake() {
    console.log("Đang tắt rung màn hình...");
    var shakeAddr = Memory.scan(gameRegion, "float", "1.0");
    if (shakeAddr != null) {
        for (var i = 0; i < shakeAddr.length; i++) {
            Memory.writeFloat(shakeAddr[i], 0.0);
        }
        console.log("✓ Đã fix rung: " + shakeAddr.length + " địa chỉ");
    } else {
        console.log("! Không tìm thấy giá trị rung (có thể đã bị thay đổi)");
    }
}

function fixAimDrag() {
    console.log("Đang tăng lực bám đầu & chỉnh AimDrag...");
    var sensAddr = Memory.scan(gameRegion, "float", "0.8");
    if (sensAddr != null) {
        for (var i = 0; i < sensAddr.length; i++) {
            var currentVal = Memory.readFloat(sensAddr[i]);
            if (currentVal >= 0.5 && currentVal <= 1.0) {
                Memory.writeFloat(sensAddr[i], 2.0);
            }
        }
        console.log("✓ Đã điều chỉnh AimDrag");
    } else {
        var fallback = Memory.scan(gameRegion, "float", "1.0");
        if (fallback != null) {
            for (var i = 0; i < fallback.length; i++) {
                var val = Memory.readFloat(fallback[i]);
                if (val >= 0.9 && val <= 1.1) {
                    Memory.writeFloat(fallback[i], 2.5);
                }
            }
            console.log("✓ Đã chỉnh AimDrag (fallback)");
        }
    }
}

function fixOvershoot() {
    console.log("Đang giảm giật lố đầu và Recoil...");
    var recoilAddr = Memory.scan(gameRegion, "float", "0.3");
    if (recoilAddr != null) {
        for (var i = 0; i < recoilAddr.length; i++) {
            var val = Memory.readFloat(recoilAddr[i]);
            if (val >= 0.2 && val <= 0.5) {
                Memory.writeFloat(recoilAddr[i], 0.0);
            }
        }
        console.log("✓ Đã fix giật lố");
    }
}

function fixLag() {
    console.log("Đang tối ưu FPS, tắt hiệu ứng nặng...");
    var qualityAddr = Memory.scan(gameRegion, "int32", "2");
    if (qualityAddr != null) {
        for (var i = 0; i < qualityAddr.length; i++) {
            var val = Memory.readInt32(qualityAddr[i]);
            if (val >= 1 && val <= 3) {
                Memory.writeInt32(qualityAddr[i], 0);
            }
        }
        console.log("✓ Đã giảm chất lượng đồ họa (tăng FPS)");
    }
    var shadowAddr = Memory.scan(gameRegion, "float", "1.0");
    if (shadowAddr != null) {
        for (var i = 0; i < shadowAddr.length; i++) {
            var val = Memory.readFloat(shadowAddr[i]);
            if (val >= 0.9 && val <= 1.1) {
                Memory.writeFloat(shadowAddr[i], 0.0);
            }
        }
        console.log("✓ Đã tắt bóng đổ");
    }
}

function main() {
    console.log("=== Bắt đầu Script FreeFire ===");
    fixShake();
    fixAimDrag();
    fixOvershoot();
    fixLag();
    console.log("=== Hoàn tất! Chúc bạn chơi vui. ===");
}

main();
