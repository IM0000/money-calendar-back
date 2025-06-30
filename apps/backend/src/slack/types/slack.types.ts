export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
}

export interface SlackMessageOptions {
  webhookUrl: string;
  text: string;
  blocks?: SlackBlock[];
}

export interface SlackResponse {
  ok?: boolean;
  error?: string;
}

export interface SlackSendMessageOptions {
  webhookUrl: string;
  text: string;
  blocks?: SlackBlock[];
}
