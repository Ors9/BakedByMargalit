// טען עגלה מ-localStorage אם קיימת
const cart = JSON.parse(localStorage.getItem("cart") || "{}");

// פתיחה/סגירה של הסל
function toggleCart() {
  document.getElementById("sideCart").classList.toggle("open");
}

// עדכון פריט בסל
function updateCart(item, price, delta, image = null) {
  if (!cart[item]) {
    cart[item] = { count: 0, price, image };
  }
  cart[item].count = Math.max(0, cart[item].count + delta);
  if (image) {
    cart[item].image = image;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  const countSpan = document.getElementById("count-" + item);
  if (countSpan) {
    countSpan.innerText = cart[item].count;
  }
  renderCart();
}


function syncQuantitiesFromCart() {
  for (let item in cart) {
    const countSpan = document.getElementById("count-" + item);
    if (countSpan) countSpan.innerText = cart[item].count;
  }
}

// פונקציה שמחזירה אלמנט <li> מוכן להצגה בסל
function createCartItemElement(item, product, itemTotal) {
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
  return li;
}

// מטפל בפריט עם מבצע (עוגיות חצי ק"ג)
function handleDiscountedItem(ul) {
  const item = "חצי קג עוגיות מכונה";
  const product = cart[item];
  if (!product || product.count === 0) return { total: 0, count: 0, message: "" };

  const fullKg = Math.floor(product.count / 2);
  const remaining = product.count % 2;
  const itemTotal = fullKg * 100 + remaining * product.price;

  ul.appendChild(createCartItemElement(item, product, itemTotal));

  return {
    total: itemTotal,
    count: product.count,
    message: `- ${item} x ${product.count}\n`
  };
}

// מטפל בכל שאר הפריטים
function handleRegularItems(ul, skipItem) {
  let total = 0, count = 0, message = "";
  for (let item in cart) {
    if (item === skipItem) continue;
    const product = cart[item];
    if (product.count > 0) {
      const itemTotal = product.count * product.price;
      ul.appendChild(createCartItemElement(item, product, itemTotal));
      total += itemTotal;
      count += product.count;
      message += `- ${item} x ${product.count}\n`;
    }
  }
  return { total, count, message };
}

function renderCart() {
  const ul = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total");
  //const link = document.getElementById("whatsappLink");
  const badge = document.getElementById("cart-count-badge");
  const checkoutButton = document.getElementById("checkoutButton");
  ul.innerHTML = "";

  let total = 0;
  let message = "שלום! אני מעוניין להזמין:\n";
  let itemCount = 0;



  // מבצע
  const discount = handleDiscountedItem(ul);
  total += discount.total;
  itemCount += discount.count;
  message += discount.message;


  // שאר פריטים
  const regular = handleRegularItems(ul, "חצי קג עוגיות מכונה");
  total += regular.total;
  itemCount += regular.count;
  message += regular.message;

  // עדכון סה"כ
  let totalItemCount = 0;
  for (const item in cart) {
    if (cart[item].count > 0) {
      totalItemCount += cart[item].count;
    }
  }

  totalSpan.innerText = total;
  //link.href = "https://wa.me/972505183940?text=" + encodeURIComponent(message + "\nסה\"כ לתשלום: " + total + " ₪");

  if (badge) {
    badge.innerText = totalItemCount;
    badge.style.display = totalItemCount > 0 ? "inline-block" : "none";
  }


  if (checkoutButton) {
    checkoutButton.style.display = itemCount > 0 ? "block" : "none";
  }

  const quantityButtons = document.querySelectorAll('.quantity-controls button');
  quantityButtons.forEach(button => {
    let lastTouch = 0;
  
    button.addEventListener('touchstart', function (event) {
      const now = new Date().getTime();
      if (now - lastTouch <= 300) {
        event.preventDefault(); // מונע זום כפול
      }
      lastTouch = now;
    }, { passive: false });
  });

}
/** 
// טען את הסל ברגע שהדף נטען
document.addEventListener("DOMContentLoaded", () => {
  syncQuantitiesFromCart();
  renderCart();
});*/

window.onload = () => {
  syncQuantitiesFromCart();
  renderCart();
};


