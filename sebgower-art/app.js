/* Seb Gower Art — studio interactions */
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

  const CLIPS = [
    { src: "assets/clips/0.mp4", poster: "assets/clips/0.jpg", label: "Seb painting live, moment 1" },
    { src: "assets/clips/1.mp4", poster: "assets/clips/1.jpg", label: "Seb painting live, moment 2" },
    { src: "assets/clips/2.mp4", poster: "assets/clips/2.jpg", label: "Seb painting live, moment 3" },
    { src: "assets/clips/3.mp4", poster: "assets/clips/3.jpg", label: "Seb painting live, moment 4" },
  ];

  const SPLAT =
    '<svg class="splat" viewBox="0 0 200 80" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14 22c8-14 30-9 44-14 16-6 30 2 46-2 18-4 34-6 50 0 14 5 34 2 40 16 5 12-4 18-2 28 3 12 4 22-10 26-14 4-28-2-44 2-18 4-36 2-54 0-16-2-34 6-48-2C20 72 6 64 8 52 9 42 2 38 14 22z"/><circle cx="192" cy="10" r="5" fill="currentColor"/><circle cx="6" cy="72" r="4" fill="currentColor"/><circle cx="182" cy="74" r="3" fill="currentColor"/></svg>';

  window.SG = {
    WORKS,
    setRoom(room, btn) {
      const shell = document.querySelector("[data-gallery-shell]");
      if (!shell || !room) return;
      shell.setAttribute("data-room", room);
      document.querySelectorAll("[data-room-mode]").forEach((b) => {
        b.setAttribute("aria-pressed", b === btn || b.getAttribute("data-room-mode") === room ? "true" : "false");
      });
    },
  };

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
  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  };
  document.querySelector("[data-open-menu]")?.addEventListener("click", () => setDrawer(true));
  document.querySelector("[data-close-menu]")?.addEventListener("click", () => setDrawer(false));
  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) setDrawer(false);
  });

  const nav = document.querySelector(".nav");
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.55);
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  const bar = document.querySelector(".progress");
  const onProgress = () => {
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", onProgress, { passive: true });
  onProgress();

  /* In-view rooms */
  const rooms = document.querySelectorAll(".room, .reel, .wall, .feed, .smash, .closeout, .anywhere");
  if (rooms.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("is-in")),
      { threshold: 0.35 }
    );
    rooms.forEach((p) => io.observe(p));
  } else {
    rooms.forEach((p) => p.classList.add("is-in"));
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
  window.SG.toggleFav = (id) => {
    const s = readFavs();
    if (s.has(id)) s.delete(id);
    else s.add(id);
    writeFavs(s);
    return s.has(id);
  };

  document.querySelectorAll("[data-open-work]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open-work");
      const idx = WORKS.findIndex((w) => w.id === id);
      if (idx >= 0) openLb(WORKS, idx);
    });
  });

  /* Hero reel */
  const reel = document.querySelector("[data-reel]");
  if (reel) {
    const video = reel.querySelector(".reel-video");
    const poster = reel.querySelector(".reel-poster");
    const dots = reel.querySelector("[data-reel-dots]");
    const playBtn = reel.querySelector("[data-reel-play]");
    const muteBtn = reel.querySelector("[data-reel-mute]");
    let i = 0;
    let playing = false;

    CLIPS.forEach((c, idx) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = SPLAT;
      b.setAttribute("aria-label", c.label);
      if (idx === 0) b.setAttribute("aria-current", "true");
      b.addEventListener("click", () => show(idx, playing));
      li.appendChild(b);
      dots?.appendChild(li);
    });

    const show = (n, autoplay) => {
      i = (n + CLIPS.length) % CLIPS.length;
      const c = CLIPS[i];
      reel.style.setProperty("--poster", `url(${c.poster})`);
      if (poster) poster.src = c.poster;
      if (video) {
        video.poster = c.poster;
        video.src = c.src;
        video.load();
        if (autoplay) video.play().catch(() => {});
      }
      dots?.querySelectorAll("button").forEach((b, idx) => {
        b.setAttribute("aria-current", idx === i ? "true" : "false");
      });
    };

    playBtn?.addEventListener("click", async () => {
      if (!video) return;
      if (video.paused) {
        try {
          await video.play();
          playing = true;
          playBtn.textContent = "Pause";
          playBtn.setAttribute("aria-pressed", "true");
        } catch {
          /* autoplay blocked */
        }
      } else {
        video.pause();
        playing = false;
        playBtn.textContent = "Play";
        playBtn.setAttribute("aria-pressed", "false");
      }
    });

    muteBtn?.addEventListener("click", () => {
      if (!video) return;
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "Unmute" : "Mute";
      muteBtn.setAttribute("aria-pressed", video.muted ? "true" : "false");
    });

    video?.addEventListener("ended", () => show(i + 1, true));
    show(0, false);
  }

  /* Stroke-by-stroke Imagine */
  const build = document.querySelector("[data-build]");
  if (build) {
    const group = build.querySelector("[data-stroke-group]");
    const countEl = build.querySelector("[data-build-count]");
    fetch("assets/strokes.json")
      .then((r) => r.json())
      .then((strokes) => {
        strokes.forEach((s) => {
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("d", s.d);
          p.setAttribute("stroke", "#fff");
          p.setAttribute("stroke-width", String(s.w));
          p.setAttribute("stroke-linecap", "round");
          p.setAttribute("fill", "none");
          p.setAttribute("transform", s.t);
          p.style.opacity = "0";
          p.style.transition = "opacity .28s linear";
          group?.appendChild(p);
        });
        const paths = [...(group?.querySelectorAll("path") || [])];
        const onScroll = () => {
          const rect = build.getBoundingClientRect();
          const total = build.offsetHeight - window.innerHeight;
          const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
          const t = scrolled / Math.max(total, 1);
          const n = Math.round(t * paths.length);
          paths.forEach((p, idx) => {
            p.style.opacity = idx < n ? "1" : "0";
          });
          if (countEl) countEl.textContent = `${n} / ${paths.length} strokes`;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      })
      .catch(() => {
        if (countEl) countEl.textContent = "Stroke data unavailable";
      });
  }

  /* Feed cards — play when visible */
  document.querySelectorAll("[data-feed] video").forEach((v) => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(v);
  });

  /* Stack */
  const stack = document.querySelector("[data-stack]");
  if (stack) {
    WORKS.slice(0, 6).forEach((w, idx) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "stack-card";
      el.style.setProperty("--r", `${(idx - 2.5) * 4}deg`);
      el.style.zIndex = String(10 - idx);
      el.innerHTML = `<img src="${w.thumb}" alt=""><figcaption>${w.title}</figcaption>`;
      let x = 0;
      let y = 0;
      let dragging = false;
      let ox = 0;
      let oy = 0;
      let moved = false;
      el.addEventListener("pointerdown", (e) => {
        dragging = true;
        moved = false;
        el.style.zIndex = "40";
        el.setPointerCapture?.(e.pointerId);
        ox = e.clientX - x;
        oy = e.clientY - y;
      });
      el.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        moved = true;
        x = e.clientX - ox;
        y = e.clientY - oy;
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${(idx - 2.5) * 4}deg)`;
      });
      el.addEventListener("pointerup", () => {
        dragging = false;
        if (!moved) openLb(WORKS, WORKS.indexOf(w));
      });
      stack.appendChild(el);
    });
  }

  /* Smash puzzle */
  const puzzle = document.querySelector("[data-puzzle]");
  if (puzzle) {
    const status = document.querySelector("[data-puzzle-status]");
    const size = 4;
    let order = [];
    let start = 0;

    /* Click-to-swap puzzle: select one tile, swap with next click */
    let selected = null;
    const bind = () => {
      puzzle.querySelectorAll("button").forEach((b) => {
        b.addEventListener("click", () => {
          if (selected === null) {
            selected = +b.dataset.slot;
            b.style.outline = "2px solid #d4005a";
            return;
          }
          const a = selected;
          const c = +b.dataset.slot;
          selected = null;
          [order[a], order[c]] = [order[c], order[a]];
          paint();
          check();
        });
      });
    };

    const paint = () => {
      puzzle.innerHTML = "";
      order.forEach((pos, i) => {
        const r = Math.floor(pos / size);
        const c = pos % size;
        const b = document.createElement("button");
        b.type = "button";
        b.style.backgroundPosition = `${(c / (size - 1)) * 100}% ${(r / (size - 1)) * 100}%`;
        b.dataset.slot = String(i);
        if (pos === i) b.classList.add("correct");
        puzzle.appendChild(b);
      });
      bind();
    };

    const check = () => {
      const done = order.every((v, i) => v === i);
      const secs = ((Date.now() - start) / 1000).toFixed(1);
      if (status) {
        status.textContent = done ? `Rebuilt in ${secs}s. Brag away.` : `${order.filter((v, i) => v === i).length}/16 locked`;
      }
      if (done) puzzle.querySelectorAll("button").forEach((b) => b.classList.add("correct"));
    };

    const shuffle = () => {
      order = [...Array(size * size).keys()];
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      selected = null;
      start = Date.now();
      paint();
      if (status) status.textContent = "16 tiles · go";
    };

    document.querySelector("[data-puzzle-shuffle]")?.addEventListener("click", shuffle);
    shuffle();
  }

  /* Gallery room atmospheres — bind even before masonry renders */
  const shell = document.querySelector("[data-gallery-shell]");
  document.querySelectorAll("[data-room-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const room = btn.getAttribute("data-room-mode");
      if (!room || !shell) return;
      shell.setAttribute("data-room", room);
      document.querySelectorAll("[data-room-mode]").forEach((b) => {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
    });
  });

  /* Gallery */
  const masonry = document.querySelector("[data-masonry]");
  if (masonry) {
    const search = document.querySelector("[data-search]");
    const mood = document.querySelector("[data-mood]");
    const chips = document.querySelector("[data-chips]");
    const empty = document.querySelector("[data-empty]");
    let filterMood = "all";
    let filterPlace = "all";
    let q = "";

    [...new Set(WORKS.map((w) => w.place))].forEach((p) => {
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

  /* Commission */
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

    const weeksFor = (s) => (s === "small" ? 3 : s === "medium" ? 5 : 8);
    const updateEstimate = () => {
      const w = WORKS.find((x) => x.id === selected);
      const weeks = weeksFor(size.value);
      if (estimate) {
        estimate.innerHTML = `Closest vibe: <strong>${w?.title || "your pick"}</strong>. Rough studio window: <strong>${weeks}–${weeks + 2} weeks</strong> from deposit. Exact quote after we talk.`;
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
