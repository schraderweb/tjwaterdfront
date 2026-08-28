(() => {
  const stages = document.querySelectorAll("[data-video-lazy]");
  if (!stages.length) return;

  const canLazy = "IntersectionObserver" in window;

  const loadVideo = (stage) => {
    const video = stage.querySelector("video");
    if (!video || video.dataset.loaded) return;
    video.dataset.loaded = "1";
    video.preload = "auto";
    if (typeof video.load === "function") video.load();
  };

  stages.forEach((stage) => {
    const video = stage.querySelector("video");
    const playBtn = stage.querySelector("[data-video-play]");
    if (!video) return;

    const showBtn = () => playBtn && playBtn.classList.remove("is-hidden");
    const hideBtn = () => playBtn && playBtn.classList.add("is-hidden");

    video.addEventListener("playing", hideBtn);
    video.addEventListener("pause", showBtn);
    video.addEventListener("ended", showBtn);
    if (video.readyState > 0) hideBtn();

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }

    if (canLazy) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadVideo(stage);
              observer.unobserve(stage);
            }
          });
        },
        { rootMargin: "300px 0px" }
      );
      observer.observe(stage);
    } else {
      loadVideo(stage);
    }
  });
})();