// Importing required modules
const Discord = require('discord.js');
const cc = require('cryptocompare'); 
global.fetch = require('node-fetch');
const config = require('./config.json');

// Initializing CC w/ Api Key
cc.setApiKey(config.ApiKey);

// Initializing Discord Client
const client = new Discord.Client();

// Ready Event
client.on('ready', () => {
  console.log('Crypto Pirce Checker Started!'); 
  client.user.setActivity('the markets 🔍');
});

// Message Event
client.on('message', async msg => {
  // Ignoring useless messages
  if (msg.author.bot) return;

  // Assigning args and commands
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'crypto' && args[0] && args[1]) {
    cc.priceFull(args[0].toUpperCase(), args[1].toUpperCase())
    .then(results => {
      // Getting correct formatted information from results
      let allData = results[Object.keys(results)[0]];
      let data = allData[Object.keys(allData)[0]];

      // Sending results
      msg.channel.send({embed: {
        color: 0x4dcc82,
        title: 'Crypto Currency Results 🔍',
        thumbnail: {
          url: `https://www.cryptocompare.com${data.IMAGEURL.toString()}`
        },
        fields: [
          { name: 'Current Price', value: data.PRICE.toString(), inline: true },
          { name: 'Market Cap', value: data.MKTCAP.toString(), inline: true },
          { name: 'Supply', value: data.SUPPLY.toString(), inline: true },
          { name: '24 Hour Volume', value: data.TOTALVOLUME24H.toFixed(2).toString(), inline: true },
          { name: '24 Hour Change', value: data.CHANGE24HOUR.toFixed(2).toString(), inline: true },
          { name: '24 Hour Change %', value: `%${data.CHANGEPCT24HOUR.toFixed(2).toString()}`, inline: true },
          { name: 'Hour Low', value: data.LOWHOUR.toString(), inline: true },
          { name: 'Hour High', value: data.HIGHHOUR.toString(), inline: true },
          { name: 'Daily Low', value: data.LOWDAY.toString(), inline: true },
          { name: 'Daily High', value: data.HIGHDAY.toString(), inline: true },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: `Crypto Price Checker | ${msg.guild.name}`
        }
      }});
    })
    .catch(console.error)
  } else {
    msg.channel.send({embed: {
      color: 0x4dcc82,
      description: 'Opps, looks like you did something wrong!',
      fields: [
        { name: 'Example', value: '$crypto BTC USD' }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: `Crypto Price Checker | ${msg.guild.name}`
      }
    }});
  }
});

// Logging into Discord Client
client.login(config.token);