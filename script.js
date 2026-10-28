const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for browsers/contexts without the Clipboard API
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }
}

const emailBtn = document.getElementById("copy-email");

emailBtn.addEventListener("click", async (event) => {
  event.preventDefault(); // copy instead of opening the mail app
  const email = emailBtn.dataset.email;
  const ok = await copyText(email);
  showToast(ok ? "Email copied!" : email);
});

/* ---------- Filtro de projetos ---------- */
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project");
const emptyMessage = document.getElementById("empty");

function applyFilter(filter) {
  let visible = 0;

  projectCards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const show = filter === "todos" || categories.includes(filter);
    card.hidden = !show;
    if (show) visible++;
  });

  filterButtons.forEach((btn) => {
    const active = btn.dataset.filter === filter;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  emptyMessage.hidden = visible > 0;
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});
