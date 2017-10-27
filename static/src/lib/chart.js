import moment from 'moment'

function getParams(interval) {
    if (interval === '1d') {
        let arr = moment.utc().toISOString().split('T')
        let date = arr[0]
        return {
            start: moment(date).subtract(50, 'days').toISOString(),
            end: moment(date).toISOString(),
            granularity: 86400
        }
    } else if (interval === '5m') {
        let arr = moment.utc().toISOString().split('T')
        let date = arr[0]
        return {
            start: moment(date).subtract(1000, 'minutes').toISOString(),
            end: moment(date).toISOString(),
            granularity: 300
        }
    }
}

function drawChart(data, product) {
    var table, mapping, chart;
        table = anychart.data.table();
        table.addData(data);

        // mapping the data
        mapping = table.mapAs();
        mapping.addField("low", 1);
        mapping.addField("high", 2);
        mapping.addField("open", 3);
        mapping.addField("close", 4);
        // mapping.addField("volume", 5);

        // defining the chart type
        chart = anychart.stock();

        // set the series type
        chart
            .plot(0)
            .candlestick(mapping)
            .name(product);

        // setting the chart title
        // chart.title(store.selected_product + "   Daily Chart");

        // display the chart
        chart.container("chart");
        chart.draw();
}

export {
    getParams,
    drawChart
}