/* =====================================================
   CHIQUITO NI THEO IN MANILA: SCRIPT
   1. Menu  2. Toast  3. Cart and wishlist
   4. Search and filters  5. Reviews  6. Contact form
   ===================================================== */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  $("year").textContent = new Date().getFullYear();

  /* ---------- 1. MOBILE MENU ---------- */
  var menuBtn = $("menuBtn"), nav = $("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- 2. TOAST (small popup message) ---------- */
  var toastEl = $("toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2800);
  }

  /* ---------- 3. CART AND WISHLIST ---------- */
  var count = 0;
  document.querySelectorAll(".add").forEach(function (btn) {
    btn.addEventListener("click", function () {
      count++;
      $("cartCount").textContent = count;
      $("cartBtn").setAttribute("aria-label", "Cart, " + count + (count === 1 ? " item" : " items"));
      toast("Added to cart");
    });
  });
  $("cartBtn").addEventListener("click", function () {
    toast(count ? "You have " + count + (count === 1 ? " item" : " items") + " in your cart." : "Your cart is empty.");
  });
  document.querySelectorAll(".fav").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(on));
      toast(on ? "Saved to wishlist" : "Removed from wishlist");
    });
  });

  /* ---------- 4. SEARCH AND CATEGORY FILTERS ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll(".product"));
  var search = $("search"), cat = "";

  // Shows only the products that match the search text and the chosen category
  function applyFilters() {
    var q = search.value.trim().toLowerCase(), shown = 0;
    cards.forEach(function (c) {
      var ok = (!q || c.dataset.name.indexOf(q) > -1) && (!cat || c.dataset.cats.split(" ").indexOf(cat) > -1);
      c.hidden = !ok;
      if (ok) shown++;
    });
    $("noMatch").hidden = shown > 0;
    $("filterNote").hidden = !cat;
    if (cat) $("filterText").textContent = "Showing: " + cat.charAt(0).toUpperCase() + cat.slice(1) + ".";
  }
  search.addEventListener("input", function () {
    applyFilters();
    if (search.value.trim()) $("products").scrollIntoView({ behavior: "smooth" });
  });
  // Hero chips and category cards set the category, then jump to the products
  document.querySelectorAll("[data-cat]").forEach(function (el) {
    el.addEventListener("click", function () { cat = el.dataset.cat; applyFilters(); });
  });
  $("clearFilter").addEventListener("click", function () { cat = ""; search.value = ""; applyFilters(); });
  // The "Shop Now" and nav links to Products show everything again
  document.querySelectorAll('a[href="#products"]:not([data-cat])').forEach(function (a) {
    a.addEventListener("click", function () { cat = ""; search.value = ""; applyFilters(); });
  });

  /* ---------- 5. REVIEWS ---------- */
  var more = $("moreReviews"), moreBtn = $("moreBtn");
  moreBtn.addEventListener("click", function () {
    var open = more.hidden;
    more.hidden = !open;
    moreBtn.textContent = open ? "Show Less" : "View More";
    moreBtn.setAttribute("aria-expanded", String(open));
  });
  // "Write a Review" jumps to the form and starts the message for you
  $("writeReview").addEventListener("click", function () {
    var msg = $("fmsg");
    if (!msg.value) msg.value = "My review: ";
    setTimeout(function () { msg.focus(); }, 400);
  });

  /* ---------- 6. CONTACT FORM ----------
     It checks the fields, then shows a thank-you. To really send email,
     connect the form to a service such as Formspree or EmailJS. */
  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("fname").value.trim(), email = $("femail").value.trim(), msg = $("fmsg").value.trim();
    var err = $("formError");
    if (!name || !email || !msg) { err.textContent = "Please fill in your name, email and message."; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address."; return; }
    err.textContent = "";
    this.reset();
    toast("Thanks, " + name.split(" ")[0] + "! (This demo form doesn't send email yet.)");
  });
})();
