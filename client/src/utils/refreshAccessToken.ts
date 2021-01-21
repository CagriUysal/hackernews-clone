export default async function refreshAccessToken(): Promise<string> {
  const response = await fetch("http://localhost:3000/refresh", {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  const { accessToken } = data;

  return accessToken;
}
