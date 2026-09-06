# 12 reels — hooks, captions, posting order

Twelve vertical clips, 9:16, 1080p, 8 seconds, with sound. Built for a brand
new account with nothing on it yet.

**Get them:** `bash scripts/download-social.sh` — pulls all twelve plus the two
price ads and the four product photos into `social/`, numbered in posting
order. Run it on a normal network; the proxy this repo was built behind blocks
both CloudFront hosts, which is why they are not committed.

## Why these are all shop-floor, and none of them is a person talking

You asked for UGC with a creator in it. Two reasons this set went a different
way, and both are worth a minute:

**Faces are where AI video gives itself away.** Hands at macro, machines, and
paper hold up. A face holding a product for eight seconds does not — the eyes,
the teeth and the lip sync are what people clock instantly, and a viewer who
clocks it stops trusting the account, not just the clip. Machinery has no
uncanny valley.

**A person saying they ordered from you is a testimonial.** If they never
did, that is a fabricated endorsement, and under the Competition Act the
penalty side of that is not small. A spokesperson reading your prices in
your own ad is fine; an actor playing a happy customer is not. This set
sidesteps it entirely by having no one make a claim.

There is also a plain performance argument: process content is what actually
runs on print and apparel accounts. The guillotine, the peel, the weed, the
squeegee pull. People watch those to the end and then watch them again.
That is the metric the algorithm reads.

If you still want a presenter, say so and I'll do three of those as a
separate set — reading real prices, no invented customer story.

---

## Posting order

Do not dump twelve on day one. Three a week, in this order — it front-loads
the three most watchable and spaces the slower ones between them.

**Week 1** — 1 Guillotine · 3 Heat press peel · 6 Weeding
**Week 2** — 7 Gold foil · 4 Squeegee pull · 11 Pack-out
**Week 3** — 5 Embroidery · 2 Card riffle · 9 Van lettering
**Week 4** — 8 Press delivery · 10 Banner · 12 Shop walkthrough

Post 11am–1pm or 6–9pm Eastern. Keep the original audio on — the sound is
half of why these work. If you add music, duck it under the machine noise
rather than replacing it.

---

## 1 · Guillotine cut

**On-screen hook (first 0.5s):** `1,000 business cards. $99.`
**Second card (~4s):** `Cut here in Mississauga.`

> 16pt matte, both sides, design included. $99 for a thousand.
> Cut, boxed and ready in a couple of days.
> Mississauga — 905-598-3960
>
> #mississauga #businesscards #printshop #smallbusinesstoronto #gta #printing #asmr

## 2 · Card riffle

**Hook:** `You can hear 16pt.`

> Thin cards feel like a receipt. These don't.
> 1,000 for $99, design included.
> #businesscards #16pt #printshop #mississauga #satisfying #smallbusiness

## 3 · Heat press peel

**Hook:** `The peel.`
**Second card:** `T-shirts from $12. No minimum.`

> One shirt is a real order. Full colour, from $12 each.
> Bring us a logo or we'll draw you one.
> #screenprinting #customtshirts #heatpress #mississauga #satisfying #smallbusiness

## 4 · Squeegee pull

**Hook:** `One pull. That's the whole shirt.`

> Manual press, one colour at a time. From $12 a shirt, no minimum order.
> #screenprinting #printshop #customapparel #mississauga #behindthescenes

## 5 · Embroidery

**Hook:** `12 needles. One logo.`

> Embroidered polos and hi-vis for crews. Digitising is a one-time $45 and
> then it's on file forever.
> #embroidery #workwear #customapparel #mississauga #trades #asmr

## 6 · Weeding vinyl

**Hook:** `Weeding is the worst part.`
**Second card (~5s):** `It's also the best part.`

> Cut vinyl for windows, vans and signs. Every one of these gets weeded by hand.
> #vinyl #signmaking #weeding #satisfying #mississauga #smallbusiness

## 7 · Gold foil

**Hook:** `Gold foil on matte black.`

> Foil is the cheapest way to make a card feel expensive. Ask for it on your
> next run.
> #goldfoil #foilstamping #businesscards #luxury #printshop #mississauga

## 8 · Press delivery tray

**Hook:** `500 flyers, coming out.`
**Second card:** `$120. 100lb gloss.`

> 8.5 × 11, 100lb gloss text, 500 for $120. Design them yourself or we'll lay
> them out.
> #flyers #printing #smallbusiness #mississauga #marketing #gta

## 9 · Van lettering

**Hook:** `Your van is a billboard you already own.`

> Cut vinyl lettering, from $180 a side. Fitted here.
> #vehiclelettering #vinylwrap #signage #trades #mississauga #contractor

## 10 · Banner off the roll

**Hook:** `Ten feet of banner, coming off the roll.`

> Vinyl banners, feather flags, lawn signs, window graphics. Wide format is
> in-house — nothing gets sent out.
> #widerformat #banners #signage #printshop #mississauga

## 11 · Pack-out

**Hook:** `One box. Cards, flyers, shirts.`
**Second card:** `One invoice.`

> Most shops do one of these and jobber out the rest. We do all of it under
> one roof, which is why it's one bill and one person to call.
> #printshop #smallbusiness #mississauga #onestopshop #gta

## 12 · Shop walkthrough

**Hook:** `Everything in this room is ours.`

> Press, wide format, embroidery, heat press. Print, signs, apparel and the
> website, in one place in Mississauga.
> surgelabs.ca · 905-598-3960
> #printshop #mississauga #smallbusiness #behindthescenes #gta #signage

---

## Rules for anything you add on top

- **Every price on this page matches the website.** Change one in
  `content/packages.ts` and change it here, or the reel and the site disagree
  and a customer screenshots the cheaper one.
- **Never caption a clip as a specific customer's job.** These are staged.
  Say what the product is, not whose it was.
- **No review counts, no "500+ happy clients", no star ratings** unless they
  come from somewhere real and countable. The site refuses to invent those and
  so should the reels.
- Text overlays: Montserrat ExtraBold, white, with a soft dark shadow so it
  reads over the footage. Keep the hook inside the top third — TikTok's UI
  covers the bottom right.
