import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import PropertyListScreen from '../screens/PropertyListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import { colors } from '../theme';
import {
  MainTabParamList,
  MapStackParamList,
  ProfileStackParamList,
  PropertiesStackParamList,
  StatsStackParamList,
} from './types';

const PropertiesStack = createNativeStackNavigator<PropertiesStackParamList>();
function PropertiesNavigator() {
  return (
    <PropertiesStack.Navigator screenOptions={{ headerShown: false }}>
      <PropertiesStack.Screen name="PropertyList" component={PropertyListScreen} />
      <PropertiesStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </PropertiesStack.Navigator>
  );
}

const MapStack = createNativeStackNavigator<MapStackParamList>();
function MapNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="MapHome" component={MapScreen} />
      <MapStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </MapStack.Navigator>
  );
}

const StatsStack = createNativeStackNavigator<StatsStackParamList>();
function StatsNavigator() {
  return (
    <StatsStack.Navigator screenOptions={{ headerShown: false }}>
      <StatsStack.Screen name="StatsHome" component={StatsScreen} />
      <StatsStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </StatsStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  PropertiesTab: 'home',
  MapTab: 'map',
  StatsTab: 'stats-chart',
  ProfileTab: 'person',
};

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { borderTopColor: colors.border, height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name as keyof MainTabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="PropertiesTab"
        component={PropertiesNavigator}
        options={{ title: 'Propiedades' }}
      />
      <Tab.Screen name="MapTab" component={MapNavigator} options={{ title: 'Mapa' }} />
      <Tab.Screen name="StatsTab" component={StatsNavigator} options={{ title: 'Stats' }} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
