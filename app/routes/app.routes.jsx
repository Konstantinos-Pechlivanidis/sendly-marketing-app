import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  throw redirect("/app/dashboard");
};

export default function AppRoutesRedirect() {
  return null;
}


