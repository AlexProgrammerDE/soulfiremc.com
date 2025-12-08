import { getFullLLMText } from "@/lib/get-llm-text";

export async function GET() {
  return new Response(await getFullLLMText());
}
