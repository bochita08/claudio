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
import {
  sanitizers,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from '../../utils/validation';
import { useForm } from '../../hooks/useForm';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const initial: Values = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = useCallback(
    (v: Values) => ({
      firstName: validateName(v.firstName, 'El nombre'),
      lastName: validateName(v.lastName, 'El apellido'),
      email: validateEmail(v.email),
      phone: validatePhone(v.phone),
      password: validatePassword(v.password),
      confirmPassword: validateConfirmPassword(v.confirmPassword, v.password),
    }),
    [],
  );

  const form = useForm<Values>(initial, validate);

  const onSubmit = () => {
    setSubmitError('');
    form.handleSubmit(async (values) => {
      setLoading(true);
      try {
        await signUp({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        });
        navigation.navigate('SignIn', { notice: t.auth.signUpOk });
      } catch (err) {
        if (err instanceof ApiError && err.code === 'EMAIL_TAKEN') {
          setSubmitError(t.auth.emailTaken);
        } else {
          setSubmitError(t.auth.genericError);
        }
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <AuthLayout
      title={t.auth.signUpTitle}
      subtitle={t.auth.signUpSubtitle}
      onBack={() => navigation.goBack()}
    >
      {!!submitError && <Banner kind="error" message={submitError} />}

      <FormInput
        label={t.auth.firstName}
        icon="person-outline"
        value={form.values.firstName}
        onChangeText={(text) => form.setField('firstName', sanitizers.letters(text))}
        onBlur={() => form.blur('firstName')}
        error={form.errorFor('firstName')}
        touched={form.isTouched('firstName')}
        autoCapitalize="words"
        autoComplete="name"
        placeholder="Juan"
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
        placeholder="Perez"
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
        autoComplete="email"
        placeholder="nombre@dominio.com"
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
        autoComplete="tel"
        placeholder="1145551234"
        maxLength={15}
        helperText="Solo números, entre 7 y 15 dígitos"
      />

      <FormInput
        label={t.auth.password}
        icon="lock-closed-outline"
        value={form.values.password}
        onChangeText={(text) => form.setField('password', text)}
        onBlur={() => form.blur('password')}
        error={form.errorFor('password')}
        touched={form.isTouched('password')}
        secureTextEntry
        placeholder="Minimo 8 caracteres"
        maxLength={64}
        helperText="8+ caracteres, una mayúscula, una minúscula y un número"
      />

      <FormInput
        label={t.auth.confirmPassword}
        icon="lock-closed-outline"
        value={form.values.confirmPassword}
        onChangeText={(text) => form.setField('confirmPassword', text)}
        onBlur={() => form.blur('confirmPassword')}
        error={form.errorFor('confirmPassword')}
        touched={form.isTouched('confirmPassword')}
        secureTextEntry
        placeholder="Repetí la contraseña"
        maxLength={64}
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />

      <Button
        title={t.auth.signUpCta}
        onPress={onSubmit}
        loading={loading}
        style={{ marginTop: spacing.sm }}
      />

      <View style={styles.footer}>
        <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={8}>
          <Text style={styles.link}>{t.auth.toSignIn}</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  link: { ...typography.small, color: colors.primary, fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: spacing.xl },
});
