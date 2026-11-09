const products = [
  {id:"NS-001",name:"The Daily Bottle",category:"Accessories",price:420,tag:"BESTSELLER",tone:"#e4e8dc",shape:"#71836b",shapeType:"round",description:"A simple bottle for everyday hydration."},
  {id:"NS-002",name:"Everyday Tote",category:"Bags",price:560,tag:"NEW",tone:"#eee4d8",shape:"#b88f6c",shapeType:"wide",description:"Room for the things you carry every day."},
  {id:"NS-003",name:"Soft Form Cap",category:"Accessories",price:390,tag:"",tone:"#e5e5e9",shape:"#747887",shapeType:"",description:"An easy finishing touch."},
  {id:"NS-004",name:"Calm Desk Lamp",category:"Home",price:1250,tag:"",tone:"#e9e5d9",shape:"#b4a17a",shapeType:"",description:"Warm light for focused evenings."},
  {id:"NS-005",name:"Weekend Sneakers",category:"Footwear",price:1850,tag:"POPULAR",tone:"#e3e8e7",shape:"#879c9a",shapeType:"wide",description:"Comfort built for slower weekends."},
  {id:"NS-006",name:"Essential Mug",category:"Home",price:310,tag:"",tone:"#e9e3df",shape:"#a77d6c",shapeType:"round",description:"Your new favorite morning ritual."}
];
const money = n => "EGP " + n.toLocaleString("en-EG");
const cart = [];
const grid = document.getElementById("product-grid");
const countEl = document.getElementById("cart-count");
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");
const checkoutModal = document.getElementById("checkout-modal");
const successModal = document.getElementById("success-modal");

function track(name, params={}) {
  if (typeof window.fbq === "function") window.fbq("track", name, params);
}
function productPayload(p) {
  return {content_ids:[p.id], content_type:"product", content_name:p.name, value:p.price, currency:"EGP"};
}
function renderProducts() {
  grid.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-image" style="--tone:${p.tone};--shape:${p.shape}">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <div class="shape ${p.shapeType}"></div>
      </div>
      <div class="product-info"><div><h3>${p.name}</h3><p>${p.category}</p></div><span class="price">${money(p.price)}</span></div>
      <button class="add-button" data-add="${p.id}">ADD TO CART +</button>
    </article>`).join("");
  grid.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.add)));
}
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.quantity++;
  else cart.push({...p, quantity:1});
  track("AddToCart", {...productPayload(p), quantity:1});
  renderCart();
  openCart();
}
function renderCart() {
  const totalQty = cart.reduce((s,p)=>s+p.quantity,0);
  const total = cart.reduce((s,p)=>s+p.price*p.quantity,0);
  countEl.textContent = totalQty;
  document.getElementById("cart-total").textContent = money(total);
  document.getElementById("checkout-total").textContent = money(total);
  document.getElementById("checkout-button").disabled = !cart.length;
  document.getElementById("cart-items").innerHTML = cart.length ? cart.map(p => `
    <div class="cart-line"><div><strong>${p.name}</strong><small>${p.quantity} × ${money(p.price)}</small></div><div><strong>${money(p.price*p.quantity)}</strong><br><button class="remove-item" data-remove="${p.id}">Remove</button></div></div>`).join("") : '<p class="empty-cart">Your cart is empty.</p>';
  document.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{const i=cart.findIndex(p=>p.id===b.dataset.remove);if(i>-1)cart.splice(i,1);renderCart()}));
}
function openCart(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");overlay.classList.add("show")}
function closeCart(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");overlay.classList.remove("show")}
document.getElementById("cart-toggle").addEventListener("click",openCart);
document.getElementById("cart-close").addEventListener("click",closeCart);
overlay.addEventListener("click",()=>{closeCart();checkoutModal.classList.remove("open")});

document.getElementById("checkout-button").addEventListener("click",()=>{
  if (!cart.length) return;
  const total = cart.reduce((s,p)=>s+p.price*p.quantity,0);
  const ids = cart.map(p=>p.id);
  const contents = cart.map(p=>({id:p.id,quantity:p.quantity,item_price:p.price}));
  track("InitiateCheckout",{content_ids:ids,contents,content_type:"product",num_items:cart.reduce((s,p)=>s+p.quantity,0),value:total,currency:"EGP"});
  closeCart();checkoutModal.classList.add("open");checkoutModal.setAttribute("aria-hidden","false");
});
document.getElementById("checkout-close").addEventListener("click",()=>checkoutModal.classList.remove("open"));
document.getElementById("checkout-form").addEventListener("submit",e=>{
  e.preventDefault();
  const total = cart.reduce((s,p)=>s+p.price*p.quantity,0);
  const contents = cart.map(p=>({id:p.id,quantity:p.quantity,item_price:p.price}));
  const ids = cart.map(p=>p.id);
  // Demo only: Purchase fires only after the user explicitly submits the fake order.
  track("Purchase",{content_ids:ids,contents,content_type:"product",num_items:cart.reduce((s,p)=>s+p.quantity,0),value:total,currency:"EGP"});
  checkoutModal.classList.remove("open");
  successModal.classList.add("open");
  successModal.setAttribute("aria-hidden","false");
  cart.length=0;renderCart();e.target.reset();
});
document.getElementById("success-close").addEventListener("click",()=>successModal.classList.remove("open"));
renderProducts();renderCart();

// Product detail signal: this demo displays products on the homepage, so each product card view is not
// automatically counted as ViewContent. Click a product name/image to send a real product-view event.
grid.querySelectorAll(".product-card").forEach((card,index)=>{
  const p=products[index];
  card.querySelector(".product-image").style.cursor="pointer";
  card.querySelector(".product-image").addEventListener("click",()=>{
    track("ViewContent",productPayload(p));
    alert(`${p.name}\\n${p.description}\\n${money(p.price)}\\n\\nViewContent event sent.`);
  });
  card.querySelector("h3").style.cursor="pointer";
  card.querySelector("h3").addEventListener("click",()=>{
    track("ViewContent",productPayload(p));
    alert(`${p.name}\\n${p.description}\\n${money(p.price)}\\n\\nViewContent event sent.`);
  });
});
