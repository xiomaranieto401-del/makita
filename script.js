const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function createCarousel(root, slideSelector, intervalTime = 4200) {
  const slides = [...root.querySelectorAll(slideSelector)];
  const dotsHost = root.querySelector(".carousel-dots");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  let index = 0;
  let timer;

  const dots = dotsHost
    ? slides.map((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir al slide ${dotIndex + 1}`);
        dot.addEventListener("click", () => show(dotIndex, true));
        dotsHost.appendChild(dot);
        return dot;
      })
    : [];

  function show(nextIndex, userAction = false) {
    slides[index].classList.remove("active");
    dots[index]?.classList.remove("active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add("active");
    dots[index]?.classList.add("active");

    if (userAction) {
      restart();
    }
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), intervalTime);
  }

  prev?.addEventListener("click", () => show(index - 1, true));
  next?.addEventListener("click", () => show(index + 1, true));
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);

  show(0);
  restart();
}

document.querySelectorAll("[data-carousel='usage']").forEach((carousel) => {
  createCarousel(carousel, ".usage-slide", 4700);
});

document.querySelectorAll("[data-carousel='testimonials']").forEach((carousel) => {
  createCarousel(carousel, ".testimonial-card", 5000);
});

document.querySelectorAll("video[data-stop-at]").forEach((video) => {
  const stopAt = Number(video.dataset.stopAt);

  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= stopAt) {
      video.pause();
      video.currentTime = stopAt;
    }
  });

  video.addEventListener("play", () => {
    if (video.currentTime >= stopAt) {
      video.currentTime = 0;
    }
  });
});

const galleryMain = document.querySelector(".gallery-main");
const thumbs = document.querySelectorAll(".thumb");

thumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const nextSrc = thumb.dataset.src;
    if (!galleryMain || galleryMain.src === nextSrc) return;

    thumbs.forEach((item) => item.classList.remove("active"));
    thumb.classList.add("active");
    galleryMain.style.opacity = "0";

    setTimeout(() => {
      galleryMain.src = nextSrc;
      galleryMain.alt = thumb.dataset.alt || galleryMain.alt;
      galleryMain.style.opacity = "1";
    }, 180);
  });
});

const colorShell = document.getElementById("colorShell");
const colorProduct = document.getElementById("colorProduct");
const selectedColor = document.getElementById("selectedColor");
const swatches = document.querySelectorAll(".color-swatch");

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    const color = swatch.dataset.color;
    const tint = swatch.dataset.tint;
    const image = swatch.dataset.src;

    swatches.forEach((item) => item.classList.remove("active"));
    swatch.classList.add("active");

    colorProduct.style.opacity = "0";
    colorProduct.style.transform = "scale(0.985)";

    setTimeout(() => {
      colorShell.style.setProperty("--product-tint", tint);
      colorProduct.src = image;
      colorProduct.alt = `Makita DCM501 color ${color}`;
      selectedColor.textContent = color;
      colorProduct.style.opacity = "1";
      colorProduct.style.transform = "scale(1)";
    }, 180);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
