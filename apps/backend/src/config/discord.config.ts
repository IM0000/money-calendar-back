// /config/discord.config.ts
import { registerAs } from '@nestjs/config';

export const discordConfig = registerAs('discord', () => ({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
}));
