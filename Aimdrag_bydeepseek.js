const TELEGRAM_TOKEN = "8960432472:AAHoQryg0r5cOrI4lG9IAmY89OSwOa2fraI";
const CHAT_ID = "@Aimbotlockd_bot";
const VPN_URL = "lua://OkAxMjcuMC4wLjE6NTAyNDY?path=Aimlock.lua&remarks=Proxy&tfo=1&h2=1&method=auto&v2ray-plugin=eyJwb3J0IjoiNTAyNDYiLCJhZGRyZXNzIjoiMTI3LjAuMC4xIiwibXV4Ijp0cnVlLCJtb2RlIjoid2Vic29ja2V0IiwiYWxsb3dJbnNlY3VyZSI6dHJ1ZSwidGxzIjp0cnVlLCJob3N0IjoiYXBwLW1lYXN1cmVtZW50LmNvbSIsInRmbyI6dHJ1ZSwicGF0aCI6IlwvYSJ9";

function notifyTelegram(message) {
    $httpClient.get({
        url: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`,
        timeout: 5000
    }, function(error, response, data) {
        if (error) console.log("Telegram error: " + error);
        else console.log("Telegram sent.");
    });
}

function enableVPN() {
    console.log("Connecting VPN...");
    $httpClient.get({
        url: VPN_URL,
        timeout: 3000
    }, function(error, response, data) {
        if (error) {
            console.log("VPN fail: " + error);
            runAimScript();
        } else {
            console.log("VPN connected.");
            setTimeout(runAimScript, 2000);
        }
    });
}

function runAimScript() {
    console.log("Running Advanced Aimdrag...");
    var gameRegion = "libil2cpp.so";

    // 1. Tắt rung mạnh (tất cả giá trị liên quan)
    var shakeValues = [1.0, 0.5, 0.3, 0.2, 0.8, 0.7, 0.9, 0.4, 0.6];
    for (var i = 0; i < shakeValues.length; i++) {
        var addrs = Memory.scan(gameRegion, "float", String(shakeValues[i]));
        if (addrs != null) {
            for (var j = 0; j < addrs.length; j++) {
                Memory.writeFloat(addrs[j], 0.0);
            }
        }
    }

    // 2. Tăng lực bám đầu (từ 0.8 -> 10.0, cực mạnh)
    var aimValues = [0.8, 0.9, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];
    for (var i = 0; i < aimValues.length; i++) {
        var addrs = Memory.scan(gameRegion, "float", String(aimValues[i]));
        if (addrs != null) {
            for (var j = 0; j < addrs.length; j++) {
                var val = Memory.readFloat(addrs[j]);
                if (val >= 0.5 && val <= 5.0) {
                    Memory.writeFloat(addrs[j], 10.0); // tăng lên 10
                }
            }
        }
    }

    // 3. Triệt tiêu giật lố (recoil)
    var recoilValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2];
    for (var i = 0; i < recoilValues.length; i++) {
        var addrs = Memory.scan(gameRegion, "float", String(recoilValues[i]));
        if (addrs != null) {
            for (var j = 0; j < addrs.length; j++) {
                var val = Memory.readFloat(addrs[j]);
                if (val >= 0.0 && val <= 1.5) {
                    Memory.writeFloat(addrs[j], 0.0);
                }
            }
        }
    }

    // 4. Thu hẹp FOV để bám chặt hơn (gần trung tâm)
    var fovValues = [60, 70, 75, 80, 85, 90, 100];
    for (var i = 0; i < fovValues.length; i++) {
        var addrs = Memory.scan(gameRegion, "int32", String(fovValues[i]));
        if (addrs != null) {
            for (var j = 0; j < addrs.length; j++) {
                var val = Memory.readInt32(addrs[j]);
                if (val >= 60 && val <= 100) {
                    Memory.writeInt32(addrs[j], 50); // FOV hẹp hơn
                }
            }
        }
    }

    // 5. Tăng lực hỗ trợ ngắm (Aim Assist) – thường là float nhỏ
    var assistValues = [0.1, 0.2, 0.3, 0.5, 0.7, 1.0];
    for (var i = 0; i < assistValues.length; i++) {
        var addrs = Memory.scan(gameRegion, "float", String(assistValues[i]));
        if (addrs != null) {
            for (var j = 0; j < addrs.length; j++) {
                var val = Memory.readFloat(addrs[j]);
                if (val >= 0.0 && val <= 1.2) {
                    Memory.writeFloat(addrs[j], 2.5); // tăng lực kéo
                }
            }
        }
    }

    // 6. Tìm giá trị "Magnet" hoặc "Sticky" (thường là 0.0 hoặc 0.5)
    var stickyValues = [0.0, 0.5, 1.0];
    for (var i = 0; i < stickyValues.length; i++) {
        var addrs = Memory.scan(gameRegion, "float", String(stickyValues[i]));
        if (addrs != null) {
            for (var j = 0; j < addrs.length; j++) {
                var val = Memory.readFloat(addrs[j]);
                if (val >= 0.0 && val <= 1.1) {
                    Memory.writeFloat(addrs[j], 2.0); // bám dính hơn
                }
            }
        }
    }

    // 7. Tối ưu đồ họa (giảm lag)
    var qualityValues = [1, 2, 3];
    for (var i = 0; i < qualityValues.length; i++) {
        var addrs = Memory.scan(gameRegion, "int32", String(qualityValues[i]));
        if (addrs != null) {
            for (var j = 0; j < addrs.length; j++) {
                var val = Memory.readInt32(addrs[j]);
                if (val >= 1 && val <= 3) {
                    Memory.writeInt32(addrs[j], 0);
                }
            }
        }
    }

    var shadowAddrs = Memory.scan(gameRegion, "float", "1.0");
    if (shadowAddrs != null) {
        for (var i = 0; i < shadowAddrs.length; i++) {
            var val = Memory.readFloat(shadowAddrs[i]);
            if (val >= 0.9 && val <= 1.1) {
                Memory.writeFloat(shadowAddrs[i], 0.0);
            }
        }
    }

    console.log("Advanced Aimdrag applied.");
    notifyTelegram("✅ Script bám đầu siêu mạnh đã chạy! FOV thu hẹp, aim assist tăng, rung triệt.");
}

function main() {
    console.log("=== FULL SCRIPT: VPN + AIMBOT + TELEGRAM ===");
    enableVPN();
}

main();
