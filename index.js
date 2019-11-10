const botconfig = require("./Json Files/botconfig.json");
const login     = require("./Json Files/login.json");
const Discord   = require("discord.js");
const colours   = require ("./Json Files/colours.json");
const antispam  = require('discord-anti-spam');
const fs        = require("fs");
const path      = require('path');
const bot       = new Discord.Client({ disableEveryone: true });
const ayy = bot.emojis.find(emoji => emoji.name === "ayy");

bot.commands = new Discord.Collection();
bot.aliases  = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Command not found.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded...`);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
        bot.aliases.set(alias, props.help.name);
        });

    });

});

bot.on("ready", async () => {
    antispam(bot, {
        warnBuffer: 5, 
        maxBuffer: 15, 
        interval: 2000, 
        warningMessage: "Please stop spamming!", 
        banMessage: "Got banned for spamming!",  
        maxDuplicatesWarning: 7,
        maxDuplicatesBan: 10, 
        deleteMessagesAfterBanForPastDays: 7,
	exemptRoles: ["★ Owner"],
        exemptUsers: ["lxkey#2036"] 
      })
    console.log(`Logged in as ${bot.user.username}...`);
    console.log(`${bot.user.username} is in ${bot.guilds.size} Discord Servers.`);
    setInterval(() => {
        bot.user.setActivity(`.help | Dev: lxkey`, { type: "WATCHING" }) //PLAYING, STREAMING, LISTENING, WATCHING
        bot.user.setActivity(`over ${bot.guilds.size} Servers.`, { type : "WATCHING" }) //PLAYING, STREAMING, LISTENING, WATCHING
    }, 3000);
    bot.user.setStatus(`online`) //online, idle, dnd, invisible
});

bot.on('message', (message) => {
    if (message.content.includes('discord.gg/'||'discordapp.com/invite/')) 
    {
        if (!message.member.roles.some(r=>["Administration", "VIP / Friends"].includes(r.name)) )
        {
            message.delete().catch()
            let kickEmbed = new Discord.RichEmbed()
        
            .setTitle("Discord Helper")
            .setColor(colours.red_light)
            .setDescription(`\n**Target:** ${message.author}\n\n**Staff:** Discord Helper\n\n**Reason:** Invite links are not permitted on this server.\n`);
                
            message.channel.send(kickEmbed)
        }
    }
  })

  bot.on('message', (message) => {
      if(message.content === "VC"){
          
      }
  })

  bot.on('message', (message) => {
    if(message.content === "ayy") {
        const ayy = bot.emojis.find(emoji => emoji.name === "ayy");
        message.reply(`${ayy} LMAO`);
     }
  })

bot.on('message', (message) => {
    if (message.content.includes('youtube.com/')) 
    {
        if (!message.member.hasPermission("EMBED_LINKS"))
        {
            message.delete().catch()
            let kickEmbed = new Discord.RichEmbed()
        
            .setTitle("Discord Helper")
            .setColor(colours.red_light)
            .setDescription(`\n**Target:** ${message.author}\n\n**Staff:** Discord Helper\n\n**Reason:** YouTube links are not permitted in this chat.\n`);
                
            message.channel.send(kickEmbed)
        }
    }
  })

bot.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix  = botconfig.prefix;
    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();
    let command;

    if (!message.content.startsWith(prefix)) return;

    if (bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else {
        command = bot.commands.get(bot.aliases.get(cmd));
    }

    if (command) command.run(bot, message, args);

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Console Chatter

let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g)
    bot.channels.get("635080507419394060").send(x.join(" "));
});

bot.login(login.token);
