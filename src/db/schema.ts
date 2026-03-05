import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const reminders = sqliteTable('reminders', {
  channelId: text('channel_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  guildId: text('guild_id'),
  id: integer('id').primaryKey({ autoIncrement: true }),
  message: text('message').notNull(),
  remindAt: integer('remind_at', { mode: 'timestamp' }).notNull(),
  userId: text('user_id').notNull(),
});

export type NewReminder = typeof reminders.$inferInsert;
export type Reminder = typeof reminders.$inferSelect;

export const guildConfig = sqliteTable('guild_config', {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  guildId: text('guild_id').primaryKey(),
  starboardChannelId: text('starboard_channel_id'),
  starboardThreshold: integer('starboard_threshold').default(3),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type GuildConfig = typeof guildConfig.$inferSelect;
export type NewGuildConfig = typeof guildConfig.$inferInsert;

export const starboardMessages = sqliteTable('starboard_messages', {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  guildId: text('guild_id').notNull(),
  id: integer('id').primaryKey({ autoIncrement: true }),
  originalChannelId: text('original_channel_id').notNull(),
  originalMessageId: text('original_message_id').notNull(),
  starboardMessageId: text('starboard_message_id').notNull(),
  starCount: integer('star_count').notNull().default(0),
});

export type NewStarboardMessage = typeof starboardMessages.$inferInsert;
export type StarboardMessage = typeof starboardMessages.$inferSelect;

export const lockdownSessions = sqliteTable('lockdown_sessions', {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  excludedCategories: text('excluded_categories', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .$defaultFn(() => []),
  excludedChannels: text('excluded_channels', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .$defaultFn(() => []),
  excludedRoles: text('excluded_roles', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .$defaultFn(() => []),
  guildId: text('guild_id').notNull().primaryKey(),
  reason: text('reason'),
  type: text('type').notNull(),
  userId: text('user_id').notNull(),
});

export type LockdownSession = typeof lockdownSessions.$inferSelect;
export type NewLockdownSession = typeof lockdownSessions.$inferInsert;

export const lockdownOverwrites = sqliteTable(
  'lockdown_overwrites',
  {
    allow: text('allow').notNull(),
    channelId: text('channel_id').notNull(),
    deny: text('deny').notNull(),
    guildId: text('guild_id')
      .notNull()
      .references(() => lockdownSessions.guildId, { onDelete: 'cascade' }),
    overwriteId: text('overwrite_id').notNull(),
    overwriteType: integer('overwrite_type').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.guildId, table.channelId, table.overwriteId],
    }),
  ],
);

export type LockdownOverwrite = typeof lockdownOverwrites.$inferSelect;
export type NewLockdownOverwrite = typeof lockdownOverwrites.$inferInsert;
