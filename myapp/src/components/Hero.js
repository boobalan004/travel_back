import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const primaryVideoId = "QGmZ1rsKJ9c";
  const fallbackVideoId = "QGmZ1rsKJ9c";
  const finalFallbackId = "QGmZ1rsKJ9c";

  const buildEmbedUrl = (id) => `https://www.youtube.com/embed/${id}`;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isVideoOpen) setIsVideoOpen(false);
    };

    if (isVideoOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

  const openVideo = async () => {
    const checkVideoExists = async (id, timeout = 3000) => {
      const controller = new AbortController();
      const to = setTimeout(() => controller.abort(), timeout);
      try {
        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(to);
        return res.ok;
      } catch {
        return false;
      }
    };

    let chosen = "";

    if (await checkVideoExists(primaryVideoId)) {
      chosen = primaryVideoId;
    } else if (await checkVideoExists(fallbackVideoId)) {
      chosen = fallbackVideoId;
    } else {
      chosen = finalFallbackId;
    }

    setVideoId(chosen);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setVideoId("");
    setIsVideoOpen(false);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6 md:space-y-8">
            <p className="text-blue-600 font-bold tracking-widest uppercase text-xs md:text-sm">
              Best Destinations Around the World
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              Travel,
              <span className="italic text-yellow-500"> enjoy</span>
              {' '}and
              <br />
              live a
              <span className="italic text-yellow-500"> new</span>
              {' '}and full
              <span className="italic text-yellow-500"> life</span>
            </h1>

            <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed max-w-md">
              Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 md:px-10 py-3 md:py-4 bg-white text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow">
                Find out more
              </button>

              <button
                onClick={openVideo}
                className="px-8 md:px-10 py-3 md:py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                ▶ Watch Demo
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-96 md:h-[500px] lg:h-[600px]">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-full">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1000&q=85"
                alt="Travel essentials - map, camera, backpack"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeVideo()}
        >
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
            <button
              onClick={closeVideo}
              className="absolute top-2 right-2 text-white bg-black/70 px-3 py-1 rounded-full z-50"
            >
              ✕
            </button>

            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`${buildEmbedUrl(videoId)}?autoplay=1&mute=1&rel=0`}
                title="Demo Video"
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
