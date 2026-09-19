import { getMockResponse } from "../data/mockResponses";
import { buildQuestionsPayload } from "../data/questions";
import type { ApiMode, SystemOneResponse } from "../types";

let cachedMode: ApiMode | null = null;

export async function fetchApiMode(): Promise<ApiMode> {
  if (cachedMode) return cachedMode;
  try {
    const res = await fetch("/api/mode");
    const data = (await res.json()) as { mode: ApiMode };
    cachedMode = data.mode;
    return data.mode;
  } catch {
    cachedMode = "mock";
    return "mock";
  }
}

export async function askJev(
  ticketBody: string,
  ticketId: string,
  mode: ApiMode,
): Promise<SystemOneResponse> {
  const payload = {
    state: ticketBody,
    model: "jev-latest",
    questions: buildQuestionsPayload(),
  };

  if (mode === "live") {
    const res = await fetch("/api/systemone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`TypeSafe API error: ${res.status} ${err}`);
    }
    return (await res.json()) as SystemOneResponse;
  }

  await delay(900 + Math.random() * 400);
  return getMockResponse(ticketId);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runFanOutAnimation(
  questionIds: string[],
  onProgress: (id: string, index: number) => void,
): Promise<void> {
  const stagger = 120;
  await Promise.all(
    questionIds.map(
      (id, index) =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            onProgress(id, index);
            resolve();
          }, index * stagger);
        }),
    ),
  );
}
