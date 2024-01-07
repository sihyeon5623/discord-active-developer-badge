const { createInterface } = require('node:readline');
const { execSync } = require('child_process');
const fetch = require('node-fetch');
const { Client, Routes } = require('discord.js');
const keep_alive = require('./keep_alive.js');


const ping = {
  name: 'ping',
  description: 'Pings the bot and shows the latency'
}

// Command Example
const 초대링크 = {
  name:'초대링크',
  description:'핑 밖에 기능이 없는 봇을 초대할 수 있습니다'
}

const commands = [ping, 초대링크]; // Add your commands with commas to add them to the bot!
// Join the Discord for support: https://discord.gg/M5MSE9CvNM

const client = new Client({ intents: [] });
const rl = createInterface({ input: process.stdin, output: process.stdout });


client.on('interactionCreate', (interaction) => {
  if (interaction.commandName === 'ping') {
    interaction.reply(`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);  
  } else if(interaction.commandName === '초대링크') { // This is the example command's name!
    interaction.reply('https://discord.com/api/oauth2/authorize?client_id=1160576907893551225&permissions=8&scope=bot');
  } else { // a response if you forget to add the command here
    interaction.reply('this command\'s response has not been added yet!');
  }
});

const question = (q) => new Promise((resolve) => rl.question(q, resolve));
(async ()=>{
  const token = process.env['token']
  if(!token) throw new Error('Invalid token');

  const ratelimitTest = await fetch(`https://discord.com/api/v9/invites/discord-developers`);

  if(!ratelimitTest.ok) {
    await question(`Uh oh, looks like the node you're on is currently being blocked by Discord. Press the "Enter" button on your keyboard to be reassigned to a new node. (you'll need to rerun the program once you reconnect)`)

    // This kills the container manager on the repl forcing Replit to assign the repl to another node with another IP address (if the ip is globally rate limited)
    //^ in short: Restarts the bot to be used again/attempted to start up again!
    execSync('kill 1');
    return;
  };
  
  await client.login(token).catch((err) => {
    throw err
  });

  await client.rest.put(Routes.applicationCommands(client.user.id), { body: commands });

  console.log('DONE | Application/Bot is up and running. DO NOT CLOSE THIS TAB UNLESS YOU ARE FINISHED USING THE BOT, IT WILL PUT THE BOT OFFLINE.');
})();
