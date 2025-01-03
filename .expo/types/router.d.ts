/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)/login` | `/(auth)/profile` | `/(drawer)` | `/(drawer)/` | `/(drawer)/(tabs)` | `/(drawer)/(tabs)/` | `/(drawer)/(tabs)/search` | `/(drawer)/(tabs)/statistic` | `/(drawer)/search` | `/(drawer)/statistic` | `/(main)/course` | `/(main)/lecture` | `/(main)/notify` | `/(main)/practice` | `/(main)/result` | `/(main)/test` | `/(tabs)` | `/(tabs)/` | `/(tabs)/search` | `/(tabs)/statistic` | `/..\context\AudioContext` | `/_sitemap` | `/course` | `/lecture` | `/login` | `/notify` | `/practice` | `/profile` | `/result` | `/search` | `/statistic` | `/test` | `/welcome-intro`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
