import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle;
  accessibilityHint?: string;
  testID?: string;
}

export default function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
  accessibilityHint,
  testID,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary}
            style={{ marginRight: spacing.sm }}
          />
        )}
        <Text style={[styles.text, textStyles[variant], isDisabled && styles.textDisabled]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryLight },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },
  disabled: { backgroundColor: colors.border },
  pressed: { opacity: 0.85 },
  text: { ...typography.h3 },
  textDisabled: { color: colors.textMuted },
});

const textStyles = StyleSheet.create({
  primary: { color: colors.textInverse },
  secondary: { color: colors.primaryDark },
  ghost: { color: colors.primary },
  danger: { color: colors.textInverse },
});
