const Discord = require('discord.js');
const axios = require('axios');

const sendDogs = async (message, numDogs) => {
  const dogImages = (await axios.get(`https://dog.ceo/api/breeds/image/random/${numDogs}`)).data.message;
  for (const dogImage of dogImages) {
    message.channel.send(new Discord.Attachment(dogImage));
  }
}

const client = new Discord.Client();

client.on('message', message => {
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
