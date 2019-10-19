
/* Imports */

var Gitter = require('node-gitter');
var Discord = require('discord.js');

/* GLOBALS */

var _room;
var _channel;

var gitterToken = process.env.GITTER_TOKEN;
var discordToken = process.env.DISCORD_TOKEN;

/* ---- GITTER ----- */
/* Log into gitter */

const gitter = new Gitter(gitterToken);

console.log(gitter.client);

gitter.rooms.join('amark/gun')
.then(function(room) {
  console.log('Joined room: ', room.name);
  // get the room into global for use in discord
  _room = room;
  room.send('Bridge started.')
  // fetch an observer for the global room
  var events = _room.streaming().chatMessages();

  // The 'chatMessages' event is emitted on each new message
  events.on('chatMessages', function(message) {
    console.log(message.model.fromUser);
    if(message.operation == "create" && message.model.fromUser.username != 'gunBot-disc'){
      //post initial message
      try{
        _channel.send(`[GITTER] -- ${message.model.fromUser.username} -- ${message.model.text}`)
      } catch(e) {console.log(e)}

    } else if (message.operation == "update") {
      //post a message that indicates an update
      try{
        _channel.send(`[GITTER] -- ${message.model.fromUser.username} -Update- ${message.model.text}`)
      } catch(e) {console.log(e)}
    }
  });
})
.catch(function(err) {
  console.log('Not possible to join the room: ', err);
})



/* ----- DISCORD ------ */

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {

  console.log(message.content);

  _room.send(`[DISCORD] -- ${message.author.username} -- ${message.content}`);

  // If the message is "ping"
  if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }

  _channel = message.channel;
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(discordToken);
