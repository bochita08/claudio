import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { colors, radius, shadow } from '../theme';
import { t } from '../i18n';

interface Props {
  propertyId: string;
  size?: number;
  variant?: 'floating' | 'plain';
  style?: ViewStyle;
}

export default function FavoriteButton({
  propertyId,
  size = 22,
  variant = 'floating',
  style,
}: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(propertyId);

  return (
    <Pressable
      onPress={() => toggleFavorite(propertyId)}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={active ? t.favorites.remove : t.favorites.add}
      style={[variant === 'floating' && styles.floating, style]}
    >
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={size}
        color={active ? colors.danger : variant === 'floating' ? colors.text : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floating: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 8,
    ...shadow.card,
  },
});
