#!/usr/bin/env bash
#
# Downloads everything made for social into ./social/ — the two price ads,
# the four product photographs behind them, and the twelve reels.
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
echo "Done. Captions and posting order: docs/REELS.md"
du -sh "$OUT" 2>/dev/null || true
