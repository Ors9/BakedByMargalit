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

function syncQuantitiesFromCart() {
  for (let item in cart) {
    const countSpan = document.getElementById("count-" + item);
    if (countSpan) {
      countSpan.innerText = cart[item].count;
    }
  }
}

function renderCart() {
  const ul = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total");
  const link = document.getElementById("whatsappLink");
  const badge = document.getElementById("cart-count-badge");
  ul.innerHTML = "";

  let total = 0;
  let message = "שלום! אני מעוניין להזמין:\n";
  let itemCount = 0;

  const halfKey = "חצי קג עוגיות מכונה";
  const product = cart[halfKey];

  // אם יש עוגיות מכונה - טיפל במבצע
  if (product && product.count > 0) {
    const fullKg = Math.floor(product.count / 2);
    const remainingHalves = product.count % 2;
    const itemTotal = fullKg * 100 + remainingHalves * product.price;

    total += itemTotal;
    itemCount += product.count;
    message += `- ${halfKey} x ${product.count} (כולל מבצע)\n`;

    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <img src="${product.image}" alt="${halfKey}" class="cart-product-image">
        <div style="flex-grow: 1;">
          <strong>${halfKey}</strong><br>
          <span class="unit-label">${product.count} יחידות</span>
          <div class="add-to-cart-label">הוספה לסל:</div>
          <div class="quantity-controls">
            <button onclick="updateCart('${halfKey}', ${product.price}, -1, '${product.image}')">➖</button>
            <span>${product.count}</span>
            <button onclick="updateCart('${halfKey}', ${product.price}, 1, '${product.image}')">➕</button>
          </div>
          <div class="price-line">סה"כ: ${itemTotal} ₪ 
            <span style="color: green;">(${fullKg} ק"ג ב־100 ₪ + ${remainingHalves} חצי ק"ג)</span>
          </div>
        </div>
      </div>
    `;
    ul.appendChild(li);
  }

  // שאר הפריטים
  for (let item in cart) {
    if (item === halfKey) continue;

    const product = cart[item];
    if (product.count > 0) {
      const itemTotal = product.count * product.price;
      total += itemTotal;
      itemCount += product.count;
      message += `- ${item} x ${product.count}\n`;

      const li = document.createElement("li");
      li.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <img src="${product.image}" alt="${item}" class="cart-product-image">
          <div style="flex-grow: 1;">
            <strong>${item}</strong><br>
            <span class="unit-label">${product.count} יחידות</span>
            <div class="add-to-cart-label">הוספה לסל:</div>
            <div class="quantity-controls">
              <button onclick="updateCart('${item}', ${product.price}, -1, '${product.image}')">➖</button>
              <span>${product.count}</span>
              <button onclick="updateCart('${item}', ${product.price}, 1, '${product.image}')">➕</button>
            </div>
            <div class="price-line">סה"כ: ${itemTotal} ₪</div>
          </div>
        </div>
      `;
      ul.appendChild(li);
    }
  }

  totalSpan.innerText = total;
  link.href = "https://wa.me/972505183940?text=" + encodeURIComponent(message + "\nסה\"כ לתשלום: " + total + " ₪");

  if (itemCount > 0) {
    badge.style.display = "inline-block";
    badge.innerText = itemCount;
  } else {
    badge.style.display = "none";
  }
}


// טען את הסל מה-localStorage ברגע שהדף נטען
document.addEventListener("DOMContentLoaded", renderCart);
