const TELEGRAM_TOKEN = "8960432472:AAHoQryg0r5cOrI4lG9IAmY89OSwOa2fraI";
const CHAT_ID = "@Aimbotlockd_bot";
const VPN_URL = "lua://OkAxMjcuMC4wLjE6NTAyNDY?path=Aimlock.lua&remarks=Proxy&tfo=1&h2=1&method=auto&v2ray-plugin=eyJwb3J0IjoiNTAyNDYiLCJhZGRyZXNzIjoiMTI3LjAuMC4xIiwibXV4Ijp0cnVlLCJtb2RlIjoid2Vic29ja2V0IiwiYWxsb3dJbnNlY3VyZSI6dHJ1ZSwidGxzIjp0cnVlLCJob3N0IjoiYXBwLW1lYXN1cmVtZW50LmNvbSIsInRmbyI6dHJ1ZSwicGF0aCI6IlwvYSJ9";

function notifyTelegram(message) {
    $httpClient.get({
        url: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`,
        timeout: 5000
    }, function(error, response, data) {
        if (error) {
            console.log("Gửi thông báo Telegram thất bại: " + error);
        } else {
            console.log("Đã gửi thông báo Telegram thành công.");
        }
    });
}

function runAimScript() {
    console.log("🚀 Đang chạy Aimdrag & fix lag...");
    var gameRegion = "libil2cpp.so";

    var shakeAddr = Memory.scan(gameRegion, "float", "1.0");
    if (shakeAddr != null) {
        for (var i = 0; i < shakeAddr.length; i++) {
            Memory.writeFloat(shakeAddr[i], 0.0);
        }
        console.log("✓ Fix rung: " + shakeAddr.length + " địa chỉ");
    }

    var sensAddr = Memory.scan(gameRegion, "float", "0.8");
    if (sensAddr != null) {
        for (var i = 0; i < sensAddr.length; i++) {
            var currentVal = Memory.readFloat(sensAddr[i]);
            if (currentVal >= 0.5 && currentVal <= 1.0) {
                Memory.writeFloat(sensAddr[i], 2.0);
            }
        }
        console.log("✓ Chỉnh AimDrag");
    }

    var recoilAddr = Memory.scan(gameRegion, "float", "0.3");
    if (recoilAddr != null) {
        for (var i = 0; i < recoilAddr.length; i++) {
            var val = Memory.readFloat(recoilAddr[i]);
            if (val >= 0.2 && val <= 0.5) {
                Memory.writeFloat(recoilAddr[i], 0.0);
            }
        }
        console.log("✓ Fix giật lố");
    }

    var qualityAddr = Memory.scan(gameRegion, "int32", "2");
    if (qualityAddr != null) {
        for (var i = 0; i < qualityAddr.length; i++) {
            var val = Memory.readInt32(qualityAddr[i]);
            if (val >= 1 && val <= 3) {
                Memory.writeInt32(qualityAddr[i], 0);
            }
        }
        console.log("✓ Tối ưu FPS");
    }

    notifyTelegram("✅ Script Aimdrag đã chạy thành công trên iPhone!");
}

function enableVPN() {
    console.log("🔗 Đang kết nối VPN...");
    $httpClient.get({
        url: VPN_URL,
        timeout: 3000
    }, function(error, response, data) {
        if (error) {
            console.log("Lỗi bật VPN: " + error);
            runAimScript();
        } else {
            console.log("✅ VPN đã được kích hoạt.");
            setTimeout(runAimScript, 2000);
        }
    });
}

function main() {
    console.log("=== Script FreeFire + VPN Auto ===");
    enableVPN();
}

main();
