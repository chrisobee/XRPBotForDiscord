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
            console.log(data.data[0]);
            msg.reply(`The current price of XRP is $${Number.parseFloat(data.data[0]['price']).toFixed(4)}`);
        })
        .catch(err=>console.log(err));
}

function checkPrice(maxToNotify, minToNotify){
    const channelId = '805947280725114921'

    getXrpData()
        .then(data=>{
            //Displays current price to log
            const currentPrice = data.data[0]['price'];
            console.log(`Current Price: $${currentPrice}`);

            //Checks if the current price is above a certain set level or below a certain set level
            if(currentPrice > maxToNotify){
                client.channels.cache.get(channelId)
                .send(`The price of XRP is above $${maxPrice}!!! SELL NOW!`);
            }
            else if(currentPrice < minToNotify){
                client.channels.cache.get(channelId)
                .send(`The price of XRP is below $${minPrice}!! WATCH OUT!!!!`);
            }
        })
        .catch(err=>console.log(err));
}

function setNotify(msg, notifyType){
    const channelId = '805947280725114921';

    msg.reply(`What would you like to set the ${notifyType} to?`);
    const checkInput = m => isFinite(m.content);

    const collector = message.channel.createMessageCollector(checkInput, {time: 15000});

    collector.on('collect', m => {
        var notifyValue = Number.parseFloat(m.content);
        msg.channel.send(`The ${notifyType} notify has been set to ${notifyValue}`);
        return notifyValue;
    });

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
        return NaN;
    });
}

//Verifies Bot is Operational
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//Basic Functionality to Check XRP Price
client.on('message', msg => {
    if(msg.content === 'xrp-price' || msg.content === 'xrp-p'){
        displayCurrentPrice(msg);
    }
});

client.on('message', msg => {
    var maxToNotify = NaN;
    var minToNotify = NaN;
    
    if(msg.content.startsWith('xrp-notify') || msg.content.startsWith(`xrp-n`)){
        maxToNotify = setNotify(msg, 'max');
        minToNotify = setMin(msg, 'min');
    }

    setInterval((maxToNotify, minToNotify) => checkPrice(maxToNotify, minToNotify), 30000);
})

client.login(botToken);
