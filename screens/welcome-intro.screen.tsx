import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import Database from "../database/Database";
import OnBoarding from "@/components/OnBoarding";

export default function WelcomeIntroScreen() {
  // Initialize Flashcard database
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const dbInstance = Database.getInstance();
        await dbInstance.initDB();
        await dbInstance.createTables();
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };
    initializeDatabase();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <OnBoarding />
    </SafeAreaView>
  );
}