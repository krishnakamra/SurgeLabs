#!/usr/bin/env bash
#
# Downloads everything made for social into ./social/ — the two price ads,
# the four product photographs behind them, twelve process reels and twelve
# UGC videos.
#
#   bash scripts/download-social.sh
#
# Run it from a normal network. The office/agent proxy this repo was built
# behind denies both CloudFront hosts, which is why these are not committed.
# Nothing here needs a login: the URLs are public.
#
set -euo pipefail
OUT="${1:-social}"
GEN=https://d8j0ntlcm91z4.cloudfront.net/user_3HIEeigdQwB131Po1s53Xd8vSx4
UP=https://d2ol7oe51mr4n9.cloudfront.net/user_3HIEeigdQwB131Po1s53Xd8vSx4

mkdir -p "$OUT/ads" "$OUT/reels" "$OUT/photos"

get () { # get <url> <destination>
  if [ -s "$2" ]; then echo "  · have  $(basename "$2")"; return; fi
  printf '  · get   %s ... ' "$(basename "$2")"
  curl -fsSL --retry 3 --retry-delay 2 -o "$2" "$1" && echo ok || { echo FAILED; rm -f "$2"; }
}

echo "The two price ads →  $OUT/ads"
get "$UP/24ae5b12-07a5-4417-ab98-e72e4801de06.jpg" "$OUT/ads/price-ad-square-1080x1080.jpg"
get "$UP/3b0d3ca5-44d7-461b-93be-4ebe319ebec8.jpg" "$OUT/ads/price-ad-3x4-1080x1440.jpg"

echo
echo "The four shots behind them →  $OUT/photos"
get "$GEN/hf_20260905_014642_2ce15199-1be8-441c-a7ec-e248f29719e5.png" "$OUT/photos/ad-cards.png"
get "$GEN/hf_20260905_014642_43571594-879a-40a6-8282-61d0d8c94627.png" "$OUT/photos/ad-flyers.png"
get "$GEN/hf_20260905_014642_adf249e5-c389-4aba-aa1a-3baccbd06be0.png" "$OUT/photos/ad-tees.png"
get "$GEN/hf_20260905_014642_12352c44-4251-48f6-9a02-59fe9affa719.png" "$OUT/photos/ad-web.png"

echo
echo "The twelve reels →  $OUT/reels"
# Numbered in the posting order docs/REELS.md sets out, so they sort right.
get "$GEN/hf_20260906_003527_bee9e2ca-9db8-4a43-965f-f6d198db7ade.mp4" "$OUT/reels/01-guillotine-cut.mp4"
get "$GEN/hf_20260906_003527_77861d02-96cc-4dc2-9cf4-9c23df4dfd69.mp4" "$OUT/reels/02-card-riffle.mp4"
get "$GEN/hf_20260906_003527_831a338d-3989-4d2d-b8ba-e3c091d7c26f.mp4" "$OUT/reels/03-heat-press-peel.mp4"
get "$GEN/hf_20260906_003527_a2a138d0-ed3c-41fb-8ed3-2d44dd4d0177.mp4" "$OUT/reels/04-squeegee-pull.mp4"
get "$GEN/hf_20260906_003527_4fee52c0-7309-4aae-b51e-c5e7d702bc6a.mp4" "$OUT/reels/05-embroidery.mp4"
get "$GEN/hf_20260906_003527_10275d73-1c24-41ef-8ef6-37a7c46a4633.mp4" "$OUT/reels/06-weeding-vinyl.mp4"
get "$GEN/hf_20260906_003527_6925b820-1ffd-4774-b7ba-c99b462e3d80.mp4" "$OUT/reels/07-gold-foil.mp4"
get "$GEN/hf_20260906_003527_6805874b-d96f-4b44-adb0-78e0df4305e7.mp4" "$OUT/reels/08-press-delivery.mp4"
get "$GEN/hf_20260906_003527_6b995fc7-15c9-4cee-98eb-35e865de46c6.mp4" "$OUT/reels/09-van-lettering.mp4"
get "$GEN/hf_20260906_003527_4d102d8d-9cce-4364-ba34-1960e57b35b5.mp4" "$OUT/reels/10-banner-off-roll.mp4"
get "$GEN/hf_20260906_003536_6a4a0ded-b189-451b-a04d-6dc2cf026353.mp4" "$OUT/reels/11-pack-out.mp4"
get "$GEN/hf_20260906_003527_d852d41e-135d-4cb0-9fa2-99ed2eb8e7af.mp4" "$OUT/reels/12-shop-walkthrough.mp4"

echo
echo "The twelve UGC videos →  $OUT/ugc"
mkdir -p "$OUT/ugc"
# Scripts, hooks and captions: docs/UGC.md
get "$GEN/hf_20260906_005639_19c731fd-8c65-4208-aa99-b7e979936dc1.mp4" "$OUT/ugc/01-three-week-quote.mp4"
get "$GEN/hf_20260906_005639_b8f364fc-c13e-45f8-a93b-9ccfef1611f3.mp4" "$OUT/ugc/02-price-nobody-believes.mp4"
get "$GEN/hf_20260906_005639_9fbbc539-546a-4ffc-9808-79461a0d5f40.mp4" "$OUT/ugc/03-why-your-flyer-feels-cheap.mp4"
get "$GEN/hf_20260906_005639_d4a25afd-a9d3-4da3-a078-759b48f0ea01.mp4" "$OUT/ugc/04-one-shirt-is-a-real-order.mp4"
get "$GEN/hf_20260906_005639_b7daa7a8-b0ef-4d7c-8ef6-6fd81b7d9666.mp4" "$OUT/ugc/05-your-logo-is-a-jpeg.mp4"
get "$GEN/hf_20260906_005600_cbf5aa9c-b72f-42be-af72-13eade51be2f.mp4" "$OUT/ugc/06-the-blank-van.mp4"
get "$GEN/hf_20260906_005639_6aef74bb-a45d-45cf-b81a-6e559de3d9ff.mp4" "$OUT/ugc/07-how-to-spend-500.mp4"
get "$GEN/hf_20260906_005639_b6b25365-3375-49d4-9e06-f5fb12661a67.mp4" "$OUT/ugc/08-gold-foil-secret.mp4"
get "$GEN/hf_20260906_005639_242f23bc-76a6-40de-9267-6309c3b1065b.mp4" "$OUT/ugc/09-the-5000-dollar-website.mp4"
get "$GEN/hf_20260906_005639_93ac204e-ff65-4722-8659-0e5fb7025d97.mp4" "$OUT/ugc/10-four-oclock-panic.mp4"
get "$GEN/hf_20260906_005639_ff21d046-ca4d-4c0c-9cc5-93f888e33eaf.mp4" "$OUT/ugc/11-five-vendors.mp4"
get "$GEN/hf_20260906_005639_30c3f2d9-7ed4-463a-a928-b5ef958ecb7a.mp4" "$OUT/ugc/12-feel-that.mp4"

echo
echo "The presenter reference stills →  $OUT/ugc"
# Keep these. Feed either one back as an image reference and the next batch of
# videos has the same face, which is the whole point of a consistent presenter.
get "$GEN/hf_20260906_005444_4684dbd0-574c-4bec-8ed1-7ebfe2a652f4.png" "$OUT/ugc/presenter-a-print-shop.png"
get "$GEN/hf_20260906_005443_94f49d3a-31eb-40d4-a4d5-c449eaa5f159.png" "$OUT/ugc/presenter-b-apparel-shop.png"

echo
echo "Done."
echo "  Reels  — captions and posting order: docs/REELS.md"
echo "  UGC    — scripts, hooks and captions: docs/UGC.md"
du -sh "$OUT" 2>/dev/null || true
