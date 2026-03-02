import {
  bold,
  ButtonBuilder,
  ButtonStyle,
  channelMention,
  ChannelSelectMenuBuilder,
  ChannelType,
  ContainerBuilder,
  heading,
  HeadingLevel,
  italic,
  LabelBuilder,
  ModalBuilder,
  roleMention,
  RoleSelectMenuBuilder,
  SeparatorSpacingSize,
  StringSelectMenuBuilder,
  subtext,
  TextInputBuilder,
  TextInputStyle,
  time,
  TimestampStyles,
  userMention,
} from 'discord.js';

import type { LockdownSession } from '@/db/schema.js';
import type { LockdownType } from '@/types/lockdown.js';

import {
  ALLOWED_LOCKDOWN_CHANNEL_TYPES,
  LOCKDOWN_CUSTOM_ID,
  LOCKDOWN_TYPES,
} from '@/constants/lockdown.js';

export const buildActivationComponent = (
  selectedType?: LockdownType,
  disabled = false,
) => {
  const typeSelect = new StringSelectMenuBuilder()
    .setCustomId(LOCKDOWN_CUSTOM_ID.TypeSelect)
    .setRequired(true)
    .setPlaceholder('Select lockdown type')
    .setOptions(
      Object.entries(LOCKDOWN_TYPES).map(([type, { description, label }]) => ({
        default: selectedType === type,
        description,
        label,
        value: type,
      })),
    )
    .setDisabled(disabled);

  const categorySelect = new ChannelSelectMenuBuilder()
    .setCustomId(LOCKDOWN_CUSTOM_ID.CategorySelect)
    .setChannelTypes(ChannelType.GuildCategory)
    .setPlaceholder('Select categories to exclude')
    .setMinValues(0)
    .setMaxValues(25)
    .setDisabled(disabled);

  const channelSelect = new ChannelSelectMenuBuilder()
    .setCustomId(LOCKDOWN_CUSTOM_ID.ChannelSelect)
    .setChannelTypes(...ALLOWED_LOCKDOWN_CHANNEL_TYPES)
    .setPlaceholder('Select channels to exclude')
    .setMinValues(0)
    .setMaxValues(25)
    .setDisabled(disabled);

  const roleSelect = new RoleSelectMenuBuilder()
    .setCustomId(LOCKDOWN_CUSTOM_ID.RoleSelect)
    .setPlaceholder('Select roles to exclude')
    .setMinValues(0)
    .setMaxValues(25)
    .setDisabled(disabled);

  const confirmButton = new ButtonBuilder()
    .setCustomId(LOCKDOWN_CUSTOM_ID.ConfirmButton)
    .setStyle(ButtonStyle.Danger)
    .setLabel('Confirm')
    .setDisabled(disabled);

  const reasonButton = new ButtonBuilder()
    .setCustomId(LOCKDOWN_CUSTOM_ID.ReasonButton)
    .setStyle(ButtonStyle.Primary)
    .setLabel('Set Reason')
    .setDisabled(disabled);

  const cancelButton = new ButtonBuilder()
    .setCustomId(LOCKDOWN_CUSTOM_ID.CancelButton)
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Cancel')
    .setDisabled(disabled);

  return new ContainerBuilder()
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(heading('🔒 Server Lockdown', HeadingLevel.Two)),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large).setDivider(true),
    )
    .addActionRowComponents((actionRow) => actionRow.addComponents(typeSelect))
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Small).setDivider(false),
    )
    .addActionRowComponents((actionRow) =>
      actionRow.addComponents(categorySelect),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        subtext(
          'Channels within selected categories will be excluded from permission changes',
        ),
      ),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Small).setDivider(false),
    )
    .addActionRowComponents((actionRow) =>
      actionRow.addComponents(channelSelect),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        subtext('Selected channels will be excluded from permission changes'),
      ),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Small).setDivider(false),
    )
    .addActionRowComponents((actionRow) => actionRow.addComponents(roleSelect))
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        subtext(
          'Selected roles will be excluded from permission changes across all channels',
        ),
      ),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large).setDivider(true),
    )
    .addActionRowComponents((actionRow) =>
      actionRow.addComponents([confirmButton, reasonButton, cancelButton]),
    );
};

export const buildReasonModal = (interactionId: string, reason?: string) => {
  const reasonInput = new TextInputBuilder()
    .setCustomId(LOCKDOWN_CUSTOM_ID.ReasonInput)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Enter a reason for the lockdown')
    .setRequired(false)
    .setMinLength(0)
    .setMaxLength(100);

  if (reason !== undefined) {
    reasonInput.setValue(reason);
  }

  const reasonLabel = new LabelBuilder()
    .setLabel('Lockdown Reason (optional)')
    .setDescription('Note: reason will be included in the audit log')
    .setTextInputComponent(reasonInput);

  return new ModalBuilder()
    .setCustomId(`${LOCKDOWN_CUSTOM_ID.ReasonModal}:${interactionId}`)
    .setTitle('Lockdown Reason')
    .addLabelComponents(reasonLabel);
};

export const buildStatusComponent = (session: LockdownSession) => {
  const lockdownTypeData = Object.hasOwn(LOCKDOWN_TYPES, session.type)
    ? LOCKDOWN_TYPES[session.type as LockdownType]
    : undefined;

  const excludedCategoriesString =
    session.excludedCategories.length > 0
      ? session.excludedCategories
          .map((category) => channelMention(category))
          .join(', ')
      : 'None';

  const excludedChannelsString =
    session.excludedChannels.length > 0
      ? session.excludedChannels
          .map((channel) => channelMention(channel))
          .join(', ')
      : 'None';

  const excludedRolesString =
    session.excludedRoles.length > 0
      ? session.excludedRoles.map((role) => roleMention(role)).join(', ')
      : 'None';

  const component = new ContainerBuilder()
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        heading('🔒 Server Lockdown Status', HeadingLevel.Two),
      ),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large).setDivider(true),
    );

  if (lockdownTypeData !== undefined) {
    component.addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `${bold('Type:')} ${lockdownTypeData.label}\n${subtext(lockdownTypeData.description)}`,
      ),
    );
  }

  component
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `${bold('Excluded Categories:')} ${excludedCategoriesString}`,
      ),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `${bold('Excluded Channels:')} ${excludedChannelsString}`,
      ),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `${bold('Excluded Roles:')} ${excludedRolesString}`,
      ),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large).setDivider(true),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`${bold('User:')} ${userMention(session.userId)}`),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `${bold('Activated:')} ${time(session.createdAt, TimestampStyles.RelativeTime)}`,
      ),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `${bold('Reason:')}\n${session.reason ?? italic('No reason provided')}`,
      ),
    );

  return component;
};
