const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim());
export const isValidNickname = (value: string) => {
  const length = value.trim().length;
  return length >= 2 && length <= 12;
};
export const isValidPassword = (value: string) => PASSWORD_REGEX.test(value);
