import { ApiResponse } from "@/types/global.type";
import { API_ENDPOINTS } from "@/constants/api";
import Logger from "@/utils/Logger";
import ApiHandler from "@/utils/ApiHandler";

/**
 * Payload returned when starting a new chat session
 */
interface StartChatPayload {
  sessionId: string;
  chatResponse: {
    choices: [
      {
        message: {
          role: string;
          content: string;
        };
      }
    ];
  };
}

/**
 * Payload returned when continuing a chat session
 */
interface ContinueChatPayload {
  chatResponse: {
    choices: [
      {
        message: {
          role: string;
          content: string;
        };
      }
    ];
  };
}

/**
 * Service for chatting with the AI tutor
 */
class ChatService {
  /**
   * Start a new chat session with the AI tutor for a specific question
   */
  async startChat(
    questionId: string
  ): Promise<ApiResponse<StartChatPayload> | null> {
    Logger.info("Starting new tutor chat", { questionId });
    try {
      const response = await ApiHandler.Post<StartChatPayload>(
        `${API_ENDPOINTS.CHATGPT}/tutor`,
        { questionId }
      );
      Logger.debug(
        `startChat success=${response.success}, sessionId=${response.data?.sessionId}`
      );
      return response;
    } catch (error) {
      Logger.error("Error in ChatService.startChat:", error);
      return null;
    }
  }

  /**
   * Continue an existing chat session with a new message
   */
  async continueChat(
    questionId: string,
    sessionId: string,
    message: string
  ): Promise<ApiResponse<ContinueChatPayload> | null> {
    Logger.info("Continuing tutor chat", { questionId, sessionId });
    try {
      const response = await ApiHandler.Post<ContinueChatPayload>(
        `${API_ENDPOINTS.CHATGPT}/tutor`,
        { questionId, sessionId, message }
      );
      Logger.debug(
        `continueChat success=${response.success}`
      );
      return response;
    } catch (error) {
      Logger.error("Error in ChatService.continueChat:", error);
      return null;
    }
  }
}

export default new ChatService();
