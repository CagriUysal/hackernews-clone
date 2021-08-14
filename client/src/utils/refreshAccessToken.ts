export default async function refreshAccessToken(): Promise<Response> {
  const response = await fetch(process.env.REFRESH_TOKEN_URL!, {
    method: "POST",
    credentials: "include",
  });

  return response;
}
