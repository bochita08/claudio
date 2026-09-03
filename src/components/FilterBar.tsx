import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { t } from '../i18n';
import { SortKey, TypeFilter } from '../types';

const SORT_OPTIONS: SortKey[] = [
  'price_asc',
  'price_desc',
  'area_asc',
  'area_desc',
  'bedrooms_desc',
  'bathrooms_desc',
];

const TYPE_OPTIONS: TypeFilter[] = ['Todos', 'Casa', 'Departamento', 'PH', 'Local', 'Oficina'];

interface Props {
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  type: TypeFilter;
  onTypeChange: (v: TypeFilter) => void;
}

export default function FilterBar({ sort, onSortChange, type, onTypeChange }: Props) {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.sortButton}
        onPress={() => setSortOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${t.list.sortLabel}: ${t.sort[sort]}`}
      >
        <Ionicons name="swap-vertical" size={16} color={colors.primaryDark} />
        <Text style={styles.sortButtonText} numberOfLines={1}>
          {t.sort[sort]}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.primaryDark} />
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {TYPE_OPTIONS.map((option) => {
          const active = option === type;
          return (
            <Pressable
              key={option}
              onPress={() => onTypeChange(option)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Modal visible={sortOpen} transparent animationType="fade" onRequestClose={() => setSortOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSortOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{t.list.sortLabel}</Text>
            {SORT_OPTIONS.map((option) => {
              const active = option === sort;
              return (
                <Pressable
                  key={option}
                  style={styles.sheetRow}
                  onPress={() => {
                    onSortChange(option);
                    setSortOpen(false);
                  }}
                >
                  <Text style={[styles.sheetRowText, active && styles.sheetRowTextActive]}>
                    {t.sort[option]}
                  </Text>
                  {active && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  sortButtonText: {
    ...typography.small,
    color: colors.primaryDark,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  chips: { paddingRight: spacing.lg },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.small, color: colors.textMuted, fontWeight: '600' },
  chipTextActive: { color: colors.textInverse },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sheetRowText: { ...typography.body, color: colors.text },
  sheetRowTextActive: { color: colors.primary, fontWeight: '700' },
});
