const mongoose = require("mongoose");

let TicketInfo = new mongoose.Schema({
    guildId: String,
    roleId: String,
});
module.exports = mongoose.model("TicketInfo", TicketInfo);