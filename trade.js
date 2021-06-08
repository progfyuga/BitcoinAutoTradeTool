'use strict';
const ccxt = require ('ccxt');
const config = require ('./config');

let ftx= new ccxt.ftx (config)
const interval = 2000
const records = []

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
        const ticker = await ftx.fetchTicker ('BTC/USD')
        records.push(ticker.ask)
        if(records.length > 3){
            records.shift()
        }
        console.log(records)
        if(orderInfo){
            console.log('最新売り価格:' + ticker.bid)
            console.log('注文価格:' + orderInfo.price)
            console.log('差額:' + (ticker.bid - orderInfo.price))
            if(ticker.bid - orderInfo.price > 5){
                //売り注文
                // console.log(ftx.id , await ftx.createMarketSellOrder ('BTC/USD', 0.01))
                orderInfo = null
                console.log('利確しました')
                
                
            } else if(ticker.bid - orderInfo.price < -5){
                //売り注文
                // console.log(ftx.id , await ftx.createMarketSellOrder ('BTC/USD', 0.01))
                orderInfo = null
                console.log('ロスカットしました')
            }

        } else{
            if(records[0] < records[1] && records[1] < records[2]){
                //買い注文
                // console.log(ftx.id , await ftx.createMarketBuyOrder ('BTC/USD', 0.01))
                console.log('price high!')
                orderInfo = {
                    order: 'オーダー',
                    price: ticker.ask
                }
                console.log('買い注文しました', orderInfo)
            }
        }
        
        await sleep(interval)
    }

}) ();