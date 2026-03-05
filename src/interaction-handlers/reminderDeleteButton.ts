import type { ButtonInteraction } from 'discord.js';

import {
  InteractionHandler,
  InteractionHandlerTypes,
} from '@sapphire/framework';
import { and, eq } from 'drizzle-orm';

import { buildDeleteButtons } from '@/components/reminder.js';

import { db } from '../db/index.js';
import { reminders } from '../db/schema.js';

export class ReminderDeleteButtonHandler extends InteractionHandler {
  constructor(
    context: InteractionHandler.LoaderContext,
    options: InteractionHandler.Options,
  ) {
    super(context, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  override parse(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith('delete_reminder_')) {
      return this.none();
    }

    const reminderId = Number(
      interaction.customId.replace('delete_reminder_', ''),
    );

    return this.some({ reminderId });
  }

  async run(
    interaction: ButtonInteraction,
    { reminderId }: InteractionHandler.ParseResult<this>,
  ) {
    await db
      .delete(reminders)
      .where(
        and(
          eq(reminders.id, reminderId),
          eq(reminders.userId, interaction.user.id),
        ),
      );

    const remainingReminders = await db
      .select()
      .from(reminders)
      .where(eq(reminders.userId, interaction.user.id))
      .orderBy(reminders.remindAt);

    await (remainingReminders.length === 0
      ? interaction.update({
          components: [],
          content: '✅ All reminders deleted!',
        })
      : interaction.update({
          components: buildDeleteButtons(remainingReminders),
          content: '🗑️ Click a button to delete a reminder:',
        }));
  }
}
