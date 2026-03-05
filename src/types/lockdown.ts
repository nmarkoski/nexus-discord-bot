import type { NonThreadGuildBasedChannel, OverwriteData } from 'discord.js';

import type {
  ALLOWED_LOCKDOWN_CHANNEL_TYPES,
  LOCKDOWN_TYPE,
} from '@/constants/lockdown.js';
import type { NewLockdownOverwrite } from '@/db/schema.js';

export type AllowedLockdownChannelType =
  (typeof ALLOWED_LOCKDOWN_CHANNEL_TYPES)[number];

export type LockdownChannelPlan = {
  channel: NonThreadGuildBasedChannel & { type: AllowedLockdownChannelType };
  newOverwrites: OverwriteData[];
  overwriteRows: NewLockdownOverwrite[];
};

export type LockdownSelections = {
  excludedCategories?: string[];
  excludedChannels?: string[];
  excludedRoles?: string[];
  reason?: string;
  type?: LockdownType;
};

export type LockdownType = (typeof LOCKDOWN_TYPE)[keyof typeof LOCKDOWN_TYPE];

export type LockdownTypeData = {
  description: string;
  label: string;
};
