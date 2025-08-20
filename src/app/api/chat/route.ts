import { ProvideLinksToolSchema } from '~/lib/inkeep-qa-schema';
import { convertToModelMessages, streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export const runtime = 'edge';

const groq = createGroq();

export async function POST(req: Request) {
  const reqJson = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    tools: {
      provideLinks: {
        inputSchema: ProvideLinksToolSchema,
      },
    },
    messages: convertToModelMessages(reqJson.messages, {
      ignoreIncompleteToolCalls: true,
    }),
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
}
