import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AgentCard from '../components/AgentCard';
import FavoriteButton from '../components/FavoriteButton';
import ImageCarousel from '../components/ImageCarousel';
import LeafletMap from '../components/LeafletMap';
import { ErrorView, LoadingView } from '../components/StateViews';
import { useFavorites } from '../context/FavoritesContext';
import { t } from '../i18n';
import { propertyService } from '../services/propertyService';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { Agent, Property } from '../types';
import { formatArea, formatPrice } from '../utils/format';

interface Props {
  route: { params: { id: string } };
  navigation: { goBack: () => void };
}

export default function PropertyDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const load = () => {
    setLoading(true);
    setError('');
    propertyService
      .getById(id)
      .then((p) => {
        setProperty(p);
        return propertyService.getAgent(p.agentId);
      })
      .then((a) => setAgent(a))
      .catch(() => setError('No pudimos cargar la propiedad.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return <LoadingView label={t.common.loading} />;
  if (error || !property) return <ErrorView message={error || 'Sin datos.'} onRetry={load} />;

  const features: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
    ...(property.bedrooms > 0
      ? [{ icon: 'bed-outline' as const, label: t.detail.bedrooms, value: String(property.bedrooms) }]
      : []),
    { icon: 'water-outline', label: t.detail.bathrooms, value: String(property.bathrooms) },
    { icon: 'resize-outline', label: t.detail.area, value: formatArea(property.area) },
    { icon: 'business-outline', label: t.detail.type, value: property.type },
    { icon: 'calendar-outline', label: t.detail.year, value: String(property.year) },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Pressable style={styles.backBtn} onPress={navigation.goBack} hitSlop={10}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <FavoriteButton propertyId={property.id} style={styles.favFloating} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ImageCarousel images={property.images} height={260} borderRadius={radius.lg} />

        <View style={styles.header}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{property.type}</Text>
          </View>
          <Text style={styles.price}>{formatPrice(property.price, property.currency)}</Text>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={15} color={colors.textMuted} />
            <Text style={styles.address}>
              {property.address} - {property.city}
            </Text>
          </View>

          <Pressable
            onPress={() => toggleFavorite(property.id)}
            style={[styles.favPill, isFavorite(property.id) && styles.favPillActive]}
            accessibilityRole="button"
          >
            <Ionicons
              name={isFavorite(property.id) ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite(property.id) ? colors.textInverse : colors.danger}
            />
            <Text
              style={[
                styles.favPillText,
                isFavorite(property.id) && styles.favPillTextActive,
              ]}
            >
              {isFavorite(property.id) ? t.favorites.remove : t.favorites.add}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.detail.features}</Text>
          <View style={styles.featureGrid}>
            {features.map((f) => (
              <View key={f.label} style={styles.feature}>
                <Ionicons name={f.icon} size={18} color={colors.primaryDark} />
                <Text style={styles.featureValue}>{f.value}</Text>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.detail.description}</Text>
          <Text style={styles.description} numberOfLines={expanded ? undefined : 4}>
            {property.description}
          </Text>
          <Pressable onPress={() => setExpanded((e) => !e)} hitSlop={8}>
            <Text style={styles.moreLink}>
              {expanded ? t.common.seeLess : t.common.seeMore}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.detail.amenities}</Text>
          <View style={styles.amenities}>
            {property.amenities.map((a) => (
              <View key={a} style={styles.amenity}>
                <Ionicons name="checkmark-circle" size={15} color={colors.success} />
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.detail.location}</Text>
          <LeafletMap
            markers={[
              {
                id: property.id,
                latitude: property.latitude,
                longitude: property.longitude,
                title: property.title,
                subtitle: property.address,
              },
            ]}
            center={{ latitude: property.latitude, longitude: property.longitude }}
            zoom={15}
            interactive={false}
            style={styles.map}
          />
          <Text style={styles.mapCaption}>
            {property.address} - {property.city}
          </Text>
        </View>

        <View style={styles.section}>
          {agent ? <AgentCard agent={agent} /> : <LoadingView label="Cargando agente..." />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: spacing.lg,
    zIndex: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 8,
    ...shadow.card,
  },
  favFloating: {
    position: 'absolute',
    top: 52,
    right: spacing.lg,
    zIndex: 10,
  },
  favPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  favPillActive: { backgroundColor: colors.danger },
  favPillText: {
    ...typography.small,
    color: colors.danger,
    fontWeight: '700',
    marginLeft: 6,
  },
  favPillTextActive: { color: colors.textInverse },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { marginTop: spacing.lg },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  typeBadgeText: {
    ...typography.tiny,
    color: colors.primaryDark,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  price: { ...typography.h1, color: colors.text },
  title: { ...typography.h3, color: colors.text, marginTop: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  address: { ...typography.small, color: colors.textMuted, marginLeft: 4 },
  section: { marginTop: spacing.xl },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  feature: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginRight: '2%',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
    ...shadow.card,
  },
  featureValue: { ...typography.h3, color: colors.text, marginTop: 6 },
  featureLabel: { ...typography.tiny, color: colors.textMuted, marginTop: 2 },
  description: { ...typography.body, color: colors.text, lineHeight: 22 },
  moreLink: { ...typography.small, color: colors.primary, fontWeight: '700', marginTop: spacing.sm },
  amenities: { flexDirection: 'row', flexWrap: 'wrap' },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: spacing.sm,
  },
  amenityText: { ...typography.small, color: colors.text, marginLeft: 6 },
  map: { height: 180, borderRadius: radius.lg },
  mapCaption: { ...typography.tiny, color: colors.textMuted, marginTop: spacing.sm },
});
