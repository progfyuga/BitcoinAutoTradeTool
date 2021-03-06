'use strict';
const ccxt = require ('ccxt');
const config = require ('./config');

let ftx= new ccxt.ftx (config)
const interval = 2000
const orderSize = 0.01
const records = []
let profit = 0


let orderInfo = null

const sleep = (timer) => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve()
        },timer)
    })
}

(async function () {
    

    while(true){
        const ticker = await ftx.fetchTicker ('BTC-PERP')
        records.push(ticker.bid)
        if(records.length > 3){
            records.shift()
        }
        console.log(records + '[現在収益]:' + profit)
        if(orderInfo){
            console.log('最新買い価格:' + ticker.ask)
            console.log('注文価格:' + orderInfo.price)
            console.log('差額:' + (ticker.ask - orderInfo.price))
            if(ticker.ask - orderInfo.price > 50){
                //買い注文
                const order = await ftx.createLimitBuyOrder ('BTC-PERP', orderSize, ticker.ask)
                profit += ((orderInfo.price - ticker.ask) * orderSize)
                orderInfo = null
                console.log('ロスカットしました',order)
                
            } else if(ticker.ask - orderInfo.price < -50){
                //買い注文
                const order = await ftx.createLimitBuyOrder ('BTC-PERP', orderSize, ticker.ask)
                profit += ((orderInfo.price - ticker.ask) * orderSize)
                orderInfo = null
                console.log('利確しました',order)

            }

        } else{    

            if(records[0] < records[1] && records[1] < records[2] ){
                //売り注文
                const order = await ftx.createLimitSellOrder ('BTC-PERP', orderSize, ticker.bid)
                console.log('price high!')
                orderInfo = {
                    order: order,
                    price: ticker.bid
                }
                console.log('売り注文しました', orderInfo)
            }
        }
        
        await sleep(interval)
    }

}) ();