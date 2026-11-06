/* Seb Gower Art — shared interactions */
(() => {
  const WORKS = [
    {
      id: "imagine",
      title: "Imagine",
      place: "Studio",
      mood: "portrait",
      src: "assets/art/imagine-hero.jpg",
      thumb: "assets/art/imagine.webp",
      line: "Lennon, loud colour, and a prayer you can hang on a wall.",
    },
    {
      id: "silver-lake",
      title: "Silver Lake",
      place: "New Zealand",
      mood: "landscape",
      src: "assets/art/silver-lake.webp",
      thumb: "assets/art/silver-lake-hq.jpg",
      line: "A child, a lake, and the kind of dusk that refuses to hurry.",
    },
    {
      id: "worlds",
      title: "Worlds",
      place: "Travels",
      mood: "figure",
      src: "assets/art/worlds.jpg",
      thumb: "assets/art/worlds.jpg",
      line: "Bodies, colour, collision — the studio when the door stays open.",
    },
    {
      id: "gorge",
      title: "Gorge",
      place: "South Island",
      mood: "landscape",
      src: "assets/art/gorge.jpg",
      thumb: "assets/art/gorge.jpg",
      line: "Stone, water, and a magenta sky that shouldn't work — until it does.",
    },
    {
      id: "zambezi",
      title: "Zambezi River",
      place: "Africa",
      mood: "landscape",
      src: "assets/art/zambezi.webp",
      thumb: "assets/art/zambezi.webp",
      line: "River light with the volume turned all the way up.",
    },
    {
      id: "dahlias",
      title: "Dahlias",
      place: "Garden",
      mood: "still-life",
      src: "assets/art/dahlias.jpg",
      thumb: "assets/art/dahlias.jpg",
      line: "Petals as fireworks. Soft only if you squint.",
    },
    {
      id: "sampans",
      title: "Sampans in Shelter",
      place: "Asia",
      mood: "harbour",
      src: "assets/art/sampans.jpg",
      thumb: "assets/art/sampans.jpg",
      line: "Boats tucked in for the night. Paint still moving.",
    },
    {
      id: "valley",
      title: "The Valley I Call Home",
      place: "New Zealand",
      mood: "landscape",
      src: "assets/art/valley.jpg",
      thumb: "assets/art/valley.jpg",
      line: "Home, held long enough that it becomes paint.",
    },
  ];

  const QUOTES = [
    {
      text: "Imagine being a kid with full control over the fun.",
      src: "Seb, live on stream",
    },
    {
      text: "I love the wildness that paint brings. It's primal.",
      src: "Seb, live on stream",
    },
    {
      text: "It's about the energy and life behind the brush strokes.",
      src: "Seb, live on stream",
    },
    {
      text: "Ultramarine has very little chill. It's a real power whack.",
      src: "Seb, live",
    },
  ];

  window.SG = { WORKS, QUOTES };

  const favKey = "sg-favs";
  const readFavs = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(favKey) || "[]"));
    } catch {
      return new Set();
    }
  };
  const writeFavs = (set) => localStorage.setItem(favKey, JSON.stringify([...set]));

  /* Nav / drawer */
  const drawer = document.getElementById("drawer");
  const openBtn = document.querySelector("[data-open-menu]");
  const closeBtn = document.querySelector("[data-close-menu]");
  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  };
  openBtn?.addEventListener("click", () => setDrawer(true));
  closeBtn?.addEventListener("click", () => setDrawer(false));
  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) setDrawer(false);
  });

  /* Solid nav after hero */
  const nav = document.querySelector(".nav");
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.7);
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* Progress */
  const bar = document.querySelector(".progress");
  const onProgress = () => {
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${p}%`;
  };
  window.addEventListener("scroll", onProgress, { passive: true });
  onProgress();

  /* Panel in-view */
  const panels = document.querySelectorAll(".panel, .studio, .wall, .closeout");
  if (panels.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add("is-in");
        });
      },
      { threshold: 0.45 }
    );
    panels.forEach((p) => io.observe(p));
  } else {
    panels.forEach((p) => p.classList.add("is-in"));
  }

  /* Lightbox */
  const lb = document.getElementById("lb");
  const lbImg = lb?.querySelector("img");
  const lbTitle = lb?.querySelector("[data-lb-title]");
  const lbPlace = lb?.querySelector("[data-lb-place]");
  let lbIndex = 0;
  let lbList = WORKS;

  const openLb = (list, index) => {
    if (!lb || !lbImg) return;
    lbList = list;
    lbIndex = (index + list.length) % list.length;
    const w = lbList[lbIndex];
    lbImg.src = w.src;
    lbImg.alt = `${w.title}, oil painting by Seb Gower`;
    if (lbTitle) lbTitle.textContent = w.title;
    if (lbPlace) lbPlace.textContent = w.place;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const closeLb = () => {
    lb?.classList.remove("open");
    document.body.style.overflow = "";
  };
  const stepLb = (dir) => openLb(lbList, lbIndex + dir);

  lb?.querySelector("[data-lb-close]")?.addEventListener("click", closeLb);
  lb?.querySelector("[data-lb-prev]")?.addEventListener("click", () => stepLb(-1));
  lb?.querySelector("[data-lb-next]")?.addEventListener("click", () => stepLb(1));
  document.addEventListener("keydown", (e) => {
    if (!lb?.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") stepLb(1);
    if (e.key === "ArrowLeft") stepLb(-1);
  });

  window.SG.openLightbox = openLb;
  window.SG.closeLightbox = closeLb;
  window.SG.readFavs = readFavs;
  window.SG.writeFavs = writeFavs;
  window.SG.toggleFav = (id) => {
    const s = readFavs();
    if (s.has(id)) s.delete(id);
    else s.add(id);
    writeFavs(s);
    return s.has(id);
  };

  /* Home: studio quotes + clips */
  const stage = document.querySelector("[data-studio-stage]");
  if (stage) {
    const imgs = [...stage.querySelectorAll("img")];
    const quoteEl = document.querySelector("[data-quote]");
    const citeEl = document.querySelector("[data-cite]");
    const dots = document.querySelector("[data-dots]");
    let i = 0;
    const show = (n) => {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach((img, idx) => img.classList.toggle("on", idx === i));
      dots?.querySelectorAll("button").forEach((b, idx) => {
        b.setAttribute("aria-current", idx === i ? "true" : "false");
      });
      const q = QUOTES[i % QUOTES.length];
      if (quoteEl) quoteEl.textContent = `“${q.text}”`;
      if (citeEl) citeEl.textContent = q.src;
    };
    dots?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      show(+btn.dataset.i);
    });
    show(0);
    setInterval(() => show(i + 1), 4500);
  }

  /* Home: flick stack */
  const stack = document.querySelector("[data-stack]");
  if (stack) {
    const cards = WORKS.slice(0, 6).map((w, idx) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "stack-card";
      el.style.setProperty("--r", `${(idx - 2.5) * 4}deg`);
      el.style.zIndex = String(10 - idx);
      el.innerHTML = `<img src="${w.thumb}" alt=""><figcaption>${w.title}</figcaption>`;
      el.addEventListener("click", () => openLb(WORKS, WORKS.indexOf(w)));
      stack.appendChild(el);
      return { el, w, x: 0, y: 0 };
    });

    cards.forEach((card, idx) => {
      let dragging = false;
      let ox = 0;
      let oy = 0;
      const down = (e) => {
        dragging = true;
        card.el.style.zIndex = "40";
        const pt = e.touches ? e.touches[0] : e;
        ox = pt.clientX - card.x;
        oy = pt.clientY - card.y;
      };
      const move = (e) => {
        if (!dragging) return;
        const pt = e.touches ? e.touches[0] : e;
        card.x = pt.clientX - ox;
        card.y = pt.clientY - oy;
        card.el.style.transform = `translate(calc(-50% + ${card.x}px), calc(-50% + ${card.y}px)) rotate(${(idx - 2.5) * 4}deg)`;
      };
      const up = () => {
        dragging = false;
      };
      card.el.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
  }

  /* Gallery page */
  const masonry = document.querySelector("[data-masonry]");
  if (masonry) {
    const search = document.querySelector("[data-search]");
    const mood = document.querySelector("[data-mood]");
    const chips = document.querySelector("[data-chips]");
    const empty = document.querySelector("[data-empty]");
    let filterMood = "all";
    let filterPlace = "all";
    let q = "";

    const places = [...new Set(WORKS.map((w) => w.place))];
    places.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = p;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => {
        filterPlace = filterPlace === p ? "all" : p;
        chips.querySelectorAll(".chip").forEach((c) => {
          c.setAttribute("aria-pressed", c.textContent === filterPlace ? "true" : "false");
        });
        render();
      });
      chips?.appendChild(b);
    });

    const render = () => {
      const favs = readFavs();
      const list = WORKS.filter((w) => {
        const mq = !q || `${w.title} ${w.place} ${w.line}`.toLowerCase().includes(q);
        const mm = filterMood === "all" || w.mood === filterMood;
        const mp = filterPlace === "all" || w.place === filterPlace;
        return mq && mm && mp;
      });
      masonry.innerHTML = "";
      if (empty) empty.hidden = list.length > 0;
      list.forEach((w) => {
        const idx = WORKS.indexOf(w);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tile";
        btn.innerHTML = `
          <img src="${w.thumb}" alt="${w.title} by Seb Gower" loading="lazy">
          <div class="tile-meta">
            <div>
              <strong>${w.title}</strong>
              <span>${w.place} · ${w.mood}</span>
            </div>
            <span class="fav ${favs.has(w.id) ? "on" : ""}" data-fav="${w.id}" title="Save">♥</span>
          </div>`;
        btn.addEventListener("click", (e) => {
          if (e.target.closest("[data-fav]")) {
            e.stopPropagation();
            const on = window.SG.toggleFav(w.id);
            e.target.closest("[data-fav]").classList.toggle("on", on);
            return;
          }
          openLb(list, list.indexOf(w));
        });
        masonry.appendChild(btn);
      });
    };

    search?.addEventListener("input", () => {
      q = search.value.trim().toLowerCase();
      render();
    });
    mood?.addEventListener("change", () => {
      filterMood = mood.value;
      render();
    });
    render();
  }

  /* Commission form */
  const form = document.querySelector("[data-commission]");
  if (form) {
    const pick = form.querySelector("[data-pick]");
    const size = form.querySelector("#size");
    const estimate = form.querySelector("[data-estimate]");
    const success = form.querySelector("[data-success]");
    let selected = "imagine";

    const params = new URLSearchParams(location.search);
    if (params.get("work") && WORKS.some((w) => w.id === params.get("work"))) {
      selected = params.get("work");
    }

    WORKS.slice(0, 6).forEach((w) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pick";
      b.dataset.work = w.id;
      b.setAttribute("aria-pressed", w.id === selected ? "true" : "false");
      b.innerHTML = `<img src="${w.thumb}" alt="${w.title}">`;
      b.addEventListener("click", () => {
        selected = w.id;
        pick.querySelectorAll(".pick").forEach((el) => {
          el.setAttribute("aria-pressed", el.dataset.work === selected ? "true" : "false");
        });
        updateEstimate();
      });
      pick?.appendChild(b);
    });

    const weeksFor = (s) => {
      if (s === "small") return 3;
      if (s === "medium") return 5;
      return 8;
    };
    const updateEstimate = () => {
      const w = WORKS.find((x) => x.id === selected);
      const weeks = weeksFor(size.value);
      if (estimate) {
        estimate.innerHTML = `Inspired by <strong>${w?.title || "your pick"}</strong>. Rough studio window: <strong>${weeks}–${weeks + 2} weeks</strong> from deposit. Exact quote after we talk.`;
      }
    };
    size?.addEventListener("change", updateEstimate);
    updateEstimate();

    const setErr = (name, msg) => {
      const el = form.querySelector(`[data-err="${name}"]`);
      if (el) el.textContent = msg || "";
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      let ok = true;
      setErr("name");
      setErr("email");
      setErr("brief");
      if (!String(data.name || "").trim()) {
        setErr("name", "Name please.");
        ok = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || ""))) {
        setErr("email", "Need a real email.");
        ok = false;
      }
      if (String(data.brief || "").trim().length < 12) {
        setErr("brief", "Give the painting a little more story.");
        ok = false;
      }
      if (!ok) return;

      const work = WORKS.find((x) => x.id === selected);
      const subject = encodeURIComponent(`Commission enquiry — ${work?.title || "new work"}`);
      const body = encodeURIComponent(
        `Hi Seb,\n\nName: ${data.name}\nEmail: ${data.email}\nSize: ${data.size}\nInspired by: ${work?.title}\n\nBrief:\n${data.brief}\n\n— sent from the Seb Gower Art studio site`
      );
      success?.classList.add("show");
      window.location.href = `mailto:seb@sebgowerart.com?subject=${subject}&body=${body}`;
    });
  }
})();
