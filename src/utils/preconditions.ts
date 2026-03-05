import type { UserError } from '@sapphire/framework';

import { type ChatInputCommandInteraction, MessageFlags } from 'discord.js';

export const replyWithPreconditionError = async (
  interaction: ChatInputCommandInteraction,
  error: UserError,
) => {
  if (Reflect.get(new Object(error.context), 'silent') === true) {
    return;
  }

  const content = `❌ ${error.message}`;

  if (interaction.deferred || interaction.replied) {
    await interaction.editReply({ content });

    return;
  }

  await interaction.reply({ content, flags: MessageFlags.Ephemeral });
};
