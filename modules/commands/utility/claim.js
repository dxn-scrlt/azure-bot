const { InteractionContextType, SlashCommandBuilder } = require('discord.js'); // interaction context types, slash commands
const fs = require('node:fs'); // file system
const path = require('node:path'); // path

// access .json file
const claimsFile = path.resolve(process.cwd(), 'data', 'databases', 'claims.json');

module.exports = {
    data: new SlashCommandBuilder().setName('claim').setDescription('claim a prize').setContexts(InteractionContextType.BotDM),
    async execute(interaction) {
        const claimsFileData = JSON.parse(fs.readFileSync(claimsFile, 'utf8')); // read .json file

        const claim = claimsFileData[interaction.user.id]; // fetch claim by user id
        if (!claim) return await interaction.reply('No claims available');

        await interaction.reply(`Congratulations ⭑ here's your claim\n${claim}`);

        delete claimsFileData[interaction.user.id];
        fs.writeFileSync(claimsFile, JSON.stringify(claimsFileData, null, 4));
    }
};
