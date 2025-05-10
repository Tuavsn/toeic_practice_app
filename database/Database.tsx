import * as SQLite from 'expo-sqlite';
import { seedDecks, seedCards, SeedDeck, SeedCard } from './SeedData';
import { Card, Deck } from '@/types/global.type';

const DATABASE_NAME: string = 'flashcards.db';

export default class Database {
  private static instance: Database | null = null;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (Database.instance === null) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async initDB(): Promise<SQLite.SQLiteDatabase> {
    try {
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        console.log('Database initialized');
      }

      if (!this.db) {
        throw new Error('Failed to initialize database - db object is null');
      }
      
      return this.db;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error initializing database:', errorMessage);
      throw error;
    }
  }

  public async createTables(): Promise<void> {
    try {
      const db = await this.initDB();
      
      if (!db) {
        throw new Error('Database connection is null');
      }

      console.log('Tables created successfully');

      const createDecksTableQuery: string = `
        CREATE TABLE IF NOT EXISTS decks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          imageUrl TEXT
        );
      `;

      const createCardsTableQuery: string = `
        CREATE TABLE IF NOT EXISTS cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          front_text TEXT NOT NULL,
          back_text TEXT NOT NULL,
          deck_id INTEGER,
          FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE
        );
      `;

      await db.execAsync(createDecksTableQuery);
      await db.execAsync(createCardsTableQuery);
      console.log('Tables created successfully');
      
      // Check if data needs to be reseeded
      await this.checkAndReseedData();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error creating tables:', errorMessage);
      throw error;
    }
  }
  
  private async checkAndReseedData(): Promise<void> {
    try {
      const db = await this.initDB();
      
      if (!db) {
        throw new Error('Database connection is null');
      }
      
      // Check if any data exists
      const countResult = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM decks', []);
      const hasData = countResult && countResult.count > 0;
      
      if (!hasData) {
        // No data exists, seed it
        console.log('No data found, seeding initial data');
        await this.seedInitialData();
        return;
      }
      
      // Data exists, check if it matches seed data
      const needsReseed = await this.checkIfDataNeedsReseed();
      
      if (needsReseed) {
        console.log('Seed data has changed, reseeding database');
        await this.clearAllData();
        await this.seedInitialData();
      } else {
        console.log('Database data matches seed data, no reseed needed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error checking and reseeding data:', errorMessage);
      throw error;
    }
  }
  
  private async checkIfDataNeedsReseed(): Promise<boolean> {
    try {
      const db = await this.initDB();
      
      if (!db) {
        throw new Error('Database connection is null');
      }
      
      // Get all decks from database
      const dbDecks = await this.getAllDecks();
      
      // Check if number of decks matches
      if (dbDecks.length !== seedDecks.length) {
        return true;
      }
      
      // Check if deck contents match
      for (let i = 0; i < seedDecks.length; i++) {
        const seedDeck = seedDecks[i];
        // Find corresponding deck in database by title
        const dbDeck = dbDecks.find(deck => deck.title === seedDeck.title);
        
        if (!dbDeck) {
          return true; // Deck doesn't exist in database
        }
        
        // Check if description and imageUrl match
        if (dbDeck.description !== seedDeck.description || dbDeck.imageUrl !== seedDeck.imageUrl) {
          return true;
        }
        
        // Check cards for this deck
        const dbCards = await this.getCardsByDeckId(dbDeck.id);
        const seedDeckCards = seedCards.filter(card => card.deck_id === seedDeck.id);
        
        // Check if number of cards matches
        if (dbCards.length !== seedDeckCards.length) {
          return true;
        }
        
        // Check if card contents match
        // We'll create a map of front_text to back_text for easier comparison
        const dbCardMap = new Map<string, string>();
        dbCards.forEach(card => {
          dbCardMap.set(card.front_text, card.back_text);
        });
        
        for (const seedCard of seedDeckCards) {
          const dbCardBackText = dbCardMap.get(seedCard.front_text);
          if (!dbCardBackText || dbCardBackText !== seedCard.back_text) {
            return true;
          }
        }
      }
      
      // If we get here, all data matches
      return false;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error checking if data needs reseed:', errorMessage);
      return true; // If there's an error, reseed to be safe
    }
  }
  
  private async clearAllData(): Promise<void> {
    try {
      const db = await this.initDB();
      
      if (!db) {
        throw new Error('Database connection is null');
      }
      
      await db.withTransactionAsync(async () => {
        await db.execAsync('DELETE FROM cards');
        await db.execAsync('DELETE FROM decks');
        // Reset auto-increment counters
        await db.execAsync('DELETE FROM sqlite_sequence WHERE name="cards" OR name="decks"');
      });
      
      console.log('All data cleared successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error clearing data:', errorMessage);
      throw error;
    }
  }

  public async seedInitialData(): Promise<void> {
    try {
      const db = await this.initDB();
      
      if (!db) {
        throw new Error('Database connection is null');
      }

      await db.withTransactionAsync(async () => {
        // Insert decks and keep track of their IDs
        const deckIds: number[] = [];
        
        for (const deck of seedDecks) {
          // Safely escape string values to prevent SQL injection
          const title = deck.title.replace(/'/g, "''");
          const description = deck.description ? deck.description.replace(/'/g, "''") : null;
          const imageUrl = deck.imageUrl ? deck.imageUrl.replace(/'/g, "''") : null;
          
          const insertDeckQuery = `
            INSERT INTO decks (title, description, imageUrl) 
            VALUES ('${title}', ${description ? `'${description}'` : 'NULL'}, ${imageUrl ? `'${imageUrl}'` : 'NULL'})
          `;
          
          await db.execAsync(insertDeckQuery);
          
          // Get the ID of the inserted deck
          const result = await db.getFirstAsync<{ id: number }>(
            'SELECT last_insert_rowid() as id', []
          );
          
          if (result) {
            deckIds.push(result.id);
          }
        }
        
        // Insert cards using the correct deck IDs
        for (const card of seedCards) {
          // Find the corresponding deck index (position in seedDecks array)
          const deckIndex = seedDecks.findIndex(deck => deck.id === card.deck_id);
          if (deckIndex === -1) continue; // Skip if deck not found
          
          const deckId = deckIds[deckIndex];
          if (!deckId) continue; // Skip if deck ID is not found
          
          // Safely escape string values
          const frontText = card.front_text.replace(/'/g, "''");
          const backText = card.back_text.replace(/'/g, "''");
          
          const insertCardQuery = `
            INSERT INTO cards (front_text, back_text, deck_id) 
            VALUES ('${frontText}', '${backText}', ${deckId})
          `;
          
          await db.execAsync(insertCardQuery);
        }
      });
      
      console.log('Sample data seeded successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error seeding data:', errorMessage);
      throw error;
    }
  }

  public async getAllDecks(): Promise<Deck[]> {
    try {
      const db = await this.initDB();
      
      if (!db) {
        throw new Error('Database connection is null');
      }
      
      const result = await db.getAllAsync<Deck>('SELECT * FROM decks', []);
      return result || [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching decks:', errorMessage);
      throw error;
    }
  }

  public async getCardsByDeckId(deckId: number): Promise<Card[]> {
    try {
      const db = await this.initDB();
      
      if (!db) {
        throw new Error('Database connection is null');
      }
      
      const result = await db.getAllAsync<Card>(
        'SELECT * FROM cards WHERE deck_id = ?',
        [deckId]
      );
      return result || [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error fetching cards for deck ${deckId}:`, errorMessage);
      throw error;
    }
  }

  public async getDeckById(deckId: number): Promise<Deck | null> {
    try {
      const db = await this.initDB();
      
      if (!db) {
        throw new Error('Database connection is null');
      }
      
      const result = await db.getFirstAsync<Deck>(
        'SELECT * FROM decks WHERE id = ?',
        [deckId]
      );
      
      return result || null;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error fetching deck ${deckId}:`, errorMessage);
      throw error;
    }
  }
}