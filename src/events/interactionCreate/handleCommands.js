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
                    content: 'ES: Solo Desarrolladores Pueden Ejecutar Este Comando EN: Only developers can run this command',
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.testOnly) {
            if(!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: 'ES: Este Comando No Puede Ejecutarse Aquí EN: This command cannot be executed here',
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: 'ES: No Tienes Los Permisos Necesarios Para Ejecutar Este Comando EN: You do not have the necessary permissions to execute this command',
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
                        content: 'ES: No Tengo Los Permisos Necesarios Para Ejecutar Este Comando EN: I do not have the necessary permissions to execute this command',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }
        await commandObject.callback(client, interaction)
    } catch (error) {
        console.log(`Hubo Un Error Al Ejectutar Este Comando ${error}`);
        console.log(`There was an error executing this command ${error}`);
    }

}; 