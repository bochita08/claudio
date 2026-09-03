import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export default function FeatureTag({ icon, label }: Props) {
  return (
    <View style={styles.tag}>
      <Ionicons name={icon} size={14} color={colors.primaryDark} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginTop: spacing.sm,
  },
  label: {
    ...typography.small,
    color: colors.primaryDark,
    fontWeight: '600',
    marginLeft: 5,
  },
});
