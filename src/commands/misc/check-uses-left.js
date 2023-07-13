const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Redeem = require('../../models/add_schema');

module.exports = {
    name: 'check_uses_left',
    description: 'Use this command to check the uses left of a code',
    options: [
        {
            name: 'code-to-check',
            description: 'The Code To Be Checked',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    async callback(client, interaction) {
        await interaction.deferReply();

        const guildId = interaction.guildId;
        const codeToCheck = interaction.options.getString('code-to-check');

        const query = {
            guildId,
            redeemCode: codeToCheck,
        };

        try {
            const search = await Redeem.findOne(query);

            if (search) {
                const timesToRedeem = search.timesToRedeem;
                const pluralSuffix = timesToRedeem === 1 ? '' : 's';

                interaction.editReply(`🔄️ El Código De Canje Introducido Tiene ${timesToRedeem} Uso${pluralSuffix} Restante${pluralSuffix}`);
                console.log(`🎫 El Código De Canje Introducido Tiene ${timesToRedeem} Uso${pluralSuffix} Restante${pluralSuffix}`);
            } else {
                interaction.editReply('❌ El Código De Canje Introducido No Es Válido');
                console.log('🎫 El Código De Canje Introducido No Es Válido');
            }

        } catch (error) {
            console.log(`⚠️ Hubo un error: ${error} ⚠️`);
        }
    }
};
