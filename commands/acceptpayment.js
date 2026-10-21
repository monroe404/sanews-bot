const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("acceptpayment")
        .setDescription("Mengirim konfirmasi pembayaran SA News.")
        .addIntegerOption(option =>
            option
                .setName("nominal")
                .setDescription("Nominal pembayaran yang diterima.")
                .setMinValue(1)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("customer")
                .setDescription("Nama customer yang melakukan pembayaran.")
                .setRequired(true)
        ),

    async execute(interaction, config) {
        const staffRoleId = config.STAFF_ROLE_ID;

        if (
            staffRoleId &&
            !interaction.member.roles.cache.has(staffRoleId)
        ) {
            return interaction.reply({
                content: "❌ Command ini hanya dapat digunakan oleh staff SA News.",
                ephemeral: true
            });
        }

        const nominal = interaction.options.getInteger("nominal");
        const customer = interaction.options.getString("customer");

        const formatRupiah = (amount) =>
            "Rp" + amount.toLocaleString("id-ID");

        const embed = new EmbedBuilder()
            .setColor(0xF28C28)
            .setTitle("💰 SAN — PAYMENT LOGS")
            .setDescription(
                "Pembayaran kamu telah berhasil dikonfirmasi oleh tim **San Andreas Network**.\n\n" +
                "━━━━━━━━━━━━━━━━━━━━"
            )
            .addFields(
                {
                    name: "👤 Staff",
                    value: `${interaction.user}`,
                    inline: false
                },
                {
                    name: "🧾 Customer",
                    value: customer,
                    inline: false
                },
                {
                    name: "💵 Nominal Pembayaran",
                    value: `**${formatRupiah(nominal)}**`,
                    inline: false
                },
                {
                    name: "✅ Status Pembayaran",
                    value: "**ACCEPTED**",
                    inline: false
                },
                {
                    name: "📅 Tanggal",
                    value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                    inline: false
                }
            )
            .addFields({
                name: "\u200B",
                value:
                    "━━━━━━━━━━━━━━━━━━━━\n" +
                    "📞 **CALL CENTER**\n" +
                    "Jika membutuhkan bantuan, silakan hubungi Call Center kami.\n\n" +
                    "☎️ **9-4-4**"
            })
            .setFooter({
                text: "SAN NEWS © 2026"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};