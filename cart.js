// טען עגלה מ-localStorage אם קיימת
const cart = JSON.parse(localStorage.getItem("cart") || "{}");

// פתיחה/סגירה של הסל
function toggleCart() {
  document.getElementById("sideCart").classList.toggle("open");
}

// עדכון פריט בסל
function updateCart(item, price, delta, image = null) {
  if (!cart[item]) cart[item] = { count: 0, price, image };
  cart[item].count = Math.max(0, cart[item].count + delta);

  // שמירה של התמונה (אם נמסרה)
  if (image) cart[item].image = image;

  // שמור בעגלה
  localStorage.setItem("cart", JSON.stringify(cart));

  // עדכון כמות בדף התפריט (אם קיים אלמנט כזה)
  const countSpan = document.getElementById("count-" + item);
  if (countSpan) countSpan.innerText = cart[item].count;

  // רענן את הסל הצדדי
  renderCart();
}

// הצגת תוכן הסל
function renderCart() {
  const ul = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total");
  const link = document.getElementById("whatsappLink");
  const badge = document.getElementById("cart-count-badge");

  ul.innerHTML = "";
  let total = 0;
  let itemCount = 0;
  let message = "שלום! אני מעוניין להזמין:\n";

  for (let item in cart) {
    const product = cart[item];
    if (product.count > 0) {
      itemCount += product.count;
      const li = document.createElement("li");
      li.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${product.image}" alt="${item}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;">
          <div style="flex-grow: 1;">
            <strong>${item}</strong><br>
            <span style="font-size: 14px; color: #777;">${product.count} יחידות</span>
            <div class="quantity-controls">
              <span style="margin-left: 8px;">הוספה לסל:</span>
              <button onclick="updateCart('${item}', ${product.price}, -1, '${product.image}')">➖</button>
              <span>${product.count}</span>
              <button onclick="updateCart('${item}', ${product.price}, 1, '${product.image}')">➕</button>
            </div>
            <div style="margin-top: 4px; font-size: 14px; color: #555;">
              סה"כ: ${product.count * product.price} ₪
            </div>
          </div>
        </div>
      `;
      ul.appendChild(li);
      total += product.count * product.price;
      message += `- ${item} x ${product.count}\n`;
    }
  }

    // עדכון מספר בעיגול
    if (itemCount > 0) {
      badge.innerText = itemCount;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }

  totalSpan.innerText = total;
  link.href = "https://wa.me/972505183940?text=" + encodeURIComponent(message + "\nסה\"כ לתשלום: " + total + " ₪");
}

// טען את הסל מה-localStorage ברגע שהדף נטען
document.addEventListener("DOMContentLoaded", renderCart);
