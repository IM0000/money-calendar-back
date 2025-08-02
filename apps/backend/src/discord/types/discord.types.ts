export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

export interface DiscordMessageOptions {
  webhookUrl: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

export interface DiscordSendMessageOptions {
  webhookUrl: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

export interface DiscordResponse {
  ok: boolean;
}