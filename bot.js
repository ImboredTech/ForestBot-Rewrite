require("dotenv").config();
const { REST, Routes, Client, IntentsBitField, Collection} = require("discord.js");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const os = require('os');
const eventHandler = require("./handlers/eventHandler");
const fs = require("fs");
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.commands = new Collection();
const cookieParser = require("cookie-parser");
const urlencodedParser = require("body-parser").urlencoded({ extended: false });
const DiscordOauth2 = require('discord-oauth2');

module.exports.client = client;
app.enable("trust proxy");
app.set("etag", false);
app.use(express.static(__dirname + "/dashboard"));
app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(urlencodedParser);
process.oauth = new DiscordOauth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

app.use((req, res, next) => {
    console.log(`- ${req.method}: ${req.url} ${res.statusCode} ( by: ${req.ip} )`);
    next();
});

let files = fs.readdirSync("./dashboard/public").filter(f => f.endsWith(".js"));

files.forEach(f => {
    const file = require(`./dashboard/public/${f}`);
    if(file && file.name) {
        app.get(file.name, file.run);
        
        if(file.run2) app.post(file.name, file.run2);

        console.log(`[Dashboard] - Loaded ${file.name}`);
    }
});

//const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

//rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] })
	//.then(() => console.log('Successfully deleted all guild commands.'))
	//.catch(console.error);

//rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
	//.then(() => console.log('Successfully deleted all application commands.'))
	//.catch(console.error);

(async () => {
    try{
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");
        eventHandler(client);
        client.login(process.env.TOKEN);
        app.listen(90, () => console.log("App on port 90"));
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();