import type { paths } from "@octokit/openapi-types";

export type LatestReleaseResponse =
  paths["/repos/{owner}/{repo}/releases/latest"]["get"]["responses"]["200"]["content"]["application/json"];

const CLIENT_REPO = "AlexProgrammerDE/SoulFireClient";
const SERVER_REPO = "AlexProgrammerDE/SoulFire";

export async function getRepoInfo(
  repo: string,
): Promise<LatestReleaseResponse> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases/latest`,
  );
  return await response.json();
}

export async function getReleaseData(): Promise<{
  clientData: LatestReleaseResponse;
  serverData: LatestReleaseResponse;
}> {
  const [clientData, serverData] = await Promise.all([
    getRepoInfo(CLIENT_REPO),
    getRepoInfo(SERVER_REPO),
  ]);

  return {
    clientData,
    serverData,
  };
}

export async function getClientRelease(): Promise<LatestReleaseResponse> {
  return getRepoInfo(CLIENT_REPO);
}

export async function getServerRelease(): Promise<LatestReleaseResponse> {
  return getRepoInfo(SERVER_REPO);
}

export function getReleaseVersion(
  release: LatestReleaseResponse,
): string | undefined {
  const raw = release?.tag_name ?? release?.name;
  if (!raw) return undefined;
  return raw.trim().replace(/^v/i, "");
}
