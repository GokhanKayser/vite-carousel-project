import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface Product {
  id: number;
  link: string;
  name: string;
  image: string;
  original_price: number;
  discounted_price: number | null;
}

export function initCarousel(
  products: Product[],
  wishlist: Set<number>,
  cart: Map<number, number>,
  updateCartModal: () => void
) {
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  if (swiperWrapper) {
    products.forEach((product) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      let priceHTML = `<p class="price">€${product.original_price.toFixed(
        2
      )}</p>`;
      if (product.discounted_price !== null) {
        priceHTML = `
          <p class="price strikethrough">€${product.original_price.toFixed(
            2
          )}</p>
          <p class="price discounted">€${product.discounted_price.toFixed(
            2
          )}</p>
        `;
      } else {
        priceHTML += `<div class="price-placeholder"></div>`;
      }

      slide.innerHTML = `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            ${priceHTML}
            <div class="actions">
              <button class="wishlist-button" data-id="${
                product.id
              }">Add to Wishlist</button>
              <button class="cart-button" data-id="${product.id}" ${
        cart.has(product.id) ? "disabled" : ""
      }>${cart.has(product.id) ? "Added to Cart" : "Add to Cart"}</button>
            </div>
          </div>
        </div>
      `;

      slide.querySelector(".product-card")?.addEventListener("click", () => {
        window.open(product.link, "_blank");
      });

      swiperWrapper.appendChild(slide);
    });

    document.querySelectorAll(".wishlist-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const productId = Number(target.dataset.id);
        if (wishlist.has(productId)) {
          wishlist.delete(productId);
          target.textContent = "Add to Wishlist";
        } else {
          wishlist.add(productId);
          target.textContent = "Remove from Wishlist";
        }
        updateWishlistCount(wishlist);
      });
    });

    document.querySelectorAll(".cart-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
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

    truncateText(".product-title", 2, 3, 4);
    setEqualHeight(".product-card");
    window.addEventListener("resize", () => {
      setEqualHeight(".product-card");
      truncateText(".product-title", 2, 3, 4);
    });
  }

  new Swiper(".swiper", {
    modules: [Navigation, Pagination],
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
    },
  });
}

function truncateText(
  selector: string,
  largeLines: number,
  mediumLines: number,
  smallLines: number
) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    const el = element as HTMLElement;
    const lineClamp =
      window.innerWidth >= 1024
        ? largeLines
        : window.innerWidth >= 768
        ? mediumLines
        : smallLines;
    el.style.webkitLineClamp = String(lineClamp);
  });
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

function setEqualHeight(selector: string) {
  const elements = document.querySelectorAll(selector);
  let maxHeight = 0;

  elements.forEach((element) => {
    (element as HTMLElement).style.height = "auto";
    const height = (element as HTMLElement).offsetHeight;
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  elements.forEach((element) => {
    (element as HTMLElement).style.height = `${maxHeight}px`;
  });
}

function updateWishlistCount(wishlist: Set<number>) {
  const wishlistCountElement = document.getElementById("wishlist-count");
  if (wishlistCountElement) {
    wishlistCountElement.textContent = String(wishlist.size);
  }
}
