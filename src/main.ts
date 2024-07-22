import "./styles/style.scss";
import "./components/Carousel.ts";
import productsData from "./data/products.json";

const wishlist = new Set<number>();
const cart = new Map<number, number>();

function updateWishlistModal() {
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  if (wishlistItemsContainer) {
    wishlistItemsContainer.innerHTML = "";
    if (wishlist.size === 0) {
      wishlistItemsContainer.innerHTML = "<p>No items added</p>";
    } else {
      productsData.forEach((product) => {
        if (wishlist.has(product.id)) {
          const item = document.createElement("div");
          item.className = "wishlist-item";
          item.innerHTML = `
            <img src="${product.image}" alt="${
            product.name
          }" style="height: 100px; width: auto;">
            <h3>${product.name}</h3>
            <p>Price: €${product.discounted_price ?? product.original_price}</p>
            <button class="wishlist-cart-button" data-id="${product.id}" ${
            cart.has(product.id) ? "disabled" : ""
          }>
              ${cart.has(product.id) ? "Added to Cart" : "Add to Cart"}
            </button>
          `;
          wishlistItemsContainer.appendChild(item);
        }
      });

      document.querySelectorAll(".wishlist-cart-button").forEach((button) => {
        button.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          const productId = Number(target.dataset.id);
          if (!cart.has(productId)) {
            cart.set(productId, 1);
            target.setAttribute("disabled", "true");
            target.textContent = "Added to Cart";
            updateCartModal();
            updateCartButtons(productId, cart, wishlist);
          }
        });
      });
    }
  }
  updateWishlistCount(wishlist);
}

function updateCartModal() {
  const cartItemsContainer = document.getElementById("cart-items");
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = "";
    if (cart.size === 0) {
      cartItemsContainer.innerHTML = "<p>No items added</p>";
    } else {
      productsData.forEach((product) => {
        if (cart.has(product.id)) {
          const quantity = cart.get(product.id);
          const item = document.createElement("div");
          item.className = "cart-item";
          item.innerHTML = `
            <img src="${product.image}" alt="${
            product.name
          }" style="height: 100px; width: auto;">
            <h3>${product.name}</h3>
            <p>Price: €${product.discounted_price ?? product.original_price}</p>
            <div class="quantity-controls">
              <button class="decrease" data-id="${product.id}">-</button>
              <span>${quantity}</span>
              <button class="increase" data-id="${product.id}">+</button>
            </div>
          `;
          cartItemsContainer.appendChild(item);
        }
      });

      const totalContainer = document.createElement("div");
      totalContainer.className = "total-container";
      totalContainer.id = "cart-total";
      cartItemsContainer.appendChild(totalContainer);
      updateCartTotal(cart);

      const checkoutButton = document.createElement("button");
      checkoutButton.textContent = "Proceed to Checkout";
      checkoutButton.className = "checkout-button";
      checkoutButton.disabled = cart.size === 0;
      checkoutButton.addEventListener("click", () => {
        if (cart.size > 0) {
          alert("Proceeding to checkout");
        }
      });
      cartItemsContainer.appendChild(checkoutButton);

      document.querySelectorAll(".decrease").forEach((button) => {
        button.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          const productId = Number(target.dataset.id);
          updateCartQuantity(productId, -1);
        });
      });

      document.querySelectorAll(".increase").forEach((button) => {
        button.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          const productId = Number(target.dataset.id);
          updateCartQuantity(productId, 1);
        });
      });
    }
  }
  updateCartCount(cart);
}

function updateCartQuantity(productId: number, change: number) {
  if (cart.has(productId)) {
    let quantity = cart.get(productId)! + change;
    if (quantity <= 0) {
      cart.delete(productId);
    } else {
      cart.set(productId, quantity);
    }
    updateCartModal();
    updateCartButtons(productId, cart, wishlist);
  }
}

function updateCartButtons(
  productId: number,
  cart: Map<number, number>,
  wishlist: Set<number>
) {
  document
    .querySelectorAll(`.cart-button[data-id="${productId}"]`)
    .forEach((button) => {
      if (cart.has(productId)) {
        button.setAttribute("disabled", "true");
        button.textContent = "Added to Cart";
      } else {
        button.removeAttribute("disabled");
        button.textContent = "Add to Cart";
      }
    });

  document
    .querySelectorAll(`.wishlist-cart-button[data-id="${productId}"]`)
    .forEach((button) => {
      if (cart.has(productId)) {
        button.setAttribute("disabled", "true");
        button.textContent = "Added to Cart";
      } else {
        button.removeAttribute("disabled");
        button.textContent = "Add to Cart";
      }
    });

  document.querySelectorAll(".wishlist-button").forEach((button) => {
    const id = Number(button.getAttribute("data-id"));
    if (wishlist.has(id)) {
      button.textContent = "Remove from Wishlist";
    } else {
      button.textContent = "Add to Wishlist";
    }
  });
}

function updateWishlistCount(wishlist: Set<number>) {
  const wishlistCountElement = document.getElementById("wishlist-count");
  if (wishlistCountElement) {
    wishlistCountElement.textContent = String(wishlist.size);
  }
}

function updateCartCount(cart: Map<number, number>) {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    const itemCount = Array.from(cart.values()).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
    cartCountElement.textContent = String(itemCount);
  }
}

function updateCartTotal(cart: Map<number, number>) {
  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    const total = Array.from(cart.entries()).reduce(
      (sum, [productId, quantity]) => {
        const product = productsData.find((p) => p.id === productId);
        const price = product?.discounted_price ?? product?.original_price ?? 0;
        return sum + price * quantity;
      },
      0
    );
    totalElement.textContent = `Total: €${total.toFixed(2)}`;
  }
}

document.getElementById("wishlist-button")?.addEventListener("click", () => {
  document.getElementById("wishlist-modal")?.classList.add("open");
  updateWishlistModal();
});

document
  .getElementById("close-wishlist-modal")
  ?.addEventListener("click", () => {
    document.getElementById("wishlist-modal")?.classList.remove("open");
  });

document.getElementById("cart-button")?.addEventListener("click", () => {
  document.getElementById("cart-modal")?.classList.add("open");
  updateCartModal();
});

document.getElementById("close-cart-modal")?.addEventListener("click", () => {
  document.getElementById("cart-modal")?.classList.remove("open");
});

import { initCarousel } from "./components/Carousel.ts";
initCarousel(productsData, wishlist, cart, updateCartModal);
