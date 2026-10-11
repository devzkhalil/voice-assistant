/** GitHub contribution calendar via a public, token-free proxy (https://github.com/grubersjoe/github-contributions-api). */
export interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
  total: number;
  days: Day[];
}

export async function getContributions(user: string, year: "last" | number): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=${year}`, {
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { total: Record<string, number>; contributions: Day[] };
    return { total: Object.values(data.total)[0] ?? 0, days: data.contributions };
  } catch {
    return null;
  }
}
