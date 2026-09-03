import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import Banner from '../../components/Banner';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../i18n';
import { AuthStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { sanitizers, validateEmail } from '../../utils/validation';
import { useForm } from '../../hooks/useForm';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

type Values = {
  email: string;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = useCallback((v: Values) => ({ email: validateEmail(v.email) }), []);
  const form = useForm<Values>({ email: '' }, validate);

  const onSubmit = () => {
    setSubmitError('');
    form.handleSubmit(async (values) => {
      setLoading(true);
      try {
        await forgotPassword(values.email);
        setDone(true);
      } catch {
        setSubmitError(t.auth.genericError);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <AuthLayout
      title={t.auth.forgotTitle}
      subtitle={t.auth.forgotSubtitle}
      onBack={() => navigation.goBack()}
    >
      {done ? (
        <View>
          <Banner kind="success" message={t.auth.forgotOk} />
          <Button
            title={t.auth.backToSignIn}
            onPress={() => navigation.navigate('SignIn')}
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        <>
          {!!submitError && <Banner kind="error" message={submitError} />}
          <FormInput
            label={t.auth.email}
            icon="mail-outline"
            value={form.values.email}
            onChangeText={(text) => form.setField('email', sanitizers.email(text))}
            onBlur={() => form.blur('email')}
            error={form.errorFor('email')}
            touched={form.isTouched('email')}
            keyboardType="email-address"
            autoComplete="email"
            placeholder="nombre@dominio.com"
            maxLength={80}
            returnKeyType="send"
            onSubmitEditing={onSubmit}
          />

          <Button
            title={t.auth.forgotCta}
            onPress={onSubmit}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />

          <View style={styles.footer}>
            <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={8}>
              <Text style={styles.link}>{t.auth.backToSignIn}</Text>
            </Pressable>
          </View>
        </>
      )}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  link: { ...typography.small, color: colors.primary, fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: spacing.xl },
});
