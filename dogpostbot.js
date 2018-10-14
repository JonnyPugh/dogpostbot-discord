const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json')
const token = require('./token.json')

function choice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getRandomFile(rootFolder) {
  let folders = fs.readdirSync(rootFolder);
  while (true) {
    let folderPath = rootFolder + '/' + choice(folders);
    let files = fs.readdirSync(folderPath);
    if (files.length) {
      return folderPath + '/' + choice(files);
    }
  }
}

function sendDog(message) {
  message.channel.send(new Discord.Attachment(getRandomFile(config['imageFolder'])));
}

const client = new Discord.Client();

client.on('message', message => {
  if (message.content === '!dog') {
    sendDog(message);
  } else if (/^!dog [0-9]*$/.test(message.content)) {
    var numberOfDogs = message.content.split(" ")[1];
    while (numberOfDogs--) {
      sendDog(message);
    }
  }
});

client.login(token['token']);
