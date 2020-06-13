function getData(count) {
    // data used to generate random items
    var countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'];
    var products = ['Widget', 'Gadget', 'Doohickey'];
    var colors = ['Orange', 'White', 'Red', 'Green', 'Blue'];
    //
    var data = [];
    var dt = new Date();
    //
    // add count items
    for (var i = 0; i < count; i++) {
        // varants used to create data items
        var date = new Date(dt.getFullYear(), i % 12, 25, i % 24, i % 60, i % 60), countryId = Math.floor(Math.random() * countries.length), productId = Math.floor(Math.random() * products.length), colorId = Math.floor(Math.random() * colors.length);
        //
        // create the item
        var item = {
            id: i,
            start: date,
            end: date,
            country: countries[countryId],
            product: products[productId],
            color: colors[colorId],
            amount: Math.random() * 10000 - 5000,
            amount2: Math.random() * 10000 - 5000,
            discount: Math.random() / 4,
            active: i % 4 == 0,
            note: '日本語あいうえお９０１２３４５６７８９０'
        };
        //
        // add the item to the list
        data.push(item);
    }
    return data;
}
