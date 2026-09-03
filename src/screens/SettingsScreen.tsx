import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
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
import Avatar from '../components/Avatar';
import Banner from '../components/Banner';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { t } from '../i18n';
import { apiErrorCode } from '../services/api';
import { colors, spacing, typography } from '../theme';
import {
  sanitizers,
  validateEmail,
  validateName,
  validatePhone,
} from '../utils/validation';
import { useForm } from '../hooks/useForm';

interface Props {
  navigation: { goBack: () => void };
}

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export default function SettingsScreen({ navigation }: Props) {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const initial: Values = useMemo(
    () => ({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    }),
    [user?.firstName, user?.lastName, user?.email, user?.phone],
  );

  const validate = useCallback(
    (v: Values) => ({
      firstName: validateName(v.firstName, 'El nombre'),
      lastName: validateName(v.lastName, 'El apellido'),
      email: validateEmail(v.email),
      phone: validatePhone(v.phone),
    }),
    [],
  );

  const form = useForm<Values>(initial, validate);

  // El boton "Guardar" queda bloqueado hasta que el usuario modifique algo.
  const isDirty = useMemo(
    () =>
      (Object.keys(initial) as (keyof Values)[]).some(
        (key) => form.values[key].trim() !== initial[key].trim(),
      ),
    [form.values, initial],
  );

  const onSubmit = () => {
    setBanner(null);
    form.handleSubmit(async (values) => {
      if (!isDirty) {
        setBanner({ kind: 'error', message: t.settings.noChanges });
        return;
      }
      setLoading(true);
      try {
        await updateProfile({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
        });
        setBanner({ kind: 'success', message: t.settings.saveOk });
      } catch (err) {
        if (apiErrorCode(err) === 'EMAIL_TAKEN') {
          setBanner({ kind: 'error', message: t.settings.emailTaken });
        } else {
          setBanner({ kind: 'error', message: t.settings.saveError });
        }
      } finally {
        setLoading(false);
      }
    });
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.settings.title}</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarBlock}>
            <Avatar
              firstName={form.values.firstName || user.firstName}
              lastName={form.values.lastName || user.lastName}
              photo={user.photo}
              size={80}
            />
            <Text style={styles.subtitle}>{t.settings.subtitle}</Text>
          </View>

          {banner && <Banner kind={banner.kind} message={banner.message} />}

          <FormInput
            label={t.auth.firstName}
            icon="person-outline"
            value={form.values.firstName}
            onChangeText={(text) => form.setField('firstName', sanitizers.letters(text))}
            onBlur={() => form.blur('firstName')}
            error={form.errorFor('firstName')}
            touched={form.isTouched('firstName')}
            autoCapitalize="words"
            maxLength={40}
            helperText="Solo letras"
          />

          <FormInput
            label={t.auth.lastName}
            icon="person-outline"
            value={form.values.lastName}
            onChangeText={(text) => form.setField('lastName', sanitizers.letters(text))}
            onBlur={() => form.blur('lastName')}
            error={form.errorFor('lastName')}
            touched={form.isTouched('lastName')}
            autoCapitalize="words"
            maxLength={40}
            helperText="Solo letras"
          />

          <FormInput
            label={t.auth.email}
            icon="mail-outline"
            value={form.values.email}
            onChangeText={(text) => form.setField('email', sanitizers.email(text))}
            onBlur={() => form.blur('email')}
            error={form.errorFor('email')}
            touched={form.isTouched('email')}
            keyboardType="email-address"
            maxLength={80}
          />

          <FormInput
            label={t.auth.phone}
            icon="call-outline"
            value={form.values.phone}
            onChangeText={(text) => form.setField('phone', sanitizers.digits(text))}
            onBlur={() => form.blur('phone')}
            error={form.errorFor('phone')}
            touched={form.isTouched('phone')}
            keyboardType="number-pad"
            maxLength={15}
            helperText="Solo números, entre 7 y 15 dígitos"
          />

          <Button
            title={loading ? t.common.saving : t.common.save}
            onPress={onSubmit}
            loading={loading}
            disabled={!isDirty}
            style={{ marginTop: spacing.sm }}
            accessibilityHint={
              !isDirty ? 'Modificá algún campo para habilitar el guardado' : undefined
            }
          />
          {!isDirty && <Text style={styles.hint}>{t.settings.noChanges}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: { ...typography.h3, color: colors.text },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  avatarBlock: { alignItems: 'center', marginBottom: spacing.lg },
  subtitle: { ...typography.small, color: colors.textMuted, marginTop: spacing.sm },
  hint: { ...typography.tiny, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
