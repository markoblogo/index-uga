import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { respondents } from "@/lib/mock-data";

export const DEMO_SESSION_COOKIE = "uga_demo_session";

export type DemoRole = "admin" | "respondent" | "member";

export type DemoUser = {
  username: string;
  role: DemoRole;
  respondentId?: string;
  respondentName?: string;
  issuedAt: number;
  expiresAt: number;
};

type DemoSessionPayload = Omit<DemoUser, "respondentName">;

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const DEMO_AUTH_SECRET =
  process.env.DEMO_AUTH_SECRET ?? "uga-index-local-demo-secret";

export async function getCurrentDemoUser(): Promise<DemoUser | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(DEMO_SESSION_COOKIE);

  if (!cookie?.value) {
    return null;
  }

  const payload = verifySessionCookie(cookie.value);

  if (!payload || payload.expiresAt <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  const respondent = payload.respondentId
    ? respondents.find(({ id }) => id === payload.respondentId)
    : undefined;

  return {
    ...payload,
    respondentName: respondent?.legalName,
  };
}

export async function requireDemoRole(role: DemoRole) {
  const user = await getCurrentDemoUser();

  if (!user) {
    redirect(`/login?next=/${role}`);
  }

  if (user.role !== role) {
    redirect(`/${user.role}`);
  }

  return user;
}

export async function setDemoSession({
  respondentId,
  role,
  username,
}: {
  respondentId?: string;
  role: DemoRole;
  username: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  const safeUsername = username.trim() || "demo";
  const payload: DemoSessionPayload = {
    username: safeUsername,
    role,
    respondentId: role === "respondent" ? respondentId : undefined,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS,
  };

  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, signPayload(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
}

export function isDemoRole(value: FormDataEntryValue | null): value is DemoRole {
  return value === "admin" || value === "respondent" || value === "member";
}

function signPayload(payload: DemoSessionPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  return `${encodedPayload}.${createSignature(encodedPayload)}`;
}

function verifySessionCookie(value: string): DemoSessionPayload | null {
  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  if (!isValidSignature(encodedPayload, signature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<DemoSessionPayload>;

    if (
      typeof parsed.username !== "string" ||
      !isStoredRole(parsed.role) ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    return {
      username: parsed.username,
      role: parsed.role,
      respondentId:
        parsed.role === "respondent" && typeof parsed.respondentId === "string"
          ? parsed.respondentId
          : undefined,
      issuedAt: parsed.issuedAt,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

function createSignature(encodedPayload: string) {
  return createHmac("sha256", DEMO_AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url");
}

function isValidSignature(encodedPayload: string, signature: string) {
  const expected = createSignature(encodedPayload);
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

function isStoredRole(value: unknown): value is DemoRole {
  return value === "admin" || value === "respondent" || value === "member";
}
