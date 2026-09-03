import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type Kind = 'success' | 'error' | 'info';

const config: Record<Kind, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  success: { bg: colors.successBg, fg: colors.success, icon: 'checkmark-circle' },
  error: { bg: colors.dangerBg, fg: colors.danger, icon: 'alert-circle' },
  info: { bg: colors.primaryLight, fg: colors.primaryDark, icon: 'information-circle' },
};

export default function Banner({ kind, message }: { kind: Kind; message: string }) {
  if (!message) return null;
  const c = config[kind];
  return (
    <View style={[styles.container, { backgroundColor: c.bg }]} accessibilityLiveRegion="polite">
      <Ionicons name={c.icon} size={18} color={c.fg} style={{ marginRight: spacing.sm }} />
      <Text style={[styles.text, { color: c.fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  text: { ...typography.small, flex: 1, fontWeight: '500' },
});
