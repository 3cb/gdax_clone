import moment from 'moment'

function getParams(interval) {
    if (interval === '1d') {
        return {
            start: moment().subtract(50, 'days').format(),
            end: moment().format(),
            granularity: 86400
        }
    } else if (interval === '1m') {
        return {
            start: moment().subtract(50, 'minutes').format(),
            end: moment().format(),
            granularity: 60
        }
    }
}

export {
    getParams
}