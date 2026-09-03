import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';
import { initialsOf } from '../utils/format';

interface Props {
  firstName: string;
  lastName: string;
  photo?: string;
  size?: number;
}

export default function Avatar({ firstName, lastName, photo, size = 72 }: Props) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  if (photo) {
    return <Image source={{ uri: photo }} style={[styles.base, dim]} />;
  }
  return (
    <View style={[styles.base, styles.fallback, dim]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
        {initialsOf(firstName, lastName)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primaryLight,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initials: { ...typography.h2, color: colors.primaryDark, fontWeight: '700' },
});
