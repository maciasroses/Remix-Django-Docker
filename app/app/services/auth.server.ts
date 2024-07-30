import { redirect, json } from "@remix-run/node";

interface RegisterProps {
  username: string;
  email: string;
  password: string;
}

const BACKEND_URL = process.env.BACKEND_URL;

export async function register(data: RegisterProps) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const resJson = await response.json();

    if (response.ok) {
      return redirect("/login", {
        headers: {
          "Set-Cookie": `jwt=${resJson.jwt}; Path=/; HttpOnly; SameSite=Lax`,
        },
      });
    } else {
      interface Errors {
        username?: string;
        email?: string;
      }

      const errors: Errors = {};
      if (resJson.username) {
        errors.username = resJson.username;
      }
      if (resJson.email) {
        errors.email = resJson.email;
      }

      return json({ errors }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    throw new Response("An internal server error occurred", { status: 500 });
  }
}

interface LoginProps {
  email: string;
  password: string;
}

export async function login(data: LoginProps) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const resJson = await response.json();

    if (response.ok) {
      return redirect("/home", {
        headers: {
          "Set-Cookie": `jwt=${resJson.jwt}; Path=/; HttpOnly; SameSite=Lax`,
        },
      });
    } else {
      return json({ message: resJson.detail }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    throw new Response("An internal server error occurred", { status: 500 });
  }
}

export async function logout() {
  try {
    await fetch(`${BACKEND_URL}/api/logout/`, {
      method: "POST",
    });
    return redirect("/", {
      headers: {
        "Set-Cookie": `jwt=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Response("An internal server error occurred", { status: 500 });
  }
}
