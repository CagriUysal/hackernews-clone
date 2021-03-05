export default function validatePassword(password: string): void {
  if (password.length < 8 || password.length > 72) {
    throw Error(
      `Passwords should be between 8 and 72 characters long. Please choose another.`
    );
  }
}
