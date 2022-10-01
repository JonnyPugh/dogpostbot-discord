const { Client, GatewayIntentBits } = require('discord.js');
const { get } = require('axios');

const client = new Client({
  // https://discordjs.guide/popular-topics/intents.html
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const sendDogs = async (message, numDogs) => {
  const dogImages = (await get(`https://dog.ceo/api/breeds/image/random/${numDogs}`)).data.message;
  for (const dogImage of dogImages) {
    message.channel.send({files: [dogImage]});
  }
}

client.on('messageCreate', message => {
  if (message.content === '!dog') {
    sendDogs(message, 1);
  } else if (/^!dog [0-9]*$/.test(message.content)) {
    let numberOfDogs = message.content.split(' ')[1];
    if (numberOfDogs > 10 || numberOfDogs < 1) {
      numberOfDogs = 1;
    }
    sendDogs(message, numberOfDogs);
  }
});

client.login(process.env.DOGPOSTBOT_TOKEN);
