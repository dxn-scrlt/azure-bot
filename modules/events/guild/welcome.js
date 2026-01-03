const { EmbedBuilder, Events, roleMention } = require('discord.js'); // embeds, events, role mention
const config = require('../../../config.json');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.user.bot) return; // ignore bots

        const guild = member.guild;
        const welcomeChannel = await guild.channels.fetch(config.channels.general); // general channel

        const welcomeEmbed = new EmbedBuilder()
        .setColor(0xc2e0ff)
        .setTitle(`☆ ${member.displayName} joined ☆`)
        .setAuthor({ name: `welcome to ${guild.name}`, iconURL: guild.iconURL() })
        .setDescription(`☆ check <id:customize> for more roles & channels ☆\n☆ enjoy the space & the stars ☆`)
        .setImage('https://media.tenor.com/bZ57l4cit1QAAAAi/stars-cute-aesthetic.gif');

        await welcomeChannel.send({ content: `${roleMention(config.roles.welcome)} ${member}`, embeds: [welcomeEmbed] });
    }
};
