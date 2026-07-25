if ($response.status === 200 && $request.url.indexOf('/v1/inventory') !== -1) {
    try {
        var body = JSON.parse($response.body);
        var targetSkinIds = ['123456', '789012', '345678'];
        if (body.data && Array.isArray(body.data.items)) {
            targetSkinIds.forEach(function(id) {
                var exists = body.data.items.some(function(item) {
                    return item.id === id;
                });
                if (!exists) {
                    body.data.items.push({
                        id: id,
                        type: 'skin',
                        owned: true,
                        equipped: false
                    });
                }
            });
        }
        $done({ response: { body: JSON.stringify(body) } });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
