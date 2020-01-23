
/* Imports */
var server = require('http').createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('This is the discord bridge');
  res.end();
}).listen(process.env.PORT || 8080);
var Gitter = require('node-gitter');
var Discord = require('discord.js');
var Gun = require('gun');

var peers = ['http://guntest.herokuapp.com/gun']
var gun = Gun({peers:peers, radisk:false, localStorage:false})

gun.get('grappling-gun').get('version').once((node, key)=>console.log(key, node));

/* GLOBALS */

var gitterToken = process.env.GITTER_TOKEN || process.argv[2];
var discordToken = process.env.DISCORD_TOKEN || process.argv[3];

console.log('started the bridge.')

var sendGitter;
var sendDiscord;

var chatGitter = gun.get('grappling-gun').get('chat').get('gitter');
var chatDiscord = gun.get('grappling-gun').get('chat').get('discord');

/* ---- GITTER ----- */
/* Log into gitter */

const gitter = new Gitter(gitterToken);

console.log(gitter.client);

gitter.rooms.join('amark/gun')
.then(function(room) {
  console.log('Joined room: ', room.name);

  // fetch an observer for the global room
  var events = _room.streaming().chatMessages();

  sendGitter = function (msg, key) {
    room.send(msg);
  };

  // The 'chatMessages' event is emitted on each new message
  events.on('chatMessages', function(message) {
    //console.log(message.model.fromUser);
    if(message.operation == "create" && message.model.fromUser.username != 'gunchatbridge'){
      var now = new Date(Date.now());
      now = now.toISOString();
      chatGitter.get(now).put(message);
      //post initial message
      try{
        //console.log('sending',message.model.fromUser.username )
        sendDiscord.send(`[G] ${message.model.fromUser.username}: ${message.model.text}`);

      } catch(e) {console.log(e)}

    } else if (message.operation == "update" && message.model.fromUser.username != 'gunchatbridge') {
      //post a message that indicates an update
      try{
        //console.log('sending',message.model.fromUser.username )
        sendDiscord.send(`[G] ${message.model.fromUser.username}/corr: ${message.model.text}`)
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

  console.log('channel', message.channel);
  if(message.channel.id == "612645357850984473"){
    //console.log(message.author.username);
    if(message.author.username != 'gunDiscordionBridge'){
      //console.log('sending', message.author.username )
      var now = new Date(Date.now());
      now = now.toISOString();
      chatDiscord.get(now).put(message);
      sendGitter.send(`[D] ${message.author.username}: ${message.content}`);
    }

    // If the message is "ping"
    if (message.content === 'ping') {
      // Send "pong" to the same channel
      message.channel.send('pong');
    }

    sendDiscord = function (msg, key) {
      message.channel.send(msg);
    }
  }
})

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(discordToken);
