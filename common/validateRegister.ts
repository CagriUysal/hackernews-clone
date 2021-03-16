interface IUser {
  name: string;
  password: string;
}

export default function validateRegister({ name, password }: IUser): void {
  const nameTest = /^(\w|_|-)+$/;
  if (!nameTest.test(name) || name.length < 2 || name.length > 15) {
    throw Error(
      `Usernames can only contain letters, digits, dashes and underscores,  
     and should be between 2 and 15 characters long. Please choose another.`
    );
  }

  if (password.length < 8 || password.length > 72) {
    throw Error(
      `Passwords should be between 8 and 72 characters long. Please choose another.`
    );
  }
}
