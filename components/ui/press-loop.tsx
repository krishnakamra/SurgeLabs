"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { VideoAsset } from "@/content/media";
import { cn } from "@/lib/cn";

export type PressLoopProps = {
  asset: VideoAsset;
  /** Poster to paint before the video is ready. Defaults to the asset's own. */
  poster?: string;
  className?: string;
  /**
   * Preload the poster. Set it on the one loop that is above the fold and
   * nowhere else — four prioritised posters is four images competing to be
   * first, which is the same as none of them being first.
   */
  priority?: boolean;
  /** Passed to next/image so it can pick a source width. */
  sizes?: string;
};

/**
 * A silent, looping press-floor clip that behaves itself.
 *
 * The rules it exists to keep:
 *
 *  · The POSTER is the LCP element, never the video. It is a real <Image>,
 *    optimised and served as AVIF, and the <video> sits over it at opacity 0
 *    until it is actually playing. So the largest paint is an image the browser can
 *    fetch from the markup on the first pass, and there is no frame where the
 *    hero is empty. The poster is frame 1 of the encoded file at the same
 *    dimensions (see scripts/fetch-media.mjs), so the handover is invisible.
 *
 *  · No `poster` attribute on the <video>. The <Image> underneath already
 *    paints it, and setting both made the browser fetch the poster twice —
 *    once optimised through next/image, once as the raw committed JPEG.
 *
 *  · preload="metadata", not "auto". Four autoplaying loops on one page at
 *    preload auto is several megabytes nobody asked for. Metadata is enough
 *    for the element to size itself; the frames arrive when it plays.
 *
 *  · An IntersectionObserver pauses anything off-screen. A paused <video> is
 *    a decoder and a compositor layer doing nothing, which on a laptop is the
 *    difference between a warm fan and a quiet one.
 *
 *  · Reduced motion means no video at all. Not paused-on-first-frame: the
 *    element is never mounted, and the poster stands alone. Someone who has
 *    asked the OS to stop moving pictures should not pay to download one.
 *
 *  · The whole thing is aria-hidden. Every clip here is texture behind copy
 *    that already says what the business does; announcing "magenta ink
 *    rolling across a chrome cylinder" to a screen reader in the middle of a
 *    headline is noise. The alt text lives in content/media.ts and is used
 *    where the still is genuinely the content.
 */
export function PressLoop({
  asset,
  poster,
  className,
  priority = false,
  sizes = "100vw",
}: PressLoopProps) {
  const video = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  // Null until the client has decided. Rendering the <video> during SSR would
  // ship the element to people who have reduced motion set.
  const [motionOk, setMotionOk] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotionOk(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el || !motionOk) return;

    // rootMargin starts the clip just before it scrolls in, so it is already
    // moving by the time it is looked at rather than starting under the eye.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          // Autoplay can still be refused (a data saver, a browser policy).
          // Swallowing it leaves the poster up, which is a fine outcome.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(el);

    // The tab going away is the same case as scrolling away.
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else if (el.getBoundingClientRect().top < window.innerHeight) void el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motionOk]);

  return (
    <div aria-hidden="true" className={cn("relative overflow-hidden", className)}>
      <Image
        src={poster ?? asset.localPoster}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {motionOk ? (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="metadata"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={asset.localWebm} type="video/webm" />
          <source src={asset.localMp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
