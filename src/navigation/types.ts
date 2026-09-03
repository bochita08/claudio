import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: { notice?: string } | undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type PropertiesStackParamList = {
  PropertyList: undefined;
  PropertyDetail: { id: string };
};

export type MapStackParamList = {
  MapHome: undefined;
  PropertyDetail: { id: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Settings: undefined;
};

export type StatsStackParamList = {
  StatsHome: undefined;
  PropertyDetail: { id: string };
};

export type MainTabParamList = {
  PropertiesTab: NavigatorScreenParams<PropertiesStackParamList>;
  MapTab: NavigatorScreenParams<MapStackParamList>;
  StatsTab: NavigatorScreenParams<StatsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};
