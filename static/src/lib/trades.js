import axios from 'axios'

function getBTCUSD() {
    return axios.get('https://api.gdax.com/products/BTC-USD/trades')
}

function getBTCEUR() {
    return axios.get('https://api.gdax.com/products/BTC-EUR/trades')
}

function getBTCGBP() {
    return axios.get('https://api.gdax.com/products/BTC-GBP/trades')
}

function getETHUSD() {
    return axios.get('https://api.gdax.com/products/ETH-USD/trades')
}

function getETHBTC() {
    return axios.get('https://api.gdax.com/products/ETH-BTC/trades')
}

function getETHEUR() {
    return axios.get('https://api.gdax.com/products/ETH-EUR/trades')
}

function getLTCUSD() {
    return axios.get('https://api.gdax.com/products/LTC-USD/trades')
}

function getLTCBTC() {
    return axios.get('https://api.gdax.com/products/LTC-BTC/trades')
}

function getLTCEUR() {
    return axios.get('https://api.gdax.com/products/LTC-EUR/trades')
}


export { getBTCUSD, getBTCEUR, getBTCGBP, getETHUSD, getETHBTC, getETHEUR, getLTCUSD, getLTCBTC, getLTCEUR }