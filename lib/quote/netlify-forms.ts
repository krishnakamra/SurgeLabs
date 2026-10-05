/**
 * Records a lead with Netlify Forms, from the browser.
 *
 * WHY THIS EXISTS. The quote action stores a lead in Postgres and emails it
 * through Resend, and refuses the lead only when both fail. In production
 * neither had ever been configured — the Netlify site had no environment
 * variables at all — so every form on the site returned "We could not record
 * that" to every visitor, including every one who arrived from a paid ad.
 * That was found by submitting the live form, not by reading the code.
 *
 * Netlify Forms needs no credentials: the host captures the POST itself and
 * keeps it in the dashboard, where it can also email each one to the owner.
 * So the landing forms send to both, and the visitor is told it worked if
 * EITHER route has the lead. Once a database or a Resend key is set, the
 * action starts succeeding too and this becomes a second copy rather than
 * the only one.
 *
 * The form definitions live in public/__forms.html, because Netlify only
 * captures forms it found as static HTML at deploy time.
 */
export async function captureWithNetlify(
  formName: string,
  fields: Record<string, string>,
): Promise<boolean> {
  try {
    const body = new URLSearchParams({ "form-name": formName, ...fields });
    const response = await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return response.ok;
  } catch {
    return false;
  }
}
