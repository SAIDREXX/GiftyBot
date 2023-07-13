const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if(!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: 'Solo Desarrolladores Pueden Ejecutar Este Comando',
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.testOnly) {
            if(!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: 'Este Comando No Puede Ejecutarse Aquí',
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: 'No Tienes Los Permisos Necesarios Para Ejecutar Este Comando',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }
        
        if (commandObject.botPermissions?.length) {
            for (const permissions of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permissions)) {
                    interaction.reply({
                        content: 'No Tengo Los Permisos Necesarios Para Ejecutar Este Comando',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }
        await commandObject.callback(client, interaction)
    } catch (error) {
        console.log(`Hubo Un Error Al Ejectutar Este Comando ${error}`);
    }

}; 