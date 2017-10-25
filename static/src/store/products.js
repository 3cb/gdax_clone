function getProducts(array) {
    var products = []
    for (var i = 0; i < array.length; i++) {
        products.push({
            id: i+1,
            name: array[i],
            deltaClass: null,
            sales: [], // 
            book: [],
            best_ask: null,
            best_bid: null,
            high_24h: null,
            last_size: null,
            low_24h: null,
            open_24h: null,
            price: null,
            product_id: array[i].split('/').join('-'),
            priceDelta24h: null,
            sequence: null,
            side: null,
            trade_id: null,
            type: 'ticker',
            volume_24h: null,
            volume_30d: null
        })
    }
    return products
}

export { getProducts }