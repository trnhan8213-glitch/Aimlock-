$done(handleResponse($response));

function handleResponse(response) {
    if (response.url.indexOf('/v1/inventory') === -1) {
        return response;
    }

    var body = JSON.parse(response.body);
    var targetSkinIds = ['123456', '789012', '345678'];

    if (body.data && Array.isArray(body.data.items)) {
        targetSkinIds.forEach(function(skinId) {
            var exists = body.data.items.some(function(item) {
                return item.id === skinId;
            });
            if (!exists) {
                body.data.items.push({
                    id: skinId,
                    type: 'skin',
                    owned: true,
                    equipped: false
                });
            }
        });
    }

    response.body = JSON.stringify(body);
    return response;
}
