const revealItems = document.querySelectorAll(".reveal");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = siteHeader.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

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
  createCarousel(carousel, ".testimonial-card", 4300);
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
const colorDescription = document.getElementById("colorDescription");
const swatches = document.querySelectorAll(".color-swatch");
const advantagePanel = document.getElementById("advantagePanel");
const advantageNumber = document.getElementById("advantageNumber");
const advantageText = document.getElementById("advantageText");
const advantageTabs = document.querySelectorAll(".advantage-tab");

const colorDescriptions = {
  "Azul Makita": "El acabado clásico Makita: técnico, reconocible y alineado con el sistema LXT® de herramientas profesionales.",
  "Verde militar": "Un tono sobrio y resistente, pensado para exteriores, camping y equipos que priorizan presencia discreta y robustez."
};

const advantages = {
  battery: {
    number: "01",
    progress: "25%",
    text: "La energía que ya usás para trabajar también puede preparar tu café."
  },
  cordless: {
    number: "02",
    progress: "50%",
    text: "No dependés de cocina, alargues ni tomas disponibles para hacer una pausa."
  },
  compact: {
    number: "03",
    progress: "75%",
    text: "La pausa se mueve con vos: obra, camioneta, taller o exterior."
  },
  jobsite: {
    number: "04",
    progress: "100%",
    text: "Aprovechás el ecosistema Makita en vez de sumar otro aparato aislado."
  }
};

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
      colorDescription.textContent = colorDescriptions[color] || "";
      colorProduct.style.opacity = "1";
      colorProduct.style.transform = "scale(1)";
    }, 180);
  });
});

advantageTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.advantage;
    const data = advantages[key];
    if (!data) return;

    advantageTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    advantagePanel.style.opacity = "0";
    advantagePanel.style.transform = "translateY(8px)";

    setTimeout(() => {
      advantageNumber.textContent = data.number;
      advantageText.textContent = data.text;
      advantagePanel.style.setProperty("--advantage-progress", data.progress);
      advantagePanel.style.opacity = "1";
      advantagePanel.style.transform = "translateY(0)";
    }, 160);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    siteHeader?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
