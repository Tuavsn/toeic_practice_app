import { ApiResponse, User } from "@/types/global.type";
import { API_ENDPOINTS } from "@/constants/api";
import Logger from "@/utils/Logger";
import ApiHandler from "@/utils/ApiHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const raw = await AsyncStorage.getItem('userInfo');

      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }

      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Post<StartChatPayload>(
        `${API_ENDPOINTS.CHATGPT}/tutor`,
        { questionId },
        { headers: { Authorization: `Bearer ${user.token}` } }
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
      const raw = await AsyncStorage.getItem('userInfo');

      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }

      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Post<ContinueChatPayload>(
        `${API_ENDPOINTS.CHATGPT}/tutor`,
        { questionId, sessionId, message },
        { headers: { Authorization: `Bearer ${user.token}` } }
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
