// ===== PARALLAX ON FLOATING CARDS =====
const cardChart = document.getElementById("cardChart");
const cardUsers = document.getElementById("cardUsers");

document.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  if (cardChart) {
    cardChart.style.transform = `translateY(calc(-50% + ${dy * 10}px)) translateX(${dx * -8}px)`;
  }
  if (cardUsers) {
    cardUsers.style.transform = `translateY(calc(-50% + ${dy * 8}px)) translateX(${dx * 8}px)`;
  }
});

// ===== ANIMATE CHART BARS ON LOAD =====
window.addEventListener("load", () => {
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar, i) => {
    const targetHeight = bar.style.height;
    bar.style.height = "0%";
    setTimeout(
      () => {
        bar.style.transition = "height 0.6s cubic-bezier(0.22,1,0.36,1)";
        bar.style.height = targetHeight;
      },
      1100 + i * 80,
    );
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const display = el.dataset.display || null;
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = target * ease;

    if (display) {
      // Show final display value when nearly done
      const displayVal = parseFloat(display) * ease;
      el.textContent = prefix + displayVal.toFixed(2) + suffix;
    } else {
      el.textContent = prefix + Math.round(value).toLocaleString() + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
    else {
      el.textContent = display
        ? prefix + display + suffix
        : prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Stat cards
        if (el.classList.contains("stat-card")) {
          el.classList.add("visible");
          const numEl = el.querySelector(".stat-card__number");
          if (numEl && !numEl.dataset.animated) {
            numEl.dataset.animated = "true";
            animateCounter(numEl);
          }
        }

        // Story section fade-in
        if (el.classList.contains("story")) {
          el.classList.add("story--visible");
        }

        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.2 },
);

document
  .querySelectorAll(".stat-card, .story")
  .forEach((el) => observer.observe(el));

// ===== WHY SECTION: PILL SCROLL REVEAL =====
const pillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll(".why__pill");
        pills.forEach((pill, i) => {
          setTimeout(() => pill.classList.add("visible"), i * 120);
        });
        pillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

const whyRight = document.querySelector(".why__right");
if (whyRight) pillObserver.observe(whyRight);

// ===== SERVICES CARDS SCROLL REVEAL =====
const svcObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        svcObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".svc-card").forEach((el) => svcObserver.observe(el));

// ===== APPROACH SECTION SCROLL REVEAL + ACCORDION =====
const approachObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        approachObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

const approachSection = document.querySelector(".approach");
if (approachSection) approachObserver.observe(approachSection);

// Accordion toggle
document.querySelectorAll(".approach__item").forEach((item) => {
  item.querySelector(".approach__item-header").addEventListener("click", () => {
    document
      .querySelectorAll(".approach__item")
      .forEach((i) => i.classList.remove("approach__item--active"));
    item.classList.add("approach__item--active");
  });
});

// ===== REALITY CARDS SCROLL REVEAL =====
const realityObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        realityObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reality-card")
  .forEach((el) => realityObserver.observe(el));

// ===== HOW WE HELP CARDS SCROLL REVEAL =====
const howweObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        howweObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".howwe-card")
  .forEach((el) => howweObserver.observe(el));

// ===== INTERACTIVE CALENDAR =====
(function () {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Available days pattern (Mon–Fri = available, weekends not)
  const availableWeekdays = [1, 2, 3, 4, 5]; // Mon=1 ... Sun=0

  let current = new Date(2025, 2, 1); // March 2025
  let selectedDay = null;

  const labelEl = document.getElementById("calMonthLabel");
  const daysEl = document.getElementById("calDays");
  const prevBtn = document.getElementById("calPrev");
  const nextBtn = document.getElementById("calNext");

  function renderCalendar() {
    if (!daysEl) return;
    daysEl.innerHTML = "";
    labelEl.textContent =
      months[current.getMonth()] + " " + current.getFullYear();

    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    // Convert Sunday=0 to Mon-first: Mon=0
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Empty cells
    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement("div");
      empty.className = "cal-day empty";
      daysEl.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const weekday = date.getDay(); // 0=Sun,1=Mon...
      const el = document.createElement("div");
      const isAvailable = availableWeekdays.includes(weekday);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected =
        selectedDay &&
        selectedDay.getDate() === d &&
        selectedDay.getMonth() === month &&
        selectedDay.getFullYear() === year;

      el.textContent = d;
      el.className =
        "cal-day" +
        (isAvailable ? " available" : " unavailable") +
        (isToday ? " today" : "") +
        (isSelected ? " selected" : "");

      if (isAvailable) {
        el.addEventListener("click", () => {
          selectedDay = new Date(year, month, d);
          renderCalendar();
        });
      }
      daysEl.appendChild(el);
    }
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      current.setMonth(current.getMonth() - 1);
      renderCalendar();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      current.setMonth(current.getMonth() + 1);
      renderCalendar();
    });

  renderCalendar();
})();
