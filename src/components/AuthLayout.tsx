import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onBack?: () => void;
}

export default function AuthLayout({ title, subtitle, children, onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {onBack && (
            <Pressable onPress={onBack} hitSlop={12} style={styles.back} accessibilityLabel="Volver">
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
          )}
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="home" size={26} color={colors.textInverse} />
            </View>
            <Text style={styles.brandText}>PROP+</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.form}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.xl, flexGrow: 1 },
  back: { marginBottom: spacing.md },
  brand: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  brandText: { ...typography.h3, color: colors.text },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: 4, marginBottom: spacing.xl },
  form: { flex: 1 },
});
