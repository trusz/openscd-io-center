export function requiredValidator(value) {
  return !value ? "This field is required" : null;
}
export function maxLengthValidator(max) {
  return (value) => {
    return value.length > max ? `Maximum length is ${max}` : null;
  };
}
export function minLengthValidator(min) {
  return (value) => {
    return value.length < min ? `Minimum length is ${min}` : null;
  };
}
export function minLengthOrEmptyValidator(min) {
  return (value) => {
    return value && value.length < min ? `Minimum length is ${min}` : null;
  };
}
export function emailValidator(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailPattern.test(value) ? "Invalid email format" : null;
}
export function numberValidator(value) {
  return isNaN(Number(value)) ? "This field should be a number" : null;
}
