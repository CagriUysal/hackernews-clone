export default async function (
  _,
  __,
  { isAuth }
): Promise<{ name: string } | null> {
  try {
    const payload = isAuth();

    return {
      name: payload.userName,
    };
  } catch (err) {
    return null;
  }
}
