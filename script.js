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

const specTitle = document.getElementById("specTitle");
const specDescription = document.getElementById("specDescription");
const specHotspots = document.querySelectorAll(".spec-hotspot");
const specTabs = document.querySelectorAll(".spec-tab");

const specs = {
  battery: {
    title: "Batería LXT® 18V",
    description: "Compatible con baterías Makita LXT® de 18V para trabajar sin enchufe y usar la misma energía del resto de tus herramientas."
  },
  tank: {
    title: "Depósito integrado",
    description: "Sistema compacto para cargar agua y preparar café caliente sin depender de una cocina cercana."
  },
  cup: {
    title: "Taza de 240 ml",
    description: "Capacidad práctica para una pausa real en obra, taller, camioneta o exterior."
  },
  body: {
    title: "Cuerpo robusto",
    description: "Construcción compacta y resistente, pensada para traslados diarios y entornos de trabajo exigentes."
  },
  handle: {
    title: "Manija superior",
    description: "Formato portátil para moverla como una herramienta más dentro del equipo Makita."
  }
};

function showSpec(key) {
  const data = specs[key];
  if (!data || !specTitle || !specDescription) return;

  specHotspots.forEach((item) => item.classList.toggle("active", item.dataset.spec === key));
  specTabs.forEach((item) => item.classList.toggle("active", item.dataset.spec === key));

  specTitle.style.opacity = "0";
  specDescription.style.opacity = "0";
  specTitle.style.transform = "translateY(6px)";
  specDescription.style.transform = "translateY(6px)";

  setTimeout(() => {
    specTitle.textContent = data.title;
    specDescription.textContent = data.description;
    specTitle.style.opacity = "1";
    specDescription.style.opacity = "1";
    specTitle.style.transform = "translateY(0)";
    specDescription.style.transform = "translateY(0)";
  }, 140);
}

specHotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", () => showSpec(hotspot.dataset.spec));
});

specTabs.forEach((tab) => {
  tab.addEventListener("click", () => showSpec(tab.dataset.spec));
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
    text: "Usá la misma batería LXT® 18V que ya alimenta tus herramientas Makita."
  },
  cordless: {
    number: "02",
    progress: "50%",
    text: "Se integra al sistema que ya llevás a obra, taller o camioneta."
  },
  compact: {
    number: "03",
    progress: "75%",
    text: "Menos cargadores, menos accesorios y menos equipos aislados."
  },
  jobsite: {
    number: "04",
    progress: "100%",
    text: "La DCM501 entra en la misma lógica de trabajo que el resto de tus herramientas."
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
    colorProduct.style.transform = color === "Azul Makita" ? "scale(1.03)" : "scale(0.985)";

    setTimeout(() => {
      colorShell.style.setProperty("--product-tint", tint);
      colorShell.dataset.color = color;
      colorProduct.src = image;
      colorProduct.alt = `Makita DCM501 color ${color}`;
      colorProduct.dataset.color = color;
      selectedColor.textContent = color;
      colorDescription.textContent = colorDescriptions[color] || "";
      colorProduct.style.opacity = "1";
      colorProduct.style.transform = "";
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
    const href = link.getAttribute("href");
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    siteHeader?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
