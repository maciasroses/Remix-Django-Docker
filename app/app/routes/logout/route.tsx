import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "~/services/auth.server";

export const action: ActionFunction = async () => logout();
export const loader: LoaderFunction = async () => redirect("/");
