

// פתיחה/סגירה של הסל
function toggleCart() {
  //document.getElementById("sideCart").classList.toggle("open"); //this to open side cart!
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  let hasItems = false;
  for (let item in cart) {
    if (cart[item].count > 0) {
      hasItems = true;
      break;
    }
  }

  if (!hasItems) {
    alert("העגלה שלך ריקה. הוסף מוצרים לפני ההזמנה.");
    return;
  }

  window.location.href = "checkout.html";
}

function updateCheckoutQuantity(itemName, delta) {

  const cart = JSON.parse(localStorage.getItem("cart") || "{}"); 

  if (!cart[itemName]) return;

  cart[itemName].count += delta;

  // אם הכמות ירדה מתחת ל־0 – אפס אותה
  if (cart[itemName].count < 0) cart[itemName].count = 0;

  // שמור ל-localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // רנדר מחדש את כל העגלה והתצוגה
  renderCheckoutCart(); // יעדכן את עמוד התשלום (הפריט ייעלם אם count == 0)
  renderCart();         // יעדכן את side-cart + badge
}


// עדכון פריט בסל
function updateCart(item, price, delta, image = null) {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  if (!cart[item]) {
    cart[item] = { count: 0, price, image };
  }
  cart[item].count = Math.max(0, cart[item].count + delta);
  if (image) {
    cart[item].image = image;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  
  const safeId = getSafeId(item);
  const countSpan = document.getElementById("count-" + safeId);
  if (countSpan) {
    countSpan.innerText = cart[item].count;
  }

  renderCart();
}


function syncQuantitiesFromCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  for (let item in cart) {
    const safeId = getSafeId(item);
    const countSpan = document.getElementById("count-" + safeId);
    if (countSpan) countSpan.innerText = cart[item].count;
  }
}

// פונקציה שמחזירה אלמנט <li> מוכן להצגה בסל
function createCartItemElement(item, product, itemTotal) {
  const li = document.createElement("li");
  li.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="flex-grow: 1;">
        <strong>${item}</strong><br>
        <span class="unit-label">${product.count} יחידות</span>
        <div class="quantity-controls">
          <button onclick="updateCart('${item}', ${product.price}, -1, '${product.image}')">➖</button>
          <span>${product.count}</span>
          <button onclick="updateCart('${item}', ${product.price}, 1, '${product.image}')">➕</button>
        </div>
        <div class="price-line">סה"כ: ${itemTotal} ₪</div>
      </div>
      <img src="${product.image}" alt="${item}" class="cart-product-image">
    </div>
  `;
  return li;
}
function getSafeId(name) {
  return name.replace(/\s/g, "_").replace(/[^\wא-ת]/g, "");
}
// מטפל בפריט עם מבצע (עוגיות חצי ק"ג)
function handleDiscountedItem(ul) {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
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
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
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
  
  const cart = JSON.parse(localStorage.getItem("cart") || "{}"); 
  const ul = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total");
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

  if (badge) {
    badge.innerText = totalItemCount;
    badge.style.display = totalItemCount > 0 ? "inline-block" : "none";
  }


  if (checkoutButton) {
    checkoutButton.style.display = itemCount > 0 ? "block" : "none";
  }



}


window.onload = () => {
  syncQuantitiesFromCart();
  renderCart();
};



function renderCheckoutCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  const container = document.getElementById("checkout-items");
  const totalSpan = document.getElementById("checkout-total");
  const inlineTotal = document.getElementById("checkout-total-inline");
  container.innerHTML = "";

  let total = 0;

  for (let item in cart) {
    const product = cart[item];
    if (product.count > 0) {
      let itemTotal = item === "חצי קג עוגיות מכונה"
        ? (Math.floor(product.count / 2) * 100 + (product.count % 2) * product.price)
        : product.count * product.price;

      total += itemTotal;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${product.image}" alt="${item}">
        <div class="cart-details">
          <strong>${item}</strong><br>
          <div class="quantity-controls">
            <button onclick="updateCheckoutQuantity('${item}', -1)">−</button>
            <span id="count-${item}">${product.count}</span>
            <button onclick="updateCheckoutQuantity('${item}', 1)">+</button>
          </div>
          סה"כ לפריט: <span id="item-total-${item}">${itemTotal}</span> ₪
        </div>
      `;
      container.appendChild(div);
    }
  }

  totalSpan.innerText = total;
  if (inlineTotal) inlineTotal.innerText = total;
}





