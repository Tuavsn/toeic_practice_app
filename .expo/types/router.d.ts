/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(drawer)` | `/(drawer)/` | `/(drawer)/(tabs)` | `/(drawer)/(tabs)/` | `/(drawer)/(tabs)/search` | `/(drawer)/(tabs)/statistic` | `/(drawer)/login` | `/(drawer)/profile` | `/(drawer)/search` | `/(drawer)/statistic` | `/(tabs)` | `/(tabs)/` | `/(tabs)/search` | `/(tabs)/statistic` | `/_sitemap` | `/login` | `/profile` | `/search` | `/statistic` | `/welcome-intro`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
