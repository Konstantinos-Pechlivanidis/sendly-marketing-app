import { redirect } from "react-router";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    // If a shop is present, it means Shopify is trying to authenticate.
    // We should proceed with the login flow without showing a form.
    await login(request);
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  // If no shop is present, it might be a direct access or an unauthenticated state.
  // We can let the default Shopify auth flow handle it, which will redirect to /auth.
  // Or, if login is configured to show a form, we can show it.
  // For embedded apps, typically we don't show a login form.
  // This path should ideally not be hit if the app is always embedded.
  throw redirect("/auth"); // Redirect to the main auth flow
};

export const action = async ({ request }) => {
  // This action should ideally not be hit if the login form is removed.
  // If it is, it means a direct POST to /auth/login happened.
  await login(request);
  return null;
};

export default function AuthLoginRoute() {
  // This component should not render anything as the loader/action handles redirects.
  return null;
}
