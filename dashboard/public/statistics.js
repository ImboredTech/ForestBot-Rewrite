const client = require("../../bot").client;
const fs = require("fs");
module.exports = {
    name: "/statistics",
    run: async(req, res) => {
        let args = {
            users: client.users.cache.size,
            guilds: client.guilds.cache.size,
        }

        res.render("./dashboard/html/statistics.ejs", args);
    }
}