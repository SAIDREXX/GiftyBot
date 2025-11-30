const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`🗑️ ES: El Comando "${name}" Fue Eliminado`);
                    console.log(`🗑️ EN: The Command "${name}" Was Deleted`);
                    continue;
                }
                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, { description, options });
                    console.log(`🔁 ES: El Comando "${name}" Fue Editado`);
                    console.log(`🔁 EN: The Command "${name}" Was Edited`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`⏩ ES: Saltando El Comando "${name}" Porque Fue Establecido como "Eliminado"`);
                    console.log(`⏩ EN: Skipping The Command "${name}" Because It Was Marked as "Deleted"`);
                    continue;
                }
                await applicationCommands.create({
                    name,
                    description,
                    options
                });
                console.log(`✅ ES: El Comando "${name}" Fue Registrado Exitosamente`);
                console.log(`✅ EN: The Command "${name}" Was Registered Successfully`);
            }
        }
        
    } catch (error) {
        console.log(`⚠️ ES: Ocurrió un Error: ${error}`);
        console.log(`⚠️ EN: An Error Occurred: ${error}`);
    }
    
};
