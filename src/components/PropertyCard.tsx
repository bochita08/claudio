import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { Property } from '../types';
import { formatArea, formatBathrooms, formatPrice } from '../utils/format';
import FavoriteButton from './FavoriteButton';
import FeatureTag from './FeatureTag';
import ImageCarousel from './ImageCarousel';

interface Props {
  property: Property;
  onPress: () => void;
}

export default function PropertyCard({ property, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${property.title}, ${formatPrice(property.price, property.currency)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        <ImageCarousel images={property.images} height={200} />
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{property.type}</Text>
        </View>
        <FavoriteButton propertyId={property.id} style={styles.fav} />
      </View>

      <View style={styles.body}>
        <Text style={styles.price}>{formatPrice(property.price, property.currency)}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={15} color={colors.textMuted} />
          <Text style={styles.address} numberOfLines={1}>
            {property.address} - {property.city}
          </Text>
        </View>

        <View style={styles.tags}>
          {property.bedrooms > 0 && (
            <FeatureTag icon="bed-outline" label={`${property.bedrooms} dorm.`} />
          )}
          <FeatureTag icon="water-outline" label={formatBathrooms(property.bathrooms)} />
          <FeatureTag icon="resize-outline" label={formatArea(property.area)} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  pressed: { opacity: 0.92 },
  imageWrap: { position: 'relative' },
  fav: { position: 'absolute', top: spacing.md, right: spacing.md },
  typeBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primaryDark,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  typeBadgeText: {
    ...typography.tiny,
    color: colors.textInverse,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: { padding: spacing.lg },
  price: { ...typography.h2, color: colors.text },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  address: {
    ...typography.small,
    color: colors.textMuted,
    marginLeft: 4,
    flex: 1,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs },
});
