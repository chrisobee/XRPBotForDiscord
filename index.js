'use strict';

import Discord from "discord.js";
import axios from 'axios';
import {coinbaseKey, xrpToken} from "./HiddenFiles/token.js";
const client = new Discord.Client();

function displayCurrentPrice(msg){
    const URL = 'https://rest.coinapi.io/v1/assets?filter_asset_id=XRP';
        axios.get(URL, {
            headers:{
                'X-CoinAPI-Key':coinbaseKey
            }  
        })
        .then(data=>{
            console.log(data.data[0]);
            msg.reply(`The current price of XRP is $${data.data[0]['price_usd'].toFixed(4)}`);
        })
        .catch(err=>console.log(err));
}

function checkPrice(){
    const maxPrice = 1.00;
    const minPrice = .24;

    const URL = 'https://rest.coinapi.io/v1/assets?filter_asset_id=XRP';
        axios.get(URL, {
            headers:{
                'X-CoinAPI-Key':coinbaseKey
            }  
        })
        .then(data=>{
            const currentPrice = data.data[0]['price_usd'];
            console.log(`Current Price: $${currentPrice}`);
            if(currentPrice > maxPrice){
                client.channels.cache.get('805947280725114921')
                .send(`The price of XRP is above $${maxPrice}!!! SELL!!`);
            }
            else if(currentPrice < minPrice){
                client.channels.cache.get('805947280725114921')
                .send(`The price of XRP is below $${minPrice}!! WATCH OUT!!!!`);
            }
        })
        .catch(err=>console.log(err));
}

setInterval(checkPrice, 10000);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content === 'xrp-price' || msg.content === 'xrp-p'){
        displayCurrentPrice(msg);
    }
});

client.login(xrpToken);