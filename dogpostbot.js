const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json')
const token = require('./token.json')

function choice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getRandomFile(rootFolder) {
  var folders = fs.readdirSync(rootFolder);
  while (true) {
    let folderPath = rootFolder + '/' + choice(folders);
    var files = fs.readdirSync(folderPath);
    if (files.length) {
      return folderPath + '/' + choice(files);
    }
  }
}

const client = new Discord.Client();

client.on('message', message => {
  if (message.content === '!dog') {
    const attachment = new Discord.Attachment(getRandomFile(config['imageFolder']));
    message.channel.send(attachment);
  }
});

client.login(token['token']);
