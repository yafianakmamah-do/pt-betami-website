// lib/microsoftGraph.ts
// Helper to create a Microsoft Graph client using client‑credentials flow.
// Requires the following environment variables in .env.local:
//   GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET, GRAPH_USER_ID (email address of sender)

import { Client } from "@microsoft/microsoft-graph-client";

function getToken(): Promise<string> {
  const tenantId = process.env.GRAPH_TENANT_ID;
  const clientId = process.env.GRAPH_CLIENT_ID;
  const clientSecret = process.env.GRAPH_CLIENT_SECRET;
  const scope = "https://graph.microsoft.com/.default";

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing Microsoft Graph credentials in .env.local");
  }

  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("scope", scope);
  params.append("client_secret", clientSecret);
  params.append("grant_type", "client_credentials");

  return fetch(tokenEndpoint, {
    method: "POST",
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Token request failed: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => data.access_token as string);
}

export async function getGraphClient() {
  const token = await getToken();
  return Client.init({
    authProvider: (done) => {
      done(null, token);
    },
  });
}

export async function sendEmail(to: string, subject: string, content: string) {
  const client = await getGraphClient();
  const sender = process.env.GRAPH_USER_ID;
  if (!sender) {
    throw new Error("GRAPH_USER_ID (sender email) not set in .env.local");
  }

  const message = {
    subject,
    body: {
      contentType: "HTML",
      content,
    },
    toRecipients: [{ emailAddress: { address: to } }],
    from: { emailAddress: { address: sender } },
  };

  await client.api(`/users/${sender}/sendMail`).post({ message });
}
