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
import { ApiError } from '../../services/api';
import { colors, spacing, typography } from '../../theme';
import { sanitizers, validateEmail, validateLoginPassword } from '../../utils/validation';
import { useForm } from '../../hooks/useForm';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

type Values = {
  email: string;
  password: string;
};

export default function SignInScreen({ navigation, route }: Props) {
  const { signIn } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const notice = route.params?.notice ?? '';

  const validate = useCallback(
    (v: Values) => ({
      email: validateEmail(v.email),
      password: validateLoginPassword(v.password),
    }),
    [],
  );

  const form = useForm<Values>({ email: '', password: '' }, validate);

  const onSubmit = () => {
    setSubmitError('');
    form.handleSubmit(async (values) => {
      setLoading(true);
      try {
        await signIn(values.email, values.password);
        // Al setear el usuario, el RootNavigator cambia solo a la app.
      } catch (err) {
        if (err instanceof ApiError && err.code === 'INVALID_CREDENTIALS') {
          setSubmitError(t.auth.invalidCredentials);
        } else {
          setSubmitError(t.auth.genericError);
        }
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <AuthLayout title={t.auth.signInTitle} subtitle={t.auth.signInSubtitle}>
      {!!notice && <Banner kind="success" message={notice} />}
      {!!submitError && <Banner kind="error" message={submitError} />}
      <Banner kind="info" message={t.auth.demoHint} />

      <FormInput
        label={t.auth.email}
        testID="signin-email"
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
      />

      <FormInput
        label={t.auth.password}
        testID="signin-password"
        icon="lock-closed-outline"
        value={form.values.password}
        onChangeText={(text) => form.setField('password', text)}
        onBlur={() => form.blur('password')}
        error={form.errorFor('password')}
        touched={form.isTouched('password')}
        secureTextEntry
        autoComplete="password"
        placeholder="Tu contraseña"
        maxLength={64}
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />

      <Pressable
        onPress={() => navigation.navigate('ForgotPassword')}
        hitSlop={8}
        style={styles.forgotLink}
      >
        <Text style={styles.link}>{t.auth.toForgot}</Text>
      </Pressable>

      <Button
        title={t.auth.signInCta}
        testID="signin-submit"
        onPress={onSubmit}
        loading={loading}
        style={{ marginTop: spacing.md }}
      />

      <View style={styles.footer}>
        <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
          <Text style={styles.link}>{t.auth.toSignUp}</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  forgotLink: { alignSelf: 'flex-end', marginBottom: spacing.sm },
  link: { ...typography.small, color: colors.primary, fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: spacing.xl },
});
