import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface Datum {
  label: string;
  value: number;
}

interface Props {
  data: Datum[];
  height?: number;
  unit?: string;
}

/** Grafico de barras minimalista hecho con Views (sin libs de charts). */
export default function BarChart({ data, height = 140, unit = '' }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View>
      <View style={[styles.chart, { height }]}>
        {data.map((d) => (
          <View key={d.label} style={styles.column}>
            <Text style={styles.value}>
              {d.value}
              {unit}
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.bar,
                  { height: `${Math.max(6, (d.value / max) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.label}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  column: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  track: {
    flex: 1,
    width: 22,
    justifyContent: 'flex-end',
    marginVertical: 4,
  },
  bar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    minHeight: 6,
  },
  value: { ...typography.tiny, color: colors.textMuted },
  label: { ...typography.tiny, color: colors.textMuted, marginTop: 2 },
});
