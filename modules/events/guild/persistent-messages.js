const { bold, EmbedBuilder, Events, inlineCode, subtext, userMention } = require('discord.js'); // bold font, embeds, events, inline code block, subtext format, user mention
const fs = require('node:fs'); // file system
const path = require('node:path'); // path
const config = require('../../../config.json');

// access .json file
const persistentMessagesFile = path.resolve(process.cwd(), 'data', 'databases', 'persistent-messages.json');
const persistentMessagesFileData = JSON.parse(fs.readFileSync(persistentMessagesFile, 'utf8'));

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const guild = message.guild;
        const ventChannel = await guild.channels.fetch(config.channels.vent);
        const introductionsChannel = await guild.channels.fetch(config.channels.introductions);
        const anonymousChannel = await guild.channels.fetch(config.channels.anonymous);
        const persistentMessagesChannels = [ventChannel, introductionsChannel, anonymousChannel]; // array of channels with persistent messages
        
        if (message.author === message.client.user || !persistentMessagesChannels.includes(message.channel)) return; // ignore all other messages

        const persistentMessageEmbed = new EmbedBuilder()
        .setColor(0xc2e0ff)
        .setAuthor({ name: 'Persistent Message', iconURL: guild.iconURL() })
        .setFooter({ text: `This persistent message is brought to you by ${message.client.user.username}` });

        let persistentMessageEmbedDescription = `${bold('Welcome to')} ${message.channel}\n\n`;
        switch (message.channel) {
            case ventChannel:
                persistentMessageEmbedDescription += `* Follow rules when posting\n* Reach out to a crisis resource or hotline if you're experiencing a crisis.\n* This is not a professional support server.`;
                break;
            case introductionsChannel:
                persistentMessageEmbedDescription += `${subtext('Scroll up for members\' introductions')}\n\n${bold('Guide Template')}\n\n⋆｡°✩⋆｡°✩ about me ⋆｡°✩⋆｡°✩\nᯓ★| name:\nᯓ★| pronouns:\nᯓ★| age:\n\n⋆｡°✩⋆｡°✩ favorites ⋆｡°✩⋆｡°✩\nᯓ★| colors:\nᯓ★| songs:\nᯓ★| films/shows:\nᯓ★| hobbies/interests:\nᯓ★| foods/drinks:\n\n⋆｡°✩⋆｡°✩ more info ⋆｡°✩⋆｡°✩\nᯓ★| likes:\nᯓ★| dislikes:\nᯓ★| timezone:\nᯓ★| frq/dm status:\nᯓ★| extra:`;
                break;
            case anonymousChannel:
                persistentMessageEmbedDescription += `* Follow rules when posting\n* Read-only channel; send a confession message using ${userMention('712011923176030229')}'s ${inlineCode('/confess')} or ${inlineCode('/reply')}\n* Reach out to a crisis resource or hotline if you're experiencing a crisis.\n* This is not a professional support server.`;
                break;
        }
        persistentMessageEmbed.setDescription(persistentMessageEmbedDescription);

        // read .json file and access old message id
        const oldMessage = await message.channel.messages.fetch(persistentMessagesFileData[message.channelId]).catch(() => null);
        if (oldMessage) await oldMessage.delete();

        const newMessage = await message.channel.send({ embeds: [persistentMessageEmbed] });

        // write .json file and store new message id
        persistentMessagesFileData[message.channelId] = newMessage.id;
        fs.writeFileSync(persistentMessagesFile, JSON.stringify(persistentMessagesFileData, null, 2));
    }
};
