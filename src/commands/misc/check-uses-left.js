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

                interaction.editReply(
                    `🔄️ ES: El código de canje introducido tiene ${timesToRedeem} uso${pluralSuffix} restante${pluralSuffix}\n` +
                    `EN: The entered redemption code has ${timesToRedeem} remaining use${pluralSuffix}`
                );

                console.log(`🎫 ES: El código de canje introducido tiene ${timesToRedeem} uso${pluralSuffix} restante${pluralSuffix}`);
                console.log(`🎫 EN: The entered redemption code has ${timesToRedeem} remaining use${pluralSuffix}`);

            } else {
                interaction.editReply(
                    '❌ ES: El código de canje introducido no es válido\n' +
                    '❌ EN: The entered redemption code is not valid'
                );

                console.log('🎫 ES: El código de canje introducido no es válido');
                console.log('🎫 EN: The entered redemption code is not valid');
            }

        } catch (error) {
            console.log(`⚠️ ES: Hubo un error: ${error} ⚠️`);
            console.log(`⚠️ EN: There was an error: ${error} ⚠️`);
        }
    }
};
