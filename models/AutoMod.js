const mongoose = require("mongoose");

let AutoMod = new mongoose.Schema({
    guildId: String,
    automodEnabled: Boolean,
});
module.exports = mongoose.model("AutoMod", AutoMod);