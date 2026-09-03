import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BarChart from '../components/BarChart';
import StatCard from '../components/StatCard';
import { ErrorView, LoadingView } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { t } from '../i18n';
import { PROPERTIES } from '../data/properties';
import { statsService } from '../services/statsService';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { UserStats } from '../types';
import { formatArea, formatBathrooms, formatPrice } from '../utils/format';

interface Props {
  navigation: { navigate: (screen: string, params: { id: string }) => void };
}

export default function StatsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { favorites, count: favoritesCount } = useFavorites();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const favoriteProperties = useMemo(
    () => PROPERTIES.filter((p) => favorites.includes(p.id)),
    [favorites],
  );

  const load = () => {
    if (!user) return;
    setLoading(true);
    setError('');
    statsService
      .getUserStats(user.id, favoritesCount)
      .then(setStats)
      .catch(() => setError('No pudimos cargar las estadísticas.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user?.id]);

  // Mantiene el numero grande de "Favoritos" sincronizado si cambia mientras la
  // pantalla esta montada.
  const shownStats = stats ? { ...stats, favorites: favoritesCount } : null;

  if (loading) return <LoadingView label={t.common.loading} />;
  if (error || !shownStats) return <ErrorView message={error || 'Sin datos.'} onRetry={load} />;

  const maxType = Math.max(...shownStats.typeDistribution.map((d) => d.value));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t.stats.title}</Text>
        <Text style={styles.subtitle}>{t.stats.subtitle}</Text>

        <View style={styles.grid}>
          <StatCard
            icon="eye-outline"
            label={t.stats.propertiesViewed}
            value={String(shownStats.propertiesViewed)}
          />
          <StatCard
            icon="heart-outline"
            label={t.stats.favorites}
            value={String(shownStats.favorites)}
          />
          <StatCard
            icon="search-outline"
            label={t.stats.searches}
            value={String(shownStats.searches)}
          />
          <StatCard
            icon="call-outline"
            label={t.stats.contactedAgents}
            value={String(shownStats.contactedAgents)}
          />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelLabel}>{t.stats.averageBudget}</Text>
          <Text style={styles.panelValue}>{formatPrice(shownStats.averageBudget, 'USD')}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>
            {t.stats.yourFavorites} ({favoriteProperties.length})
          </Text>
          {favoriteProperties.length === 0 ? (
            <Text style={styles.favEmpty}>{t.stats.favoritesEmpty}</Text>
          ) : (
            favoriteProperties.map((p) => (
              <Pressable
                key={p.id}
                style={styles.favRow}
                onPress={() => navigation.navigate('PropertyDetail', { id: p.id })}
                accessibilityRole="button"
              >
                <Image source={{ uri: p.images[0] }} style={styles.favThumb} />
                <View style={styles.favInfo}>
                  <Text style={styles.favPrice}>{formatPrice(p.price, p.currency)}</Text>
                  <Text style={styles.favAddress} numberOfLines={1}>
                    {p.address} - {p.city}
                  </Text>
                  <Text style={styles.favMeta}>
                    {p.bedrooms > 0 ? `${p.bedrooms} dorm. - ` : ''}
                    {formatBathrooms(p.bathrooms)} - {formatArea(p.area)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t.stats.monthlyViews}</Text>
          <BarChart data={shownStats.monthlyViews} height={150} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t.stats.typeDistribution}</Text>
          {shownStats.typeDistribution.map((d) => (
            <View key={d.label} style={styles.distRow}>
              <Text style={styles.distLabel}>{d.label}</Text>
              <View style={styles.distTrack}>
                <View style={[styles.distFill, { width: `${(d.value / maxType) * 100}%` }]} />
              </View>
              <Text style={styles.distValue}>{d.value}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.small, color: colors.textMuted, marginTop: 2, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadow.card,
  },
  panelLabel: { ...typography.small, color: colors.textMuted },
  panelValue: { ...typography.h1, color: colors.text, marginTop: 4 },
  panelTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  favEmpty: { ...typography.small, color: colors.textMuted, lineHeight: 20 },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  favThumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  favInfo: { flex: 1, marginLeft: spacing.md },
  favPrice: { ...typography.h3, color: colors.text },
  favAddress: { ...typography.small, color: colors.textMuted, marginTop: 1 },
  favMeta: { ...typography.tiny, color: colors.textMuted, marginTop: 2 },
  distRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  distLabel: { ...typography.small, color: colors.text, width: 96 },
  distTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  distFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.pill },
  distValue: { ...typography.tiny, color: colors.textMuted, width: 34, textAlign: 'right' },
});
