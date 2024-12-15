const functions = require("./pg");

json = {
  "premium":{  
    "admin": false,
    "automod": true,
    "configuration" : true,
    "infraction": true,
    "moderation": true,
    "report": true,
    "ticketing": false,
    "utilites": true,
  },
  "non_premium":{  
    "admin": false,
    "automod": false,
    "configuration" : true,
    "infraction": true,
    "moderation": true,
    "report": true,
    "ticketing": false,
    "utilites": true,
  }
}

async function pg_table(guildid){
  const pg = await functions.pg(`SELECT premium FROM public.allowed_guilds WHERE guild_id = ${guildid}`)
  return pg.rows[0].premium 
}

module.exports = {
  premium: async (guildid, plugin_cat) => {
    const premium_check = await pg_table(guildid)
    
    if(premium_check == true){
      return json.premium[plugin_cat]
    } else {
      return json.non_premium[plugin_cat]
    }
  }
};