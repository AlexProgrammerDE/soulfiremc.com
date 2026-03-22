const TURNSTILE_SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export const UPVOTE_TURNSTILE_ACTION = "upvote";

type TurnstileSiteverifyResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export function getTurnstileRemoteIp(headers: Headers): string | null {
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  const forwardedFor = headers.get("x-forwarded-for");
  if (!forwardedFor) {
    return null;
  }

  return (
    forwardedFor
      .split(",")
      .map((value) => value.trim())
      .find(Boolean) ?? null
  );
}

export function getExpectedTurnstileHostname(hostname: string): string | null {
  const normalizedHostname = hostname.toLowerCase();
  if (LOCAL_HOSTNAMES.has(normalizedHostname)) {
    return null;
  }

  return normalizedHostname;
}

export async function validateTurnstileToken({
  token,
  remoteIp,
  expectedAction,
  expectedHostname,
}: {
  token: string;
  remoteIp?: string | null;
  expectedAction?: string;
  expectedHostname?: string | null;
}) {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return {
      success: false,
      errorCodes: ["invalid-input-response"],
    };
  }

  const upvoteSecretKey = process.env.UPVOTE_TURNSTILE_SECRET_KEY;
  const secret = upvoteSecretKey ?? "";
  if (!secret) {
    return {
      success: false,
      errorCodes: ["missing-input-secret"],
    };
  }

  const formData = new FormData();
  formData.set("secret", secret);
  formData.set("response", token);
  formData.set("idempotency_key", crypto.randomUUID());

  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  let siteverifyResponse: Response;

  try {
    siteverifyResponse = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      errorCodes: ["internal-error"],
    };
  }

  if (!siteverifyResponse.ok) {
    return {
      success: false,
      errorCodes: ["internal-error"],
    };
  }

  const result =
    (await siteverifyResponse.json()) as TurnstileSiteverifyResponse;

  if (!result.success) {
    return {
      success: false,
      errorCodes: result["error-codes"] ?? ["invalid-input-response"],
    };
  }

  if (expectedAction && result.action !== expectedAction) {
    return {
      success: false,
      errorCodes: ["action-mismatch"],
    };
  }

  if (expectedHostname && result.hostname !== expectedHostname) {
    return {
      success: false,
      errorCodes: ["hostname-mismatch"],
    };
  }

  return {
    success: true,
    errorCodes: [],
  };
}
