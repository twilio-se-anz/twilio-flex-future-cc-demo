export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
};

export interface OpenAIResponse {
  result: Result;
}

export interface Result {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
}

export interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

export interface Message {
  role: string;
  content: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
