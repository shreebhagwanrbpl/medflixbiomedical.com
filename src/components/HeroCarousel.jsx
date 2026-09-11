"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Film,
} from "lucide-react";

export default function HeroCarousel({
  homeData = null,
  loading = false,
  locationTitle = "",
  makeLink = (path) => path,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const videoRefs = useRef({});

  // Parse media items from Firestore home data
  const parseMediaList = (data) => {
    if (!data) return [];
    const list = [];

    // 1. Check media array (preferred - contains ordered mixed images & videos from admin)
    if (Array.isArray(data.media) && data.media.length > 0) {
      data.media.forEach((item, idx) => {
        const url = typeof item === "string" ? item : item?.url;
        const type =
          item?.type ||
          (url?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? "video" : "image");
        if (url) {
          list.push({
            id: item?.id || `media-${idx}`,
            type,
            url,
          });
        }
      });
      if (list.length > 0) return list;
    }

    // 2. Check images array
    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((url, idx) => {
        if (url) {
          list.push({
            id: `img-${idx}`,
            type: "image",
            url,
          });
        }
      });
    } else if (data.imageUrl || data.image) {
      const singleImg = data.imageUrl || data.image;
      if (singleImg) {
        list.push({
          id: "single-img",
          type: "image",
          url: singleImg,
        });
      }
    }

    // 3. Check videos array
    if (Array.isArray(data.videos) && data.videos.length > 0) {
      data.videos.forEach((vUrl, idx) => {
        if (vUrl && !list.some((item) => item.url === vUrl)) {
          list.push({
            id: `vid-${idx}`,
            type: "video",
            url: vUrl,
          });
        }
      });
    } else if (data.videoUrl && !list.some((item) => item.url === data.videoUrl)) {
      list.push({
        id: "single-vid",
        type: "video",
        url: data.videoUrl,
      });
    }

    return list;
  };

  const slides = parseMediaList(homeData);

  // Auto-slide effect - All hooks placed at the top level unconditionally
  useEffect(() => {
    if (loading || homeData === null || !isPlaying || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [loading, homeData, isPlaying, slides.length, currentSlide]);

  // Adjust active slide index safely if slides array length changes
  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(slides.length - 1);
    }
  }, [slides.length, currentSlide]);

  // Play video on current slide
  useEffect(() => {
    if (loading || homeData === null) return;
    const currentMedia = slides[currentSlide];
    if (currentMedia?.type === "video") {
      const vid = videoRefs.current[currentSlide];
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }
  }, [loading, homeData, currentSlide, slides]);

  const handlePrev = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const handleNext = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  // Touch swipe support for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Loading Skeleton State to completely prevent static text / image flicker
  if (loading || homeData === null) {
    return (
      <section className="relative overflow-hidden bg-[#072f2c] text-white">
        <div className="relative w-full h-[380px] sm:h-[440px] md:h-[490px] lg:h-[530px] overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-[#072f2c] animate-pulse opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent lg:w-3/5" />
          <div className="container-custom relative z-20 h-full flex flex-col justify-center py-6 sm:py-8">
            <div className="max-w-2xl lg:max-w-3xl space-y-4">
              <div className="h-6 w-48 rounded-full bg-white/10 animate-pulse" />
              <div className="space-y-2 pt-1">
                <div className="h-9 sm:h-12 w-4/5 rounded-xl bg-white/10 animate-pulse" />
                <div className="h-9 sm:h-12 w-3/5 rounded-xl bg-white/10 animate-pulse" />
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="h-4 w-full max-w-xl rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-4/5 max-w-lg rounded bg-white/10 animate-pulse" />
              </div>
              <div className="flex gap-3 pt-3">
                <div className="h-11 w-36 sm:w-44 rounded-xl bg-[#0b6e69]/40 animate-pulse" />
                <div className="h-11 w-32 sm:w-40 rounded-xl bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Purely dynamic texts from Firestore
  const heroTitle =
    homeData?.title?.trim() ||
    (locationTitle ? `Precision Medical Equipment & Diagnostic Solutions in ${locationTitle}` : "");

  const heroDescription = homeData?.description?.trim() || "";
  const btn1Text = homeData?.button1Text?.trim() || "";
  const btn2Text = homeData?.button2Text?.trim() || "";

  // Static button routes
  const btn1Href = makeLink("/items");
  const btn2Href = makeLink("/contact");

  const activeMedia = slides[currentSlide] || slides[0];

  return (
    <section className="relative overflow-hidden bg-[#072f2c] text-white">
      {/* Background Media Viewport with Full Brightness & High Media Visibility */}
      <div
        className="relative w-full h-[380px] sm:h-[440px] md:h-[490px] lg:h-[530px] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {slides.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {activeMedia?.type === "video" ? (
                <video
                  ref={(el) => (videoRefs.current[currentSlide] = el)}
                  src={activeMedia.url}
                  className="w-full h-full object-cover object-center"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              ) : (
                <img
                  src={activeMedia?.url}
                  alt={`Hero Slide ${currentSlide + 1}`}
                  className="w-full h-full object-cover object-center brightness-[0.95] contrast-[1.05]"
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#072f2c] via-[#0b4d48] to-[#041e1c]" />
        )}

        {/* Soft, Non-intrusive Gradient only on text side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Foreground Content Container */}
        <div className="container-custom relative z-20 h-full flex flex-col justify-center py-6 sm:py-8">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-black/50 px-3.5 py-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#e6f4f2] shadow-lg backdrop-blur-md"
            >
              <Sparkles size={14} className="text-[#14b8a6] animate-pulse" />
              <span>
                {locationTitle
                  ? `Leading Biomedical Supplier in ${locationTitle}`
                  : "Pioneering Biomedical & Diagnostic Innovations"}
              </span>
            </motion.div>

            {/* Main Heading (Only Dynamic) */}
            {heroTitle && (
              <motion.h1
                key={`title-${currentSlide}-${heroTitle}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-3 sm:mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl leading-[1.14] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              >
                {heroTitle}
              </motion.h1>
            )}

            {/* Description (Only Dynamic) */}
            {heroDescription && (
              <motion.p
                key={`desc-${currentSlide}-${heroDescription}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-[#e6f4f2] max-w-2xl font-medium line-clamp-3 md:line-clamp-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              >
                {heroDescription}
              </motion.p>
            )}

            {/* Action Buttons (Only Dynamic Text with Static Links) */}
            {(btn1Text || btn2Text) && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3"
              >
                {btn1Text && (
                  <Link
                    href={btn1Href}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0b6e69] !text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-xl shadow-[#0b6e69]/40 transition-all duration-300 hover:bg-[#074e49] hover:shadow-2xl hover:-translate-y-0.5 border border-teal-400/30"
                  >
                    <span className="!text-white font-bold">{btn1Text}</span>
                    <ArrowRight size={16} className="!text-white" />
                  </Link>
                )}

                {btn2Text && (
                  <Link
                    href={btn2Href}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/50 bg-black/60 !text-white px-6 py-3 text-xs sm:text-sm font-bold backdrop-blur-md shadow-md transition-all duration-300 hover:bg-white hover:!text-[#0b6e69] hover:border-white hover:-translate-y-0.5"
                  >
                    <PhoneCall size={16} className="text-[#14b8a6]" />
                    <span className="font-bold">{btn2Text}</span>
                  </Link>
                )}
              </motion.div>
            )}

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-5 hidden sm:flex flex-wrap items-center gap-5 border-t border-white/20 pt-4 text-xs font-semibold text-[#e6f4f2] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#14b8a6] shrink-0" />
                <span>ISO 13485 Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#14b8a6] shrink-0" />
                <span>24/7 SLA Field Support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#14b8a6] shrink-0" />
                <span>NABL Traceable QC</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Carousel Floating Controls Bar */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-3">
            {/* Auto-play toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/30 hover:bg-black/85 transition-all shadow-md"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              title="Previous Slide"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-black/60 text-white backdrop-blur-md border border-white/30 hover:bg-[#0b6e69] hover:border-[#0b6e69] transition-all shadow-md"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Counter Badge */}
            <div className="flex items-center gap-1.5 rounded-xl bg-black/70 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-[#e6f4f2] backdrop-blur-md border border-white/30 shadow-md">
              {activeMedia?.type === "video" ? (
                <Film size={12} className="text-[#14b8a6]" />
              ) : (
                <ImageIcon size={12} className="text-[#14b8a6]" />
              )}
              <span>
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              title="Next Slide"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-black/60 text-white backdrop-blur-md border border-white/30 hover:bg-[#0b6e69] hover:border-[#0b6e69] transition-all shadow-md"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Bottom Pagination Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2 sm:h-2.5 ${
                  currentSlide === idx
                    ? "w-6 sm:w-8 bg-[#14b8a6] shadow-md shadow-[#14b8a6]/60"
                    : "w-2 sm:w-2.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
