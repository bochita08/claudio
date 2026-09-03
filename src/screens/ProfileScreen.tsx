import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { t } from '../i18n';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { formatDate } from '../utils/format';

interface Props {
  navigation: { navigate: (screen: string) => void };
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const confirmSignOut = () => {
    Alert.alert(t.profile.signOut, 'Vas a cerrar la sesión en este dispositivo.', [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.profile.signOut, style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            photo={user.photo}
            size={88}
          />
          <Text style={styles.welcome}>{t.profile.welcome(user.firstName)}</Text>
          <Text style={styles.fullName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.memberChip}>
            <Ionicons name="calendar-outline" size={13} color={colors.primaryDark} />
            <Text style={styles.memberText}>{t.profile.memberSince(formatDate(user.createdAt))}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Row icon="mail-outline" label={t.profile.emailLabel} value={user.email} />
          <View style={styles.divider} />
          <Row icon="call-outline" label={t.profile.phoneLabel} value={user.phone} />
          <View style={styles.divider} />
          <Row
            icon="finger-print-outline"
            label="ID de usuario"
            value={user.id}
          />
          <View style={styles.divider} />
          <Row
            icon="time-outline"
            label="Fecha de registro"
            value={formatDate(user.createdAt)}
          />
        </View>

        <Button
          title={t.profile.editInfo}
          testID="profile-edit"
          onPress={() => navigation.navigate('Settings')}
          variant="primary"
          style={{ marginTop: spacing.lg }}
        />
        <Button
          title={t.profile.signOut}
          testID="profile-signout"
          onPress={confirmSignOut}
          variant="ghost"
          style={{ marginTop: spacing.xs }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    padding: spacing.xl,
    ...shadow.card,
  },
  welcome: { ...typography.small, color: colors.textMuted, marginTop: spacing.md },
  fullName: { ...typography.h2, color: colors.text, marginTop: 2 },
  email: { ...typography.body, color: colors.textMuted, marginTop: 2 },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  memberText: { ...typography.tiny, color: colors.primaryDark, fontWeight: '600', marginLeft: 5 },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    ...shadow.card,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  rowText: { marginLeft: spacing.md, flex: 1 },
  rowLabel: { ...typography.tiny, color: colors.textMuted },
  rowValue: { ...typography.body, color: colors.text, marginTop: 1 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
