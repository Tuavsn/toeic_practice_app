/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(drawer)` | `/(drawer)/` | `/(drawer)/(tabs)` | `/(drawer)/(tabs)/` | `/(drawer)/(tabs)/search` | `/(drawer)/(tabs)/statistic` | `/(drawer)/search` | `/(drawer)/statistic` | `/(drawer)\login` | `/(routes)/home` | `/(routes)/login` | `/(routes)/welcome-intro` | `/(tabs)` | `/(tabs)/` | `/(tabs)/search` | `/(tabs)/statistic` | `/_sitemap` | `/home` | `/login` | `/search` | `/statistic` | `/welcome-intro`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
