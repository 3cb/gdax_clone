import moment from 'moment'

function getParams(interval) {
    if (interval === '1d') {
        let arr = moment.utc().toISOString().split('T')
        let date = arr[0]
        return {
            start: moment(date).subtract(53, 'days').toISOString(),
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

export {
    getParams,
    drawChart
}