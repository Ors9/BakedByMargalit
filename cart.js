// קריאת עגלה מה-localStorage
const cart = JSON.parse(localStorage.getItem("cart") || "{}");

// פתיחה/סגירה של הסל
function toggleCart() {
  document.getElementById("sideCart").classList.toggle("open");
}

// עדכון פריט בעגלה
function updateCart(item, price, delta) {
  if (!cart[item]) cart[item] = { count: 0, price };
  cart[item].count = Math.max(0, cart[item].count + delta);

  // שמור את הסל ב-localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  document.getElementById('count-' + item)?.innerText = cart[item].count;
  renderCart();
}

// שמירה ל-localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// רינדור עגלה
function renderCart() {
  const ul = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total");
  const link = document.getElementById("whatsappLink");
  ul.innerHTML = "";
  let total = 0;
  let message = "שלום! אני מעוניין להזמין:\n";

  for (let item in cart) {
    if (cart[item].count > 0) {
      const li = document.createElement("li");
      li.innerHTML = `${item} x ${cart[item].count} = ${cart[item].count * cart[item].price} ₪
        <div class='quantity-controls'>
          <button onclick=\"updateCart('${item}', ${cart[item].price}, -1)\">➖</button>
          <button onclick=\"updateCart('${item}', ${cart[item].price}, 1)\">➕</button>
        </div>`;
      ul.appendChild(li);
      total += cart[item].count * cart[item].price;
      message += `- ${item} x ${cart[item].count}\n`;
    }
  }

  totalSpan.innerText = total;
  link.href = "https://wa.me/972505183940?text=" + encodeURIComponent(message + "\nסה\"כ לתשלום: " + total + " ₪");
}

// טעינה ראשונית
document.addEventListener("DOMContentLoaded", renderCart);
