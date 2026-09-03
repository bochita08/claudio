import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterBar from '../components/FilterBar';
import PropertyCard from '../components/PropertyCard';
import { EmptyView } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { t } from '../i18n';
import { MainTabParamList, PropertiesStackParamList } from '../navigation/types';
import { PROPERTIES } from '../data/properties';
import { filterAndSort } from '../services/propertyService';
import { colors, radius, spacing, typography } from '../theme';
import { SortKey, TypeFilter } from '../types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<PropertiesStackParamList, 'PropertyList'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function PropertyListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { favorites, count: favoritesCount } = useFavorites();
  const [sort, setSort] = useState<SortKey>('price_asc');
  const [type, setType] = useState<TypeFilter>('Todos');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => {
    const base = filterAndSort(PROPERTIES, { sort, type });
    return onlyFavorites ? base.filter((p) => favorites.includes(p.id)) : base;
  }, [sort, type, onlyFavorites, favorites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.greeting}>{t.list.greeting(user?.firstName ?? '')}</Text>
            <Text style={styles.title}>{t.list.title}</Text>
            <Text style={styles.count}>{t.list.resultsCount(data.length)}</Text>

            <Pressable
              onPress={() => setOnlyFavorites((v) => !v)}
              style={[styles.favToggle, onlyFavorites && styles.favToggleActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: onlyFavorites }}
            >
              <Ionicons
                name={onlyFavorites ? 'heart' : 'heart-outline'}
                size={16}
                color={onlyFavorites ? colors.textInverse : colors.danger}
              />
              <Text style={[styles.favToggleText, onlyFavorites && styles.favToggleTextActive]}>
                {t.list.favoritesOnly}
                {favoritesCount > 0 ? ` (${favoritesCount})` : ''}
              </Text>
            </Pressable>

            <FilterBar sort={sort} onSortChange={setSort} type={type} onTypeChange={setType} />
          </View>
        }
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => navigation.navigate('PropertyDetail', { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyView message={onlyFavorites ? t.list.favoritesEmpty : t.list.empty} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  greeting: { ...typography.small, color: colors.textMuted },
  title: { ...typography.h1, color: colors.text, marginTop: 2 },
  count: { ...typography.small, color: colors.textMuted, marginTop: 4, marginBottom: spacing.md },
  favToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  favToggleActive: { backgroundColor: colors.danger },
  favToggleText: {
    ...typography.small,
    color: colors.danger,
    fontWeight: '700',
    marginLeft: 6,
  },
  favToggleTextActive: { color: colors.textInverse },
});
