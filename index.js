'use strict';

import Discord from "discord.js";
import axios from 'axios';
const botToken = process.env.BOT_TOKEN;
const coinbaseKey = process.env.COINBASE_KEY;
const client = new Discord.Client();

function getXrpData(){
    const URL = 'https://rest.coinapi.io/v1/assets?filter_asset_id=XRP';
    return axios.get(URL, {
        headers:{
            'X-CoinAPI-Key': coinbaseKey
        }
    })
}

function displayCurrentPrice(msg){
    getXrpData()
        .then(data=>{
            console.log(data.data[0]);
            msg.reply(`The current price of XRP is $${data.data[0]['price_usd'].toFixed(4)}`);
        })
        .catch(err=>console.log(err));
}

function checkPrice(){
    const maxPrice = 1.00;
    const minPrice = .24;
    getXrpData()
        .then(data=>{
            //Displays current price to log
            const currentPrice = data.data[0]['price_usd'];
            console.log(`Current Price: $${currentPrice}`);

            //Checks if the current price is above a certain set level or below a certain set level
            if(currentPrice > maxPrice){
                client.channels.cache.get('805947280725114921')
                .send(`The price of XRP is above $${maxPrice}!!! SELL NOW!`);
            }
            else if(currentPrice < minPrice){
                client.channels.cache.get('805947280725114921')
                .send(`The price of XRP is below $${minPrice}!! WATCH OUT!!!!`);
            }
        })
        .catch(err=>console.log(err));
}



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content === 'xrp-price' || msg.content === 'xrp-p'){
        displayCurrentPrice(msg);
    }
});

client.login(botToken);
setInterval(checkPrice, 30000);