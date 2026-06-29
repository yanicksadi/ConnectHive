// Extracted interactivity scripts from index.html
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector(".form-submit");
  btn.textContent = "Sent! We'll be in touch soon ✓";
  btn.style.background = "var(--teal)";
  btn.style.color = "#ffffff";
  btn.disabled = true;
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("open");
  });
});
