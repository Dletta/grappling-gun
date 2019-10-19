/* Imports */

var Gitter = require('node-gitter');

/* GLOBALS */

var gitterToken = process.argv[2];

console.log('starting service',process.argv[2]);

/* ---- GITTER ----- */
/* Log into gitter */

const gitter = new Gitter(gitterToken);

var notify = function() {
  gitter.rooms.join('amark/gun')
  .then(function(room) {
    console.log('Joined room: ', room.name);
    var string = "[PUBLIC ANNOUNCEMENT]::"
    string += "Since many in the Community are experiencing issues with Gitter";
    string += " we are recommending to use Discord. The invite link is https://discord.gg/B8bNmZ2";
    room.send(string);
    // fetch an observer for the global room
  })
  .catch(function(err) {
    console.log('Not possible to join the room: ', err);
  })
};

notify();
