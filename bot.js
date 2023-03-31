require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");
//const express = require("express");
//const app = express();
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
// THE FOLLOWING COMMENTED IMPORTS ARE FOR THE FUTURE DASHBOARD.
// const cookieParser = require("cookie-parser");
// const urlencodedParser = require("body-parser").urlencoded({ extended: false });
// const DiscordOauth2 = require('discord-oauth2');

module.exports.client = client;
// app.enable("trust proxy");
// app.set("etag", false);
// app.use(express.static(__dirname + "/dashboard"));
// app.set("views", __dirname);
// app.set("view engine", "ejs");
// app.use(cookieParser());
// app.use(urlencodedParser);
// process.oauth = new DiscordOauth2({
    //clientId: process.env.CLIENT_ID,
    //clientSecret: process.env.CLIENT_SECRET,
    //redirectUri: process.env.REDIRECT_URI,
//});

//app.use((req, res, next) => {
    //console.log(`- ${req.method}: ${req.url} ${res.statusCode} ( by: ${req.ip} )`);
    //next();
//});

// Request Handler

// Get all the files in the public folder that ends with .js
// let files = fs.readdirSync("./dashboard/public").filter(f => f.endsWith(".js"));

// Looping through all files in it
// files.forEach(f => {
    // requiring the file.
    // const file = require(`./dashboard/public/${f}`);
    // if the file exists and has a name, do the following:
    // if(file && file.name) {
        // set "name" from inside the file as a route, and run the function.
        // app.get(file.name, file.run);
        
        // if(file.run2) app.post(file.name, file.run2);

        // Logs which files are being loaded.
        //console.log(`[Dashboard] - Loaded ${file.name}`);
    //}
//});

(async () => {
    try{
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");
        eventHandler(client);
        client.login(process.env.TOKEN);
        // app.listen(80, () => console.log("App on port 80"));
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();