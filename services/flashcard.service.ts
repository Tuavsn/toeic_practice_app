import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_DECKS_KEY = 'saved_flashcard_decks';

// Using string type for consistency across the application
type DeckId = string;  

export default class FlashCardService {
  /**
   * Save a deck ID to the list of saved decks
   * @param deckId - The ID of the deck to save
   * @returns Promise resolving to the updated list of saved deck IDs
   */
  static async saveDeckId(deckId: number | string): Promise<DeckId[]> {
    try {
      // Ensure deckId is stored as string for consistency
      const deckIdString = String(deckId);
      const savedDeckIds = await this.getSavedDeckIds();

      if (!savedDeckIds.includes(deckIdString)) {
        const updatedIds = [...savedDeckIds, deckIdString];
        await AsyncStorage.setItem(SAVED_DECKS_KEY, JSON.stringify(updatedIds));
        console.log(`Deck ${deckIdString} saved to favorites`);
        return updatedIds;
      }

      return savedDeckIds;
    } catch (error) {
      console.error('Error saving deck ID:', error);
      throw error;
    }
  }

  /**
   * Remove a deck ID from the list of saved decks
   * @param deckId - The ID of the deck to remove
   * @returns Promise resolving to the updated list of saved deck IDs
   */
  static async removeSavedDeck(deckId: number | string): Promise<DeckId[]> {
    try {
      // Ensure deckId is stored as string for consistency
      const deckIdString = String(deckId);
      const savedDeckIds = await this.getSavedDeckIds();
      const updatedIds = savedDeckIds.filter(id => id !== deckIdString);
      await AsyncStorage.setItem(SAVED_DECKS_KEY, JSON.stringify(updatedIds));
      console.log(`Deck ${deckIdString} removed from favorites`);
      return updatedIds;
    } catch (error) {
      console.error('Error removing deck ID:', error);
      throw error;
    }
  }

  /**
   * Retrieve all saved deck IDs
   * @returns Promise resolving to the list of saved deck IDs
   */
  static async getSavedDeckIds(): Promise<DeckId[]> {
    try {
      const savedDecksJson = await AsyncStorage.getItem(SAVED_DECKS_KEY);
      if (savedDecksJson) {
        return JSON.parse(savedDecksJson) as DeckId[];
      }
      return [];
    } catch (error) {
      console.error('Error fetching saved deck IDs:', error);
      return [];
    }
  }

  /**
   * Check if a deck is saved
   * @param deckId - The ID of the deck to check
   * @returns Promise resolving to a boolean indicating if the deck is saved
   */
  static async isDeckSaved(deckId: number | string): Promise<boolean> {
    try {
      const deckIdString = String(deckId);
      const savedDeckIds = await this.getSavedDeckIds();
      return savedDeckIds.includes(deckIdString);
    } catch (error) {
      console.error('Error checking if deck is saved:', error);
      return false;
    }
  }

  /**
   * Clear all saved decks
   * @returns Promise<void>
   */
  static async clearAllSavedDecks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SAVED_DECKS_KEY);
      console.log('All saved decks cleared');
    } catch (error) {
      console.error('Error clearing saved decks:', error);
      throw error;
    }
  }
}