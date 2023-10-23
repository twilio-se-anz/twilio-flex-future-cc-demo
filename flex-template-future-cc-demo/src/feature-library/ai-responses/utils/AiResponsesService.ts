import * as Flex from '@twilio/flex-ui';
import ApiService from '../../../utils/serverless/ApiService';
import { OpenAIMessage, OpenAIResponse } from '../types/AiResponses';

class AiResponsesService extends ApiService {
  getEnhancedResponseBasic = async (message: string): Promise<string> => {
    const open_ai_request: OpenAIMessage[] = [];
    open_ai_request.push({ role: 'system', content: `You are an AI assistant for a company. Enhance this message` });
    open_ai_request.push({ role: 'user', content: message });
    const result = await this.getOpenAIResponse(open_ai_request);
    return result.result.choices[0].message.content;
  };

  getEnhancedResponseWithPersonaAndUserContext = async (
    message: string,
    persona_prompt: string,
    user_context: string = '',
  ): Promise<string> => {
    if (user_context && user_context.length > 0) {
      user_context =
        'The user has the following known traits: ' + user_context + '. Only include traits if they help the user.';
    }

    let prompt = `You are an AI assistant. Your persona ${persona_prompt}. ${user_context}. Enhance this message, but keep it brief: `;

    console.log(`PROMPT = ${prompt}`);

    const open_ai_request: OpenAIMessage[] = [];
    open_ai_request.push({
      role: 'system',
      content: prompt,
    });
    open_ai_request.push({ role: 'user', content: message });
    const result = await this.getOpenAIResponse(open_ai_request);
    return result.result.choices[0].message.content;
  };

  getOpenAIResponse = async (open_ai_request: OpenAIMessage[]): Promise<OpenAIResponse> => {
    return new Promise((resolve, reject) => {
      const manager = Flex.Manager.getInstance();

      const params = {
        open_ai_request,
        Token: manager.user.token,
      };

      this.fetchJsonWithReject<OpenAIResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/ai-responses/flex/enhance`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        },
      )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error(`Error fetching Open AI Response\r\n`, error);
          reject(error);
        });
    });
  };
}

export default new AiResponsesService();
