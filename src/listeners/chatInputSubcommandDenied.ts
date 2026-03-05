import { Listener, type UserError } from '@sapphire/framework';
import {
  type ChatInputSubcommandDeniedPayload,
  SubcommandPluginEvents,
} from '@sapphire/plugin-subcommands';

import { replyWithPreconditionError } from '@/utils/preconditions.js';

export class ChatInputSubcommandDeniedListener extends Listener<
  typeof SubcommandPluginEvents.ChatInputSubcommandDenied
> {
  constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: SubcommandPluginEvents.ChatInputSubcommandDenied,
    });
  }

  async run(
    error: UserError,
    { interaction }: ChatInputSubcommandDeniedPayload,
  ) {
    await replyWithPreconditionError(interaction, error);
  }
}
