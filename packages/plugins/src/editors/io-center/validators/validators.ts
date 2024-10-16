export function requiredValidator(value: string): string | null {
  return !value ? 'This field is required' : null;
}

export function maxLengthValidator(max: number) {
  return (value: string): string | null => {
    return value.length > max ? `Maximum length is ${max}` : null;
  };
}

export function minLengthValidator(min: number) {
  return (value: string): string | null => {
    return value.length < min ? `Minimum length is ${min}` : null;
  };
}

export function minLengthOrEmptyValidator(min: number) {
  return (value: string): string | null => {
    return value && value.length < min ? `Minimum length is ${min}` : null;
  };
}

export function emailValidator(value: string): string | null {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailPattern.test(value) ? 'Invalid email format' : null;
}

export function numberValidator(value: string | number): string | null {
  return isNaN(Number(value)) ? 'This field should be a number' : null;
}
