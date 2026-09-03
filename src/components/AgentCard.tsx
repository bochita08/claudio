import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, Linking, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { Agent } from '../types';
import { t } from '../i18n';
import Button from './Button';

export default function AgentCard({ agent }: { agent: Agent }) {
  const call = async () => {
    const url = `tel:${agent.phone}`;
    const ok = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
    else Alert.alert('No disponible', 'Este dispositivo no puede realizar llamadas.');
  };

  const email = async () => {
    const url = `mailto:${agent.email}?subject=${encodeURIComponent('Consulta por propiedad - PROP+')}`;
    const ok = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
    else Alert.alert('No disponible', 'No hay una app de email configurada.');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{t.detail.agent}</Text>
      <View style={styles.row}>
        <Image source={{ uri: agent.photo }} style={styles.photo} />
        <View style={styles.info}>
          <Text style={styles.name}>{agent.name}</Text>
          <Text style={styles.agency}>{agent.agency}</Text>
          <Text style={styles.license}>Matrícula {agent.license}</Text>
        </View>
      </View>

      <View style={styles.contactRow}>
        <Ionicons name="call-outline" size={15} color={colors.textMuted} />
        <Text style={styles.contactText}>{agent.phone}</Text>
      </View>
      <View style={styles.contactRow}>
        <Ionicons name="mail-outline" size={15} color={colors.textMuted} />
        <Text style={styles.contactText}>{agent.email}</Text>
      </View>

      <View style={styles.actions}>
        <Button title={t.detail.call} onPress={call} variant="primary" style={styles.actionBtn} />
        <Button
          title={t.detail.sendEmail}
          onPress={email}
          variant="secondary"
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  heading: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  photo: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primaryLight },
  info: { marginLeft: spacing.md, flex: 1 },
  name: { ...typography.h3, color: colors.text },
  agency: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  license: { ...typography.tiny, color: colors.textMuted, marginTop: 2 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  contactText: { ...typography.small, color: colors.text, marginLeft: spacing.sm },
  actions: { flexDirection: 'row', marginTop: spacing.lg },
  actionBtn: { flex: 1, marginHorizontal: 4 },
});
