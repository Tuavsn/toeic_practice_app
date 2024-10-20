/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(routes)/home` | `/(routes)/login` | `/(routes)/welcome-intro` | `/(tabs)` | `/(tabs)/` | `/(tabs)/explore` | `/(tabs)/profile` | `/(tabs)/search` | `/(tabs)/statistic` | `/_sitemap` | `/explore` | `/home` | `/login` | `/profile` | `/search` | `/statistic` | `/welcome-intro`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
