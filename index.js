'use strict';

import Discord from "discord.js";
import axios from 'axios';
const botToken = process.env.BOT_TOKEN;
const apiKey = process.env.NOMICS_KEY;
const client = new Discord.Client();

function getXrpData(){
    const URL = `https://api.nomics.com/v1/currencies/ticker?key=${apiKey}&ids=XRP`;
    return axios.get(URL)
}

function displayCurrentPrice(msg){
    getXrpData()
        .then(data=>{
            console.log(data[0]);
            msg.reply(`The current price of XRP is $${data[0]['price'].toFixed(4)}`);
        })
        .catch(err=>console.log(err));
}

function checkPrice(){
    const maxPrice = 1.00;
    const minPrice = .24;
    const channelId = '805947280725114921'
    getXrpData()
        .then(data=>{
            //Displays current price to log
            const currentPrice = data[0]['price'];
            console.log(`Current Price: $${currentPrice}`);

            //Checks if the current price is above a certain set level or below a certain set level
            if(currentPrice > maxPrice){
                client.channels.cache.get(channelId)
                .send(`The price of XRP is above $${maxPrice}!!! SELL NOW!`);
            }
            else if(currentPrice < minPrice){
                client.channels.cache.get(channelId)
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