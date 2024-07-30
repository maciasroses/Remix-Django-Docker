const BACKEND_URL = process.env.BACKEND_URL;

export async function getLocation(request: Request) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/location/`, {
      headers: {
        cookie: request.headers.get("Cookie") ?? "",
      },
    });

    const resJson = await response.json();

    if (response.ok) {
      return resJson.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Response("An internal server error occurred", { status: 500 });
  }
}
