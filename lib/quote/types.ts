export type QuoteAnswers = Record<string, string | string[]>;

export type QuoteContact = {
  name: string;
  business: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
};

export type QuoteSubmission = {
  reference: string;
  needs: string[];
  /** Package slug from ?package=, if the visitor arrived from /packages. */
  packageSlug: string | null;
  answers: QuoteAnswers;
  deadline: string;
  budget: string;
  contact: QuoteContact;
  attachment: { name: string; size: number; type: string } | null;
  submittedAt: string;
  /** Which service/city page they came from, if any. */
  source: string | null;
};

export type QuoteResult =
  | { ok: true; reference: string; stored: boolean; emailed: boolean }
  | { ok: false; error: string };

/** One line on the job ticket. */
export type TicketRow = { label: string; value: string };
