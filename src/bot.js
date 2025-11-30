require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});
client.on('ready', (c) => {
    client.user.setPresence({ activities: [{ name: 'Redeeming Codes!' }], status: 'online' });
}); 

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`📊Conectado a MongoDB📊`);
        console.log(`📊Connected to MongoDB 📊`);
        eventHandler(client);
        client.login(process.env.TOKEN); 
        
    } catch (error) {
        console.log(`⚠️ Hubo un error : ${error}⚠️`);
        console.log(`⚠️ There was an error: ${error}⚠️`);
    }
})();

