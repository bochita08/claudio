import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Banner from '../components/Banner';
import FavoriteButton from '../components/FavoriteButton';
import LeafletMap, { MapMarker } from '../components/LeafletMap';
import { t } from '../i18n';
import { PROPERTIES } from '../data/properties';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { formatArea, formatBathrooms, formatPrice } from '../utils/format';

interface Props {
  navigation: { navigate: (screen: string, params: { id: string }) => void };
}

export default function MapScreen({ navigation }: Props) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [locationMsg, setLocationMsg] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const markers: MapMarker[] = useMemo(
    () =>
      PROPERTIES.map((p) => ({
        id: p.id,
        latitude: p.latitude,
        longitude: p.longitude,
        title: p.title,
        subtitle: formatPrice(p.price, p.currency),
      })),
    [],
  );

  const selected = useMemo(
    () => PROPERTIES.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (mounted) setLocationMsg(t.map.permissionDenied);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (mounted) {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }
      } catch {
        if (mounted) setLocationMsg(t.map.permissionError);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t.map.title}</Text>
        <Text style={styles.subtitle}>
          {PROPERTIES.length} propiedades en el mapa
        </Text>
      </View>

      {!!locationMsg && (
        <View style={styles.bannerWrap}>
          <Banner kind="info" message={locationMsg} />
        </View>
      )}

      <View style={styles.mapWrap}>
        <LeafletMap
          markers={markers}
          userLocation={userLocation}
          zoom={12}
          onMarkerPress={(id) => setSelectedId(id)}
          style={StyleSheet.absoluteFillObject}
        />

        {selected && (
          <View style={styles.card}>
            <Pressable
              style={styles.cardClose}
              onPress={() => setSelectedId(null)}
              hitSlop={10}
            >
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
            <Text style={styles.cardType}>{selected.type}</Text>
            <View style={styles.cardPriceRow}>
              <Text style={styles.cardPrice}>
                {formatPrice(selected.price, selected.currency)}
              </Text>
              <FavoriteButton propertyId={selected.id} variant="plain" size={24} />
            </View>
            <Text style={styles.cardAddress} numberOfLines={1}>
              {selected.address} - {selected.city}
            </Text>
            <View style={styles.cardTags}>
              {selected.bedrooms > 0 && (
                <Text style={styles.cardTag}>{selected.bedrooms} dorm.</Text>
              )}
              <Text style={styles.cardTag}>{formatBathrooms(selected.bathrooms)}</Text>
              <Text style={styles.cardTag}>{formatArea(selected.area)}</Text>
            </View>
            <Pressable
              style={styles.cardButton}
              onPress={() => navigation.navigate('PropertyDetail', { id: selected.id })}
            >
              <Text style={styles.cardButtonText}>{t.map.viewDetail}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.textInverse} />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  bannerWrap: { paddingHorizontal: spacing.lg },
  mapWrap: { flex: 1, position: 'relative' },
  card: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  cardClose: { position: 'absolute', top: spacing.md, right: spacing.md, zIndex: 2 },
  cardType: {
    ...typography.tiny,
    color: colors.primaryDark,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  cardPrice: { ...typography.h2, color: colors.text },
  cardAddress: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  cardTags: { flexDirection: 'row', marginTop: spacing.sm, flexWrap: 'wrap' },
  cardTag: {
    ...typography.tiny,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    marginRight: 6,
    overflow: 'hidden',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginTop: spacing.md,
  },
  cardButtonText: {
    ...typography.h3,
    color: colors.textInverse,
    marginRight: 6,
  },
});
