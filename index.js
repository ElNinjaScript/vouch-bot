const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName("vouch")
        .setDescription("Vouch a user as scam or legit.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to vouch")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("type")
                .setDescription("scam or legit")
                .setRequired(true)
                .addChoices(
                    { name: "legit", value: "legit" },
                    { name: "scam", value: "scam" }
                )
        )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log("Slash command /vouch registered!");
    } catch (e) {
        console.error(e);
    }
})();

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "vouch") {
        const target = interaction.options.getUser("user");
        const type = interaction.options.getString("type");

        interaction.reply(
            `**${interaction.user} vouched ${target} as \`${type.toUpperCase()}\`**`
        );
    }
});

client.login(TOKEN);
