exports.run = async (bot, message, args, level) => {
    const Discord = require('discord.js');
    list = await bot.getSetting('giveme', message.guild);
    if (args[0] == 'add') {
        if (!message.member.hasPermissions('MANAGE_ROLES')) return message.channel.send("You don't have the perms required to add roles to the giveme! Sorry!")
        role = args.splice(1).join(' ')
        if (!message.guild.roles.find('name', role)) return message.channel.send('That role was not found in this server! Sorry!')
        if (list == "none") {
            bot.setSetting('giveme', role, message);
        } else {
            list += `|${role}`
            bot.setSetting('giveme', list, message);
        }
        return message.channel.send(`Added the \`${role}\` to the giveme list!`);
    } else if (list == 'none') {
        return message.channel.send('There are no roles to self assign! To add a role, use \`giveme add <role name>\`.')
    } else if (!args[0]) {
        return message.channel.send('Please include a role to self-assign!')
    } else if (args[0] == 'list') {
        str = "";
        givemeList = list.split('|')
        for (i=0; i<givemeList.length; i++){
            str += `${givemeList[i]} \n`
        };
        return message.channel.send(str);
    } else if (args[0] == 'delete') {
        if (!message.member.hasPermissions('MANAGE_ROLES')) return message.channel.send("You don't have the perms required to delete roles from the giveme! Sorry!")
        role = args.splice(1).join(' ')
        deleteList = list.split('|');
        if (deleteList.indexOf(role) > -1) {
            deleteList.splice(deleteList.indexOf(role), 1);
            list = deleteList.join('|');
            bot.setSetting('giveme', list, message);
            return message.channel.send(`Removed the \`${role}\` role from the giveme list!`);
        } else {
            return message.channel.send("That role was not found in the list!")
        }
    } else if (args[0] == 'remove') {
        removeRoles = args.splice(1).join(" ").split(', ');
        roles = list.split('|');
        didntHave = 0;
        removed = 0;
        removedNames = "";
        couldnt = 0;
        for (i=0; i<removeRoles.length; i++){
            if (roles.indexOf(removeRoles[i])>-1){
                if (!message.member.roles.find('name', removeRoles[i])) {
                    didntHave += 1;
                    didntHaveNames += `${removeRoles[i]}\n`
                } else {
                    message.member.removeRole(message.guild.roles.find('name', removeRoles[i]))
                    removed += 1;
                    removedNames += `${removeRoles[i]}\n`
                }
            } else {
                couldnt += 1;
            }
        }
        removeEmbed = new Discord.RichEmbed()
            .setTitle("Giveme Remove")
        if (removed > 0) removeEmbed.addfield(`Removed ${removed} roles!`, removedNames);
        if (didntHave >0) removeEmbed.addfield(`You didn't have ${didntHave} roles!`, didntHaveNames);
        if (couldnt > 0) removeEmbed.addfield(`Couldn't remove ${couldnt} roles!`, 'The roles requested either don\'t exist or aren\'t part of the roles able to be removed with the bot. To show a list of the roles able to be removed, run \`!giveme list\`');
        return message.channel.send({embed: removeEmbed});
    } else {
        addRoles = args.join(" ").split(', ');
        roles = list.split('|');
        alreadyHad = 0;
        added = 0;
        addedNames = "";
        couldnt = 0;
        for (i=0; i<addRoles.length; i++){
            if (roles.indexOf(addRoles[i])>-1){
                if (message.member.roles.find('name', addRoles[i])) {
                    alreadyHad += 1;
                    alreadyHadNames += `${addRoles[i]}`
                } else {
                    message.member.addRole(message.guild.roles.find('name', addRoles[i]))
                    added += 1;
                    addedNames += `${addRoles[i]}`
                }
            } else {
                couldnt += 1;
            }
        }
        addEmbed = new Discord.RichEmbed()
            .setTitle("Giveme Add")
        if (added > 0) addEmbed.addfield(`Added ${added} roles!`, addedNames);
        if (alreadyHad >0) addEmbed.addfield(`You already had ${alreadyHad} roles!`, alreadyHadNames);
        if (couldnt > 0) addEmbed.addfield(`Couldn't add ${couldnt} roles!`, 'The roles requested either don\'t exist or aren\'t part of the roles able to be added with the bot. To show a list of the roles able to be added, run \`!giveme list\`');
        return message.channel.send({embed: addEmbed});
    }
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['gibme', 'optin'],
	botPerms: [],
	memberPerms: []
};

exports.help = {
	name: 'giveme',
	description: 'Self assigns a role, run giveme list to see a set of roles avaliable',
	usage: 'giveme <role name>'
};