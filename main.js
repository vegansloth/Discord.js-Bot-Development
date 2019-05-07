const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true});
const botconfig = require('./botconfig.json');
const fs = require('fs');
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  
  if(err) console.log(err);
  
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands!");
    return;
  }
  
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    
  });
  
});

bot.on("ready", async () => {
  
  console.log(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`);
  
        bot.user.setActivity(`players type B.help`, {
    type: "Listening"

}); 
  
});
bot.on("message", async message => {
  
  if(message.author.bot) return;
  
  let prefix = botconfig.prefix;
  
  if(!message.content.startsWith(prefix)) return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(prefix.length);
  
  let commandFile = bot.commands.get(cmd.slice(prefix.length));
  if(commandFile) commandFile.run(bot,message,args);
  
});

bot.login(process.env.TOKEN);
