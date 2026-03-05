import { ChannelType, type PermissionOverwriteOptions } from 'discord.js';

import type {
  AllowedLockdownChannelType,
  LockdownType,
  LockdownTypeData,
} from '@/types/lockdown.js';

export const LOCKDOWN_CUSTOM_ID = {
  CancelButton: 'lockdown-cancel',
  CategorySelect: 'lockdown-category-select',
  ChannelSelect: 'lockdown-channel-select',
  ConfirmButton: 'lockdown-confirm',
  ReasonButton: 'lockdown-reason',
  ReasonInput: 'lockdown-reason-input',
  ReasonModal: 'lockdown-reason-modal',
  RoleSelect: 'lockdown-role-select',
  TypeSelect: 'lockdown-type-select',
} as const satisfies Record<string, string>;

export const LOCKDOWN_TYPE = {
  NoAccess: 'no-access',
  ReadOnly: 'read-only',
} as const satisfies Record<string, string>;

export const LOCKDOWN_TYPES = {
  [LOCKDOWN_TYPE.NoAccess]: {
    description: 'Members cannot view channels',
    label: 'No access',
  },
  [LOCKDOWN_TYPE.ReadOnly]: {
    description: 'Members can view channels but cannot send messages',
    label: 'Read-only',
  },
} as const satisfies Record<LockdownType, LockdownTypeData>;

export const ALLOWED_LOCKDOWN_CHANNEL_TYPES = [
  ChannelType.GuildText,
  ChannelType.GuildVoice,
  ChannelType.GuildStageVoice,
] as const satisfies readonly ChannelType[];

export const LOCKDOWN_PERMISSIONS = {
  [LOCKDOWN_TYPE.NoAccess]: {
    [ChannelType.GuildStageVoice]: { ViewChannel: false },
    [ChannelType.GuildText]: { ViewChannel: false },
    [ChannelType.GuildVoice]: { ViewChannel: false },
  },
  [LOCKDOWN_TYPE.ReadOnly]: {
    [ChannelType.GuildStageVoice]: {
      Speak: false,
      Stream: false,
    },
    [ChannelType.GuildText]: {
      CreatePrivateThreads: false,
      CreatePublicThreads: false,
      SendMessages: false,
      SendMessagesInThreads: false,
    },
    [ChannelType.GuildVoice]: {
      Speak: false,
      Stream: false,
    },
  },
} as const satisfies Record<
  LockdownType,
  Record<AllowedLockdownChannelType, PermissionOverwriteOptions>
>;

export const IDLE_LIMIT = 5 * 60 * 1_000;
