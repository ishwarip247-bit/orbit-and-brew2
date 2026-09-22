/* =========================================================
   ORBIT & BREW
   CUSTOMER EXPERIENCE + ORDERING SYSTEM
========================================================= */


/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {
        document.getElementById("preloader")
            .classList.add("hide");
    }, 1000);

});


/* =========================================================
   ELEMENTS
========================================================= */

const menuOverlay = document.getElementById("menuOverlay");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const successOverlay = document.getElementById("successOverlay");

const openMenuButtons = [
    document.getElementById("openMenu"),
    document.getElementById("heroMenu"),
    document.getElementById("teaserMenu"),
    document.getElementById("footerMenu")
];

const closeMenu = document.getElementById("closeMenu");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutBtn = document.getElementById("checkoutBtn");
const successClose = document.getElementById("successClose");

const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const cartCountElement = document.getElementById("cartCount");

let cart = [];


/* =========================================================
   MENU OPEN / CLOSE
========================================================= */

function openMenu() {

    menuOverlay.classList.add("active");

    document.body.classList.add("menu-open");

}

function closeMenuOverlay() {

    menuOverlay.classList.remove("active");

    document.body.classList.remove("menu-open");

}

openMenuButtons.forEach(button => {

    if (button) {

        button.addEventListener("click", openMenu);

    }

});

closeMenu.addEventListener("click", closeMenuOverlay);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        menuOverlay.classList.remove("active");
        checkoutOverlay.classList.remove("active");
        successOverlay.classList.remove("active");

        document.body.classList.remove(
            "menu-open",
            "checkout-open",
            "success-open"
        );

    }

});


/* =========================================================
   MENU CATEGORY FILTER
========================================================= */

const categoryButtons =
    document.querySelectorAll(".menu-categories button");

const menuItems =
    document.querySelectorAll(".menu-item");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category =
            button.dataset.category;

        menuItems.forEach(item => {

            if (
                category === "all" ||
                item.dataset.category === category
            ) {

                item.style.display = "grid";

            } else {

                item.style.display = "none";

            }

        });

    });

});


/* =========================================================
   ADD TO CART
========================================================= */

document.querySelectorAll(".add-item").forEach(button => {

    button.addEventListener("click", () => {

        const name =
            button.dataset.name;

        const price =
            Number(button.dataset.price);

        const existingItem =
            cart.find(item => item.name === name);

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                name,
                price,
                quantity: 1
            });

        }

        renderCart();

        button.innerHTML = "✓";

        setTimeout(() => {

            button.innerHTML = "+";

        }, 600);

    });

});


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (cart.length === 0) {

        cartItemsElement.innerHTML = `
            <div class="empty-cart">
                <span>✦</span>
                <p>Your orbit is empty.</p>
                <small>Add something from the universe.</small>
            </div>
        `;

        cartTotalElement.textContent = "₹0";
        cartCountElement.textContent = "0";

        return;

    }


    cartItemsElement.innerHTML = "";

    let total = 0;
    let count = 0;


    cart.forEach((item, index) => {

        total += item.price * item.quantity;
        count += item.quantity;

        const row =
            document.createElement("div");

        row.className = "cart-row";

        row.innerHTML = `

            <div>

                <strong>${item.name}</strong>

                <small>
                    ₹${item.price} × ${item.quantity}
                </small>

            </div>

            <button data-index="${index}">
                ×
            </button>

        `;

        row.querySelector("button")
            .addEventListener("click", () => {

                removeFromCart(index);

            });

        cartItemsElement.appendChild(row);

    });


    cartTotalElement.textContent =
        `₹${total}`;

    cartCountElement.textContent =
        count;

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    renderCart();

}


/* =========================================================
   CHECKOUT
========================================================= */

checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your orbit is empty. Add something first.");

        return;

    }

    checkoutOverlay.classList.add("active");

    document.body.classList.add("checkout-open");

});


/* =========================================================
   CLOSE CHECKOUT
========================================================= */

closeCheckout.addEventListener("click", () => {

    checkoutOverlay.classList.remove("active");

    document.body.classList.remove("checkout-open");

});


/* =========================================================
   CHECKOUT FORM
========================================================= */

const checkoutForm =
    document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", event => {

    event.preventDefault();


    const customer =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("customerPhone").value.trim();

    const email =
        document.getElementById("customerEmail").value.trim();

    const note =
        document.getElementById("customerNote").value.trim();


    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

    });


    const order = {

        id:
            "ORB-" +
            Date.now()
                .toString()
                .slice(-6),

        customer,

        phone,

        email,

        note,

        items:
            cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),

        total,

        status: "NEW",

        date:
            new Date().toISOString()

    };


    /* =========================================
       SAVE ORDER
    ========================================= */

    let orders =
        JSON.parse(
            localStorage.getItem("orbitBrewOrders")
        ) || [];


    orders.push(order);


    localStorage.setItem(
        "orbitBrewOrders",
        JSON.stringify(orders)
    );


    /* =========================================
       SHOW SUCCESS
    ========================================= */

    document.getElementById("orderNumber")
        .textContent =
        `ORDER #${order.id}`;


    checkoutOverlay.classList.remove("active");

    successOverlay.classList.add("active");

    document.body.classList.remove("checkout-open");

    document.body.classList.add("success-open");


    /* =========================================
       RESET CART
    ========================================= */

    cart = [];

    renderCart();

    checkoutForm.reset();

});


/* =========================================================
   SUCCESS CLOSE
========================================================= */

successClose.addEventListener("click", () => {

    successOverlay.classList.remove("active");

    document.body.classList.remove("success-open");

    closeMenuOverlay();

});


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =
    document.querySelector(".cursor");

const cursorRing =
    document.querySelector(".cursor-ring");


document.addEventListener("mousemove", event => {

    cursor.style.left =
        `${event.clientX}px`;

    cursor.style.top =
        `${event.clientY}px`;


    cursorRing.style.left =
        `${event.clientX}px`;

    cursorRing.style.top =
        `${event.clientY}px`;

});


const interactiveElements =
    document.querySelectorAll(
        "a, button, input, textarea"
    );


interactiveElements.forEach(element => {

    element.addEventListener("mouseenter", () => {

        document.body.classList.add("cursor-hover");

    });

    element.addEventListener("mouseleave", () => {

        document.body.classList.remove("cursor-hover");

    });

});


/* =========================================================
   HERO PARALLAX
========================================================= */

const heroVisual =
    document.querySelector(".hero-visual");


document.addEventListener("mousemove", event => {

    if (!heroVisual) return;

    const x =
        (event.clientX / window.innerWidth - .5);

    const y =
        (event.clientY / window.innerHeight - .5);


    heroVisual.style.transform =
        `translate(${x * 12}px, ${y * 12}px)`;

});


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".journal-card, .story-copy, .experience-point, .visit-content"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";

                    revealObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: .12
        }
    );


revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition =
        "opacity .8s ease, transform .8s ease";

    revealObserver.observe(element);

});


/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document.querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        });

    });


/* =========================================================
   INITIAL CART
========================================================= */

renderCart();
/* =========================================
   TRANSMISSION SYSTEM
========================================= */

const openTransmission = document.getElementById("openTransmission");
const closeTransmission = document.getElementById("closeTransmission");
const transmissionOverlay = document.getElementById("transmissionOverlay");
const transmissionForm = document.getElementById("transmissionForm");
const transmissionSuccess = document.getElementById("transmissionSuccess");
const closeSuccess = document.getElementById("closeSuccess");

if (openTransmission) {
    openTransmission.addEventListener("click", () => {
        transmissionOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    });
}

if (closeTransmission) {
    closeTransmission.addEventListener("click", () => {
        transmissionOverlay.classList.remove("active");
        document.body.style.overflow = "";
    });
}

if (transmissionOverlay) {
    transmissionOverlay.addEventListener("click", (e) => {
        if (e.target === transmissionOverlay) {
            transmissionOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

if (transmissionForm) {
    transmissionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        transmissionForm.style.display = "none";
        transmissionSuccess.classList.add("active");
    });
}

if (closeSuccess) {
    closeSuccess.addEventListener("click", () => {
        transmissionOverlay.classList.remove("active");
        transmissionSuccess.classList.remove("active");
        transmissionForm.style.display = "";
        transmissionForm.reset();
        document.body.style.overflow = "";
    });
}
