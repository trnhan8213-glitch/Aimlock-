// Script Shadowrocket: Aimdrag nhẹ tâm, fix rung & Tích hợp Bot Telegram điều khiển
// Cấu hình cứng sẵn Token trực tiếp trong mã nguồn

let policy = {
    aimDrag: true,
    dragScale: 1.25,
    recoilReduction: 0.85,
    token: "8960432472:AAHoQryg0r5cOrI4lG9IAmY89OSwOa2fraI",
    chatId: "" // Nhập Chat ID của bạn vào đây nếu muốn nhận thông báo
};

// Đọc thông số bổ sung từ Argument nếu có
if (typeof $argument !== "undefined" && $argument) {
    let args = $argument.split("&");
    for (let arg of args) {
        let pair = arg.split("=");
        if (pair[0] === "token" && pair[1]) policy.token = decodeURIComponent(pair[1]);
        if (pair[0] === "chatId" && pair[1]) policy.chatId = decodeURIComponent(pair[1]);
    }
}

function sendTelegramNotification(msg) {
    if (!policy.token || !policy.chatId) return;
    let url = "https://api.telegram.org/bot" + policy.token + "/sendMessage";
    let body = {
        chat_id: policy.chatId,
        text: "[AimScript Bot]: " + msg
    };
    
    $httpClient.post({
        url: url,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }, function(error, response, data) {
        // Xử lý phản hồi ngầm
    });
}

// Xử lý gói tin phản hồi từ game để tinh chỉnh thông số độ nhạy và chống rung
let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        
        if (obj && obj.data) {
            if (obj.data.settings) {
                obj.data.settings.recoil_factor = policy.recoilReduction;
                obj.data.settings.drag_sensitivity = policy.dragScale;
            } else {
                obj.data.settings = {
                    recoil_factor: policy.recoilReduction,
                    drag_sensitivity: policy.dragScale
                };
            }
        }
        
        // Gửi thông báo trạng thái qua Bot Telegram khi kích hoạt thành công
        if (policy.token && policy.chatId) {
            sendTelegramNotification("Đã kích hoạt Aimdrag nhẹ tâm & Fix rung thành công trên iOS!");
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
