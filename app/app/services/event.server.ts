const BACKEND_URL = process.env.BACKEND_URL;

export async function getEvents(request: Request, searchParams = {}) {
  try {
    const queryParams = new URLSearchParams(searchParams).toString();
    const url = `${BACKEND_URL}/api/event/${
      queryParams ? "?" + queryParams : ""
    }`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("Cookie") ?? "",
      },
    });

    const resJson = await response.json();

    if (response.ok) {
      return resJson;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Response("An internal server error occurred", { status: 500 });
  }
}

export async function getEvent(request: Request, id: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/event/${id}`, {
      headers: {
        "Content-Type": "application/json",
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

export async function changeFavorite(
  request: Request,
  eventId: string,
  isAdding: boolean
) {
  try {
    const body = {
      isAdding,
    };
    const response = await fetch(`${BACKEND_URL}/api/event/${eventId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("Cookie") ?? "",
      },
      body: JSON.stringify(body),
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
