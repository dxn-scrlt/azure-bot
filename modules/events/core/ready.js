const { ActivityType, Events } = require('discord.js'); // activity types, events

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setPresence({ activities: [{ name: '/cat for a furry surprise!', type: ActivityType.Listening }], status: 'dnd' });
        console.log(`Logged in as ${client.user.tag}`);
    }
};
