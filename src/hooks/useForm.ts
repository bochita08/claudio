import { useCallback, useMemo, useState } from 'react';
import { FieldError } from '../utils/validation';

type Errors<T> = Partial<Record<keyof T, FieldError>>;

/**
 * Manejo generico de formularios: valores, campos "tocados", envio y errores.
 * El error de un campo se muestra solo si el campo fue tocado (onBlur) o si ya
 * se intento enviar el formulario.
 */
export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate: (values: T) => Errors<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [values, validate]);
  const isValid = useMemo(() => Object.values(errors).every((e) => !e), [errors]);

  const setField = useCallback((key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const blur = useCallback((key: keyof T) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const errorFor = useCallback(
    (key: keyof T): FieldError => (touched[key] || submitted ? errors[key] : undefined),
    [touched, submitted, errors],
  );

  const isTouched = useCallback(
    (key: keyof T): boolean => !!touched[key] || submitted,
    [touched, submitted],
  );

  const handleSubmit = useCallback(
    (onValid: (values: T) => void) => {
      setSubmitted(true);
      const currentErrors = validate(values);
      if (Object.values(currentErrors).every((e) => !e)) {
        onValid(values);
      }
    },
    [values, validate],
  );

  const reset = useCallback((next: T) => {
    setValues(next);
    setTouched({});
    setSubmitted(false);
  }, []);

  return {
    values,
    errors,
    isValid,
    submitted,
    setField,
    setValues,
    blur,
    errorFor,
    isTouched,
    handleSubmit,
    reset,
  };
}
