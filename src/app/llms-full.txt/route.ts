import { getFullLLMText } from "~/lib/get-llm-text";

// cached forever
export const revalidate = false;

export async function GET() {
  return new Response(await getFullLLMText());
}
