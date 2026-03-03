import {
  type ChatInputCommandDeniedPayload,
  Events,
  Listener,
  type UserError,
} from '@sapphire/framework';

import { replyWithPreconditionError } from '@/utils/preconditions.js';

export class ChatInputCommandDeniedListener extends Listener<
  typeof Events.ChatInputCommandDenied
> {
  constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.ChatInputCommandDenied,
    });
  }

  async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    await replyWithPreconditionError(interaction, error);
  }
}
