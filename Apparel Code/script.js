
/* script.js for Authentic Hands Apparel */
/* Uses localStorage for cart, backend status tracking, and manual EFT checkout */

/* --------- Product data --------- */
const PRODUCTS = {
  bloom: {
    id: "bloom",
    title: "Bloom Hoodie",
    price: 350,
    images: [
      "Pictures Folder/Grey Hoodie/Grey Hoodie Front.png",
      "Pictures Folder/Grey Hoodie/Grey Hoodie Back.png",
      "Pictures Folder/Grey Hoodie/Werared Front AI Hoodie.png",
      "Pictures Folder/Grey Hoodie/Weared Back Grey Hoodie.png"
    ],
    desc: "Floral embroidery meets township grit. Comfortable and durable.",
    sizes: {
      XS: { Bust: "79-81 cm", Waist: "61-63 cm", Shoulder: "37-38 cm", Sleeve: "58-59 cm", Length: "58-60 cm" },
      S:  { Bust: "84-86 cm", Waist: "66-68 cm", Shoulder: "38-39 cm", Sleeve: "59-60 cm", Length: "60-62 cm" },
      M:  { Bust: "89-91 cm", Waist: "71-73 cm", Shoulder: "39-40 cm", Sleeve: "62-64 cm", Length: "58-60 cm" },
      L:  { Bust: "94-96 cm", Waist: "76-78 cm", Shoulder: "40-41 cm", Sleeve: "61-62 cm", Length: "64-66 cm" },
      XL: { Bust: "99-101 cm", Waist: "81-83 cm", Shoulder: "41-42 cm", Sleeve: "62-63 cm", Length: "66-68 cm" },
      XXL:{ Bust: "104-106 cm", Waist: "86-88 cm", Shoulder: "42-43 cm", Sleeve: "63-64 cm", Length: "68-70 cm" }
    }
  },
  drymac: {
    id: "drymac",
    title: "White Dry Mac",
    price: 350,
    images: [
      "Pictures Folder/Jackets/Dry-Mac Front.png",
      "Pictures Folder/Jackets/Dry-Mac Back.png",
      "Pictures Folder/Jackets/Dry-Mac Weared Front.png"
    ],
    desc: "Lightweight overshirt for travel and rainy days.",
    sizes: {
      XS: { Bust: "79-81 cm", Waist: "61-63 cm", Shoulder: "37-38 cm", Sleeve: "58-59 cm", Length: "58-60 cm" },
      S:  { Bust: "84-86 cm", Waist: "66-68 cm", Shoulder: "38-39 cm", Sleeve: "59-60 cm", Length: "60-62 cm" },
      M:  { Bust: "89-91 cm", Waist: "71-73 cm", Shoulder: "39-40 cm", Sleeve: "62-64 cm", Length: "58-60 cm" },
      L:  { Bust: "94-96 cm", Waist: "76-78 cm", Shoulder: "40-41 cm", Sleeve: "61-62 cm", Length: "64-66 cm" },
      XL: { Bust: "99-101 cm", Waist: "81-83 cm", Shoulder: "41-42 cm", Sleeve: "62-63 cm", Length: "66-68 cm" },
      XXL:{ Bust: "104-106 cm", Waist: "86-88 cm", Shoulder: "42-43 cm", Sleeve: "63-64 cm", Length: "68-70 cm" }
    }
  },

bluedrymac: {
    id: "bluedrymac",
    title: "Blue Dry Mac",
    price: 350,
    images: [
        "Pictures Folder/Blue DryMac/Blue DryMac Front.png",
        "Pictures Folder/Blue DryMac/Blue DryMac Back.png",
        "Pictures Folder/Blue DryMac/Blue DryMac Unzipped.png",
        "Pictures Folder/Blue DryMac/Blue DryMac Front Weared.png",
        "Pictures Folder/Blue DryMac/Blue DryMac Back Weared.png"
    ],
    desc: "Light and protective overshirt - handy for rainy walks, school and travel.",
    sizes: {
        XS: { Bust: "79-81 cm", Waist: "61-63 cm", Shoulder: "37-38 cm", Sleeve: "58-59 cm", Length: "58-60 cm" },
        S: { Bust: "84-86 cm", Waist: "66-68 cm", Shoulder: "38-39 cm", Sleeve: "59-60 cm", Length: "60-62 cm" },
        M: { Bust: "89-91 cm", Waist: "71-73 cm", Shoulder: "39-40 cm", Sleeve: "62-64 cm", Length: "58-60 cm" },
        L: { Bust: "94-96 cm", Waist: "76-78 cm", Shoulder: "40-41 cm", Sleeve: "61-62 cm", Length: "64-66 cm" },
        XL: { Bust: "99-101 cm", Waist: "81-83 cm", Shoulder: "41-42 cm", Sleeve: "62-63 cm", Length: "66-68 cm" },
        XXL: { Bust: "104-106 cm", Waist: "86-88 cm", Shoulder: "42-43 cm", Sleeve: "63-64 cm", Length: "68-70 cm" }
    }
},

  jersey: {
    id: "jersey",
    title: "Street Jersey",
    price: 380,
    images: [
      "Pictures Folder/Jackets/WhiteJacket Front.png",
      "Pictures Folder/Jackets/WhiteJacket Back.png",
      "Pictures Folder/Jackets/WhitJacket Weared Front.png"
    ],
    desc: "Breathable knit for everyday wear.",
    sizes: {
      XS: { Bust: "79-81 cm", Waist: "61-63 cm", Shoulder: "37-38 cm", Sleeve: "58-59 cm", Length: "58-60 cm" },
      S:  { Bust: "84-86 cm", Waist: "66-68 cm", Shoulder: "38-39 cm", Sleeve: "59-60 cm", Length: "60-62 cm" },
      M:  { Bust: "89-91 cm", Waist: "71-73 cm", Shoulder: "39-40 cm", Sleeve: "62-64 cm", Length: "58-60 cm" },
      L:  { Bust: "94-96 cm", Waist: "76-78 cm", Shoulder: "40-41 cm", Sleeve: "61-62 cm", Length: "64-66 cm" },
      XL: { Bust: "99-101 cm", Waist: "81-83 cm", Shoulder: "41-42 cm", Sleeve: "62-63 cm", Length: "66-68 cm" },
      XXL:{ Bust: "104-106 cm", Waist: "86-88 cm", Shoulder: "42-43 cm", Sleeve: "63-64 cm", Length: "68-70 cm" }
    }
  }
};

/* --------- CART helpers --------- */
function getCart(){
  const raw = localStorage.getItem("ah_cart");
  return raw ? JSON.parse(raw) : [];
}
function saveCart(cart){
  localStorage.setItem("ah_cart", JSON.stringify(cart));
  renderCartMini();
  renderCartDrawer();
}
function addItemToCart(item){
  const cart = getCart();
  const existing = cart.find(i => i.productId === item.productId && i.size === item.size);
  if(existing){
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

/* Quick add from featured (no size check) */
function addToCartQuick(productId){
  const product = PRODUCTS[productId];
  if(!product){ alert("Product not found"); return; }
  addItemToCart({ productId, title: product.title, price: product.price, qty: 1, size: "" });
  flashMessage("Added to cart");
}

/* Add from product page */
function addToCartFromPage(productId){
  const qtyEl = document.getElementById(`qty_${productId}`);
  const sizeEl = document.getElementById(`size_${productId}`);
  const qty = qtyEl ? parseInt(qtyEl.value || 1, 10) : 1;
  const size = sizeEl ? sizeEl.value : "";
  addItemToCart({ productId, title: PRODUCTS[productId].title, price: PRODUCTS[productId].price, qty, size });
  flashMessage("Added to cart");
}

/* Size validation wrapper */
function validateSizeAndAdd(productId) {
  const sizeEl = document.getElementById(`size_${productId}`);
  const selectedSize = sizeEl?.value;
  if (!selectedSize) {
    alert("Please choose a size before adding to cart.");
    sizeEl?.focus();
    return;
  }
  addToCartFromPage(productId);
}

/* Render cart mini count */
function renderCartMini(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById("cartCount");
  if(el) el.textContent = count;
}

/* Render cart drawer contents */
function renderCartDrawer(){
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if(!itemsEl || !totalEl) return;
  const cart = getCart();
  itemsEl.innerHTML = "";
  let total = 0;
  if(cart.length === 0){
    itemsEl.innerHTML = "<p class='muted'>Your bag is empty.</p>";
  } else {
    cart.forEach((it, idx) => {
      total += it.price * it.qty;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${(PRODUCTS[it.productId]?.images?.[0]||'assets/placeholder.jpg')}" alt="${it.title}" />
        <div style="flex:1">
          <strong>${it.title}</strong>
          <div class="muted">${it.size ? 'Size: ' + it.size : ''}</div>
          <div style="display:flex;gap:8px;align-items:center;margin-top:6px;">
            <input type="number" min="1" value="${it.qty}" style="width:70px;padding:6px;border-radius:8px" data-cart-index="${idx}" oninput="updateCartQty(event)" />
            <div class="muted">R${it.price} ea</div>
            <button class="btn small outline" onclick="removeCartItem(${idx})">Remove</button>
          </div>
        </div>
      `;
      itemsEl.appendChild(div);
    });
  }
  totalEl.textContent = total.toFixed(2);
}

/* Update qty */
function updateCartQty(e){
  const idx = parseInt(e.target.dataset.cartIndex, 10);
  let val = parseInt(e.target.value || 1, 10);
  if(val < 1) val = 1;
  const cart = getCart();
  if(cart[idx]){
    cart[idx].qty = val;
    saveCart(cart);
  }
}

/* Remove item */
function removeCartItem(idx){
  const cart = getCart();
  cart.splice(idx,1);
  saveCart(cart);
}

/* Open/close cart */
function openCart(){ document.getElementById("cartDrawer").classList.add("open"); }
function closeCart(){ document.getElementById("cartDrawer").classList.remove("open"); }

/* --------- Checkout with Manual EFT --------- */
function checkout(){
  const cart = getCart();
  if(!cart.length){ alert("Cart is empty"); return; }
  const modal = document.getElementById("checkoutModal");
  if(modal) modal.classList.add("open");
}
function closeCheckout(){
  const modal = document.getElementById("checkoutModal");
  if(modal) modal.classList.remove("open");
}

/* --------- Size info inline --------- */
function updateSizeInfoInline(selectEl){
  const productId = selectEl.dataset.product || selectEl.id.replace("size_","");
  const size = selectEl.value;
  const target = document.getElementById(`sizeInfo_${productId}`);

  if (!size || !PRODUCTS[productId] || !PRODUCTS[productId].sizes[size]) {
    if (target) {
      target.textContent = "";
      target.style.display = "none";
    }
    return;
  }

  const { Bust, Waist, Shoulder, Sleeve, Length } = PRODUCTS[productId].sizes[size];
  if (target) {
    target.textContent = `Bust: ${Bust} • Waist: ${Waist} • Shoulder: ${Shoulder} • Sleeve: ${Sleeve} • Length: ${Length}`;
    target.style.display = "block";
  }
}

/* --------- Parcel tracking (real status via backend) --------- */
function trackParcel(){
  const input = document.getElementById("trackNumber");
  const result = document.getElementById("trackResult");
  if(!input || !result) return;

  const code = (input.value || "").trim().toUpperCase();
  if (!code) {
    result.textContent = "Please enter a tracking number.";
    result.className = "track-result error";
    return;
  }

  fetch("https://authentic-hands-apparel-2.onrender.com/get-order-status", {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tracking: code })
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        const { order } = data;
        result.textContent = `${code}: ${order.status}`;
        result.className = "track-result ok";
      } else {
        result.textContent = "Tracking not found. Check your code and try again.";
        result.className = "track-result error";
      }
    })
    .catch(err => {
      console.error(err);
      result.textContent = "Error fetching status. Try again.";
      result.className = "track-result error";
    });
}

/* --------- DOM ready: wire up --------- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      const name = document.getElementById("custName").value;
      const email = document.getElementById("custEmail").value;
      const phone = document.getElementById("custPhone").value;
      const address = document.getElementById("custAddress").value;
      const delivery = document.getElementById("deliveryOption").value;
      const cart = getCart();
      const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
      const deliveryFee = delivery === "delivery" ? 70 : 0;
      const grandTotal = total + deliveryFee;
      const trackingCode = `AH-${Math.floor(1000+Math.random()*8999)}`;

      // Persist last order locally (optional for UX)
      localStorage.setItem("last_order", JSON.stringify({
        cart, name, email, phone, address, delivery,
        total, deliveryFee, grandTotal,
        date: new Date().toISOString(),
        tracking: trackingCode
      }));

      // Clear cart
      localStorage.removeItem("ah_cart");
      saveCart([]);

      // Send to backend for email + save
      fetch("https://authentic-hands-apparel-2.onrender.com/send-confirmation", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          orderData: {
            cart,
            name,
            email,
            phone,
            address,
            delivery,
            total,
            deliveryFee,
            grandTotal,
            date: new Date().toISOString(),
            tracking: trackingCode
          }
        })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          alert(`Thank you ${name}! Your order has been placed.\nOrder ID: ${trackingCode}\nA confirmation email has been sent to ${email}.`);
        } else {
          alert("Order saved, but email failed to send.");
        }
        closeCheckout();
      })
      .catch(err => {
        console.error(err);
        alert("Order placed, but email failed to send.");
        closeCheckout();
      });
    });
  }

  const openBtn = document.getElementById("openCartBtn");
  if (openBtn) openBtn.addEventListener("click", openCart);

  renderCartMini();
  renderCartDrawer();

  document.querySelectorAll(".carousel").forEach(wrapper => {
    updateCarousel(wrapper, 0);
  });

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  if (productId) {
    const target = document.getElementById(productId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const sizeEl = target.querySelector(`#size_${productId}`);
      if (sizeEl) sizeEl.focus();
    }
  }
});

/* --------- Carousel --------- */
function getCarouselState(wrapper){
  const stateKey = "carouselIndex";
  let idx = parseInt(wrapper.dataset[stateKey] || "0", 10);
  const track = wrapper.querySelector(".carousel-images");
  const slides = track ? track.children.length : 0;
  return { idx, track, slides, stateKey };
}
function updateCarousel(wrapper, idx){
  const { track, slides, stateKey } = getCarouselState(wrapper);
  if (!track || !slides) return;
  if (idx < 0) idx = 0;
  if (idx > slides - 1) idx = slides - 1;
  wrapper.dataset[stateKey] = String(idx);
  const percent = -100 * idx;
  track.style.transform = `translateX(${percent}%)`;
  track.style.display = "flex";
  track.style.transition = "transform 300ms ease";
  [...track.children].forEach(img => { img.style.flex = "0 0 100%"; });
}
function carouselPrev(btn){
  const wrapper = btn.closest(".carousel");
  const { idx } = getCarouselState(wrapper);
  updateCarousel(wrapper, idx - 1);
}
function carouselNext(btn){
  const wrapper = btn.closest(".carousel");
  const { idx } = getCarouselState(wrapper);
  updateCarousel(wrapper, idx + 1);
}

/* --------- Flash message --------- */
function flashMessage(msg){
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.position = "fixed";
  el.style.right = "20px";
  el.style.bottom = "20px";
  el.style.background = "var(--terracotta)";
  el.style.color = "white";
  el.style.padding = "10px 14px";
  el.style.borderRadius = "10px";
  el.style.zIndex = 200;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1800);
}
