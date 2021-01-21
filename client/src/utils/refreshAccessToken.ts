export default async function refreshAccessToken(): Promise<Response> {
  const response = await fetch("http://localhost:3000/refresh", {
    method: "POST",
    credentials: "include",
  });

  return response;
}
