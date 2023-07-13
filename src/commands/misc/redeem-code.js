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
                member.roles.add(role);

                interaction.editReply('El Código De Canje Introducido Es Válido✅');
                console.log('🎫 El Código De Canje Introducido Es Válido✅');

                await Redeem.findOneAndUpdate(query, { timesToRedeem: timesToRedeem - 1 });

            } else if (!search) {

                interaction.editReply('El Código De Canje Introducido No Es Válido❌');
                console.log('🎫 El Código De Canje Introducido No Es Válido❌');

            } else {

                interaction.editReply('El Código De Canje Introducido Ya Fue Utilizado ⚠️');
                console.log('🎫 El Código De Canje Introducido Ya Fue Utilizado ⚠️');

                await Redeem.findOneAndDelete(query);
            }
        } catch (error) {
            
            interaction.editReply('Hubo Un Error Al Procesar El Comando, Por Favor Inténtalo De Nuevo ⚠️');
            console.log(`⚠️ Hubo un error: ${error} ⚠️`);
        }
    },
};
