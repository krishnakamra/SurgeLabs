/**
 * Toronto wall-clock maths, without a date library.
 *
 * The shop's one standing deadline — artwork approved before 11am on a
 * weekday goes to press that day — is a claim about Ontario time, and a
 * visitor in Vancouver or Dubai has to see the same deadline the shop keeps.
 * Doing this against the viewer's own clock would tell someone in Calgary
 * they had two more hours than they do.
 *
 * `Intl.DateTimeFormat` already knows the whole tz database including DST, so
 * the only trick needed is turning a Toronto wall-clock reading back into an
 * absolute instant.
 */

const TZ = "America/Toronto";

const parts = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  hour12: false,
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

type Wall = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 0 = Sunday. */
  weekday: number;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** What the clock on the wall in Mississauga says at this instant. */
export function torontoWall(at: Date): Wall {
  const found = Object.fromEntries(parts.formatToParts(at).map((p) => [p.type, p.value]));
  return {
    year: Number(found.year),
    month: Number(found.month),
    day: Number(found.day),
    // "24" at midnight in some engines; % 24 normalises it.
    hour: Number(found.hour) % 24,
    minute: Number(found.minute),
    weekday: Math.max(0, DAYS.indexOf(String(found.weekday))),
  };
}

/** How far Toronto is from UTC at a given instant, in milliseconds. */
function offsetMs(at: Date): number {
  const w = torontoWall(at);
  const asUtc = Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, 0);
  // Second-level drift is irrelevant here; offsets are whole minutes.
  return asUtc - Math.floor(at.getTime() / 60_000) * 60_000;
}

/**
 * The absolute instant of a given Toronto wall-clock time.
 *
 * Two passes, because the offset depends on the instant and the instant
 * depends on the offset. The first guess is wrong only across a DST boundary,
 * and the second pass fixes it.
 */
export function torontoInstant(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guess = new Date(naive - offsetMs(new Date(naive)));
  guess = new Date(naive - offsetMs(guess));
  return guess;
}

/**
 * The next weekday 11am in Toronto — the same-day print cut-off.
 *
 * Before 11am on a weekday that is today. After it, or on a weekend, it is
 * 11am on the next working day. Statutory holidays are not modelled: the
 * consequence of missing one is that the page shows a cut-off the shop is
 * closed for, which is a smaller error than a countdown that lies about
 * every ordinary Tuesday.
 */
export function nextCutoff(now: Date, hour = 11): Date {
  const w = torontoWall(now);
  const beforeCutoffToday = w.hour < hour;
  const isWeekday = w.weekday >= 1 && w.weekday <= 5;

  let year = w.year;
  let month = w.month;
  let day = w.day;
  let weekday = w.weekday;

  // Start from today if it is a weekday and the cut-off has not passed.
  let advance = !(isWeekday && beforeCutoffToday);

  while (advance || weekday === 0 || weekday === 6) {
    // Date arithmetic in UTC on a date-only value is safe: no DST to cross.
    const stepped = new Date(Date.UTC(year, month - 1, day + 1));
    year = stepped.getUTCFullYear();
    month = stepped.getUTCMonth() + 1;
    day = stepped.getUTCDate();
    weekday = stepped.getUTCDay();
    advance = false;
  }

  return torontoInstant(year, month, day, hour);
}

/** "today", "tomorrow" or a weekday name, relative to Toronto. */
export function cutoffDayLabel(now: Date, cutoff: Date): string {
  const a = torontoWall(now);
  const b = torontoWall(cutoff);
  if (a.year === b.year && a.month === b.month && a.day === b.day) return "today";
  const tomorrow = new Date(Date.UTC(a.year, a.month - 1, a.day + 1));
  if (
    tomorrow.getUTCFullYear() === b.year &&
    tomorrow.getUTCMonth() + 1 === b.month &&
    tomorrow.getUTCDate() === b.day
  ) {
    return "tomorrow";
  }
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][b.weekday]!;
}
