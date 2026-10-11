import Link from "next/link";
import { ScrollEnd } from "./ScrollEnd";
import { getContributions, type Day } from "@/lib/contributions";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Groups days into week columns (Sun..Sat), padding the first column so rows line up with weekdays. */
function toWeeks(days: Day[]): (Day | null)[][] {
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = [];
  const firstDow = days.length ? new Date(days[0].date + "T00:00:00Z").getUTCDay() : 0;
  for (let i = 0; i < firstDow; i++) week.push(null);
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export async function ContributionGraph({ user, year, startYear }: { user: string; year: "last" | number; startYear: number }) {
  const data = await getContributions(user, year);
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: thisYear - startYear + 1 }, (_, i) => thisYear - i);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-textMuted">
          {data ? (
            <>
              <span className="font-semibold text-textDefault">{data.total.toLocaleString()}</span> contributions{" "}
              {year === "last" ? "in the last year" : `in ${year}`}
            </>
          ) : (
            "contribution stats"
          )}
        </span>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <Link
            href="/"
            className={`rounded-md border px-2.5 py-1 transition ${year === "last" ? "border-borderActive bg-bgMuted text-white" : "border-borderDefault text-textMuted hover:bg-bgMuted"}`}
          >
            Last year
          </Link>
          {years.map((y) => (
            <Link
              key={y}
              href={`/?year=${y}`}
              className={`rounded-md border px-2.5 py-1 transition ${year === y ? "border-borderActive bg-bgMuted text-white" : "border-borderDefault text-textMuted hover:bg-bgMuted"}`}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      {data ? (
        <GraphBody days={data.days} />
      ) : (
        <p className="rounded-md border border-borderDefault p-4 text-sm text-textMuted">
          Couldn&apos;t load contributions right now.{" "}
          <a className="text-accent hover:underline" href={`https://github.com/${user}`}>
            See them on GitHub
          </a>
          .
        </p>
      )}
    </div>
  );
}

function GraphBody({ days }: { days: Day[] }) {
  const weeks = toWeeks(days);
  // Label a month above the first week that contains the 1st-7th of that month.
  const labels = weeks.map((w, i) => {
    const first = w.find((d) => d && Number(d.date.slice(8)) <= 7);
    const month = first ? Number(first.date.slice(5, 7)) - 1 : -1;
    const prev = i > 0 ? weeks[i - 1].find((d) => d && Number(d.date.slice(8)) <= 7) : undefined;
    return first && (!prev || Number(prev.date.slice(5, 7)) - 1 !== month) ? MONTHS[month] : "";
  });

  return (
    <ScrollEnd className="overflow-x-auto rounded-md border border-borderDefault p-4">
      <div className="inline-flex gap-2 text-[10px] text-textMuted">
        <div className="mt-[18px] grid grid-rows-7 gap-[3px] pr-1 leading-[11px]">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((l, i) => (
            <span key={i} className="h-[11px]">{l}</span>
          ))}
        </div>
        <div>
          <div className="mb-1 flex gap-[3px]">
            {labels.map((l, i) => (
              <span key={i} className="w-[11px] overflow-visible whitespace-nowrap">{l}</span>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((w, i) => (
              <div key={i} className="grid grid-rows-7 gap-[3px]">
                {w.map((d, j) =>
                  d ? (
                    <span
                      key={j}
                      title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                      className={`contrib-${d.level} h-[11px] w-[11px] rounded-[2px] outline outline-1 -outline-offset-1 outline-white/5`}
                    />
                  ) : (
                    <span key={j} className="h-[11px] w-[11px]" />
                  ),
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-end gap-1">
            Less
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={`contrib-${l} h-[11px] w-[11px] rounded-[2px]`} />
            ))}
            More
          </div>
        </div>
      </div>
    </ScrollEnd>
  );
}
