const {Client} = require("pg");
const axios = require("axios");

module.exports = {
  name: "message_logging",
  execute: async (message, discordclient) => {

    
    const bearerToken = "822ca389f5560fec7410bd387bdac30cf87379d1608de0b400b903549af53bff5942217c08fdf0fc1ecf3f06b681e0684c1c15a7a6dd1c74533524abe31f93bcf0484c0f63861763afa589ba6750879d6c224fa4ad2f3b7787c32fe518ab6115b98bd6b44e1d0fad3f1cd68a5dafa251c0268e815b7e1c057b7573f91198ed61"; // This wouldn't work for anyone lol cuz its localhost

    const client = new Client({
      user: process.env.user,
      host: process.env.host,
      database: process.env.db,
      password: process.env.passwd,
      port: process.env.port,
    });

    await client.connect();
    
    const searchquery = `
      SELECT * FROM tickets WHERE channel_id = ${message.channel.id};
    `

    const searchres = await client.query(searchquery);

    if(searchres.rowCount == 1){

      const ticket_id = searchres.rows[0].id;
      var apiUrl = "http://localhost:1337/api/ticket-messages";

      var requestData = {
        "data": {
          "guildID": message.guild.id,
          "guildName": message.guild.name,
          "UserID": message.author.id,
          "Username": message.author.username,
          "message_content": message.content
        }
      }
      
      // Set up the request configuration
      var config = {
        method: "post", // Use PUT method
        url: apiUrl,
        headers: { 
          "Authorization": `bearer ${bearerToken}`, // Add bearer token to headers
          "Content-Type": "application/json" // Specify the content type
        },
        data: requestData // Set the data to be sent in the request body
      };
      
      // Make the PUT request
      var response = await axios(config)
      id = response.data.data.id;

      var apiUrl = `http://localhost:1337/api/tickets/${ticket_id}`;

      var requestData = {
        "data": {
          "messages": {
            "connect": [id]
          }
        }
      }
      
      // Set up the request configuration
      var config = {
        method: "put", // Use PUT method
        url: apiUrl,
        headers: { 
          "Authorization": `bearer ${bearerToken}`, // Add bearer token to headers
          "Content-Type": "application/json" // Specify the content type
        },
        data: requestData // Set the data to be sent in the request body
      };
      
      // Make the PUT request
      var response = await axios(config) 


    }
  },
};