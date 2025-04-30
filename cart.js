// טען עגלה מ-localStorage אם קיימת
const cart = JSON.parse(localStorage.getItem("cart") || "{}");

// פתיחה/סגירה של הסל
function toggleCart() {
  document.getElementById("sideCart").classList.toggle("open");
}

// עדכון פריט בעגלה
function updateCart(item, price, delta, image) {
  if (!cart[item]) cart[item] = { count: 0, price, image };
  cart[item].count = Math.max(0, cart[item].count + delta);

  localStorage.setItem("cart", JSON.stringify(cart));
  document.getElementById('count-' + item)?.innerText = cart[item].count;
  renderCart();
}

// רינדור הסל
function renderCart() {
  const ul = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total");
  const link = document.getElementById("whatsappLink");
  ul.innerHTML = "";
  let total = 0;
  let message = "שלום! אני מעוניין להזמין:\n";

  for (let item in cart) {
    const product = cart[item];
    if (product.count > 0) {
      const li = document.createElement("li");
      li.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${product.image}" alt="${item}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;">
          <div style="flex-grow: 1;">
            <strong>${item}</strong><br>
            <span style="font-size: 14px; color: #777;">${product.count} יחידות</span>
            <div class="quantity-controls">
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

  totalSpan.innerText = total;
  link.href = "https://wa.me/972505183940?text=" + encodeURIComponent(message + "\nסה\"כ לתשלום: " + total + " ₪");
}

// טעינה ראשונית
document.addEventListener("DOMContentLoaded", renderCart);