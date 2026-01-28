import { Client, GatewayIntentBits } from "discord.js";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
  console.error("Error: DISCORD_TOKEN environment variable is required");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: tsx scripts/fetch-discord-icons.ts <invite_code> <output_name>");
  console.error("Example: tsx scripts/fetch-discord-icons.ts ravealts ravealts");
  process.exit(1);
}

const [inviteCode, outputName] = args;
const OUTPUT_DIR = path.join(process.cwd(), "public", "accounts");

async function downloadIcon(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download icon: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  await writeFile(outputPath, Buffer.from(buffer));
}

async function main() {
  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  await client.login(DISCORD_TOKEN);
  console.log(`Logged in as ${client.user?.tag}`);

  try {
    console.log(`Fetching invite: ${inviteCode}`);
    const invite = await client.fetchInvite(inviteCode);

    if (!invite.guild) {
      console.error(`No guild found for invite ${inviteCode}`);
      process.exit(1);
    }

    const iconUrl = invite.guild.iconURL({ size: 256, extension: "png" });
    if (!iconUrl) {
      console.error(`No icon found for guild ${invite.guild.name}`);
      process.exit(1);
    }

    const outputPath = path.join(OUTPUT_DIR, `${outputName}.png`);
    console.log(`Downloading icon for ${invite.guild.name}...`);
    await downloadIcon(iconUrl, outputPath);
    console.log(`Saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error fetching ${inviteCode}:`, error);
    process.exit(1);
  }

  client.destroy();
  console.log("Done!");
}

main().catch(console.error);
