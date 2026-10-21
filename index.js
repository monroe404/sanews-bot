const {
    Client,
    GatewayIntentBits,
    REST,
    Routes
} = require("discord.js");

const config = require("./config");
const acceptPayment = require("./commands/acceptpayment");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

const commands = [
    acceptPayment.data.toJSON()
];

client.once("ready", async () => {
    console.log(`SA News Bot online sebagai ${client.user.tag}`);

    try {
        const rest = new REST({ version: "10" })
            .setToken(config.TOKEN);

        await rest.put(
            Routes.applicationGuildCommands(
                config.CLIENT_ID,
                config.GUILD_ID
            ),
            { body: commands }
        );

        console.log("Slash command berhasil didaftarkan.");
    } catch (error) {
        console.error("Gagal mendaftarkan command:", error);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "acceptpayment") {
        try {
            await acceptPayment.execute(interaction, config);
        } catch (error) {
            console.error(error);

            const response = {
                content: "❌ Terjadi kesalahan saat memproses pembayaran.",
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(response);
            } else {
                await interaction.reply(response);
            }
        }
    }
});

if (!config.TOKEN) {
    console.error("DISCORD_TOKEN belum diatur!");
    process.exit(1);
}

client.login(config.TOKEN);