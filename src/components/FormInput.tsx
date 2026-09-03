import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  /** Solo se muestra el error si el campo fue "tocado" (blur) o se intento enviar. */
  touched?: boolean;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'password' | 'name' | 'tel' | 'off';
  maxLength?: number;
  editable?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  helperText?: string;
  returnKeyType?: 'done' | 'next' | 'go' | 'send';
  onSubmitEditing?: () => void;
  testID?: string;
}

const FormInput = forwardRef<TextInput, Props>(function FormInput(
  {
    label,
    value,
    onChangeText,
    onBlur,
    error,
    touched,
    placeholder,
    secureTextEntry,
    keyboardType,
    autoCapitalize = 'none',
    autoComplete = 'off',
    maxLength,
    editable = true,
    icon,
    helperText,
    returnKeyType,
    onSubmitEditing,
    testID,
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const showError = !!error && !!touched;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          showError && styles.inputRowError,
          !editable && styles.inputRowDisabled,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={showError ? colors.danger : colors.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          ref={ref}
          testID={testID}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          maxLength={maxLength}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>
      {showError ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
});

export default FormInput;

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.xs },
  label: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputRowFocused: { borderColor: colors.primary },
  inputRowError: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  inputRowDisabled: { backgroundColor: colors.background, opacity: 0.7 },
  icon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: 12,
  },
  errorText: {
    ...typography.small,
    color: colors.danger,
    marginTop: 4,
    minHeight: 18,
  },
  helperText: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 4,
    minHeight: 18,
  },
  spacer: { minHeight: 18, marginTop: 4 },
});
