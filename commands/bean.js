exports.run = async (bot, message, args, level) => {
  let beaned = args.join(" ");
	m.edit(`${beaned} has been **_beaned_**!`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	botPerms: [],
	memberPerms: []
};

exports.help = {
	name: 'bean',
	description: 'beans beans beans',
	usage: 'bean 5468'
};
