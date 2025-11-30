const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Redeem = require('../../models/add_schema');

module.exports = {
    name: 'redeem_code',
    description: 'Use this command to redeem a code',
    options: [
        {
            name: 'code-to-redeem',
            description: 'The Code To Be Redeemed',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    botPermissions: [PermissionFlagsBits.Administrator],

    async callback(client, interaction) {
        await interaction.deferReply();

        const guildId = interaction.guildId;
        const codigoValidado = interaction.options.getString('code-to-redeem');

        const query = {
            guildId,
            redeemCode: codigoValidado,
        };

        try {
            const search = await Redeem.findOne(query);

            if (search && search.timesToRedeem > 0) {
                const { timesToRedeem, roleGiven } = search;
                const role = interaction.guild.roles.cache.get(roleGiven);
                const member = interaction.member;
                await member.roles.add(role);

                interaction.editReply(
                    '✅ ES: El Código De Canje Introducido Es Válido\n' +
                    `✅ EN: The entered redeem code is valid`
                );
                console.log('🎫 ES: El Código De Canje Introducido Es Válido');
                console.log('🎫 EN: The entered redeem code is valid');

                await Redeem.findOneAndUpdate(query, { timesToRedeem: timesToRedeem - 1 });

            } else if (!search) {

                interaction.editReply(
                    '❌ ES: El Código De Canje Introducido No Es Válido\n' +
                    '❌ EN: The entered redeem code is not valid'
                );
                console.log('🎫 ES: El Código De Canje Introducido No Es Válido');
                console.log('🎫 EN: The entered redeem code is not valid');

            } else {

                interaction.editReply(
                    '⚠️ ES: El Código De Canje Introducido Ya Fue Utilizado\n' +
                    '⚠️ EN: The redeem code has already been used'
                );
                console.log('🎫 ES: El Código De Canje Introducido Ya Fue Utilizado');
                console.log('🎫 EN: The redeem code has already been used');

                await Redeem.findOneAndDelete(query);
            }
        } catch (error) {
            interaction.editReply(
                '⚠️ ES: Hubo Un Error Al Procesar El Comando, Por Favor Inténtalo De Nuevo\n' +
                '⚠️ EN: There was an error processing the command, please try again'
            );
            console.log(`⚠️ ES: Hubo un error: ${error}`);
            console.log(`⚠️ EN: There was an error: ${error}`);
        }
    },
};
