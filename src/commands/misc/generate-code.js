const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { generarCodigoCanje } = require('../../utils/generate-code');
const Redeem = require('../../models/add_schema');

module.exports = {
    name: 'generate_code',
    description: 'Use this command to generate a redeem code',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //options: Object[],
    //deleted: Boolean,
    options: [
        {
            name: 'role-to-redeem',
            description: 'The Role That Will Be Assigned To The User Who Redeems The Code ',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'times-to-redeem',
            description: 'The Amount Of Times The Code Can Be Redeemed',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    async callback(client, interaction) {
        await interaction.deferReply();

        const guildId = interaction.guildId;
        const roleID = interaction.options.get('role-to-redeem').role.id;
        const timesToRed = interaction.options.get('times-to-redeem').value;

        if (timesToRed < 1) {
            interaction.editReply('**El número de veces que se puede canjear el código debe ser mayor a 0**');
            return;
        }

        const codigoGenerado = generarCodigoCanje();
        console.log(`🎫 El Código de canje generado es ${codigoGenerado}`);
        interaction.editReply(`Código de canje generado: **${codigoGenerado}** para el rol <@&${roleID}> con ${timesToRed} usos`);

        const query = {
            guildId,
            redeemCode: codigoGenerado,
            roleGiven: roleID,
        };

        try {
            const add = await Redeem.findOne(query);

            if (!add) {
                const newAdd = new Redeem({
                    guildId,
                    redeemCode: codigoGenerado,
                    roleGiven: roleID,
                    timesToRedeem: timesToRed,
                });
                await newAdd.save();
            }
        } catch (error) {
            console.log(`⚠️ Hubo un error: ${error} ⚠️`);
        }
    },
};
