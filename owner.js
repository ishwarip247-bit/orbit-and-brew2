document.addEventListener("DOMContentLoaded", () => {

    /* AUTH */

    if (
        sessionStorage.getItem("orbitOwnerAuth") !== "true"
    ) {
        window.location.href = "login.html";
        return;
    }


    /* DATA */

    let orders =
        JSON.parse(
            localStorage.getItem("orbitBrewOrders")
        ) || [];


    /* ELEMENTS */

    const ordersToday =
        document.getElementById("ordersToday");

    const revenueToday =
        document.getElementById("revenueToday");

    const customersCount =
        document.getElementById("customersCount");

    const totalOrders =
        document.getElementById("totalOrders");

    const ordersList =
        document.getElementById("ordersList");

    const newCount =
        document.getElementById("newCount");

    const preparingCount =
        document.getElementById("preparingCount");

    const completedCount =
        document.getElementById("completedCount");

    const chartRevenue =
        document.getElementById("chartRevenue");


    /* RENDER */

    function renderDashboard() {

        const today =
            new Date().toDateString();


        const todayOrders =
            orders.filter(order =>
                new Date(order.date).toDateString()
                === today
            );


        const todayRevenue =
            todayOrders.reduce(
                (sum, order) =>
                    sum + Number(order.total),
                0
            );


        const customers =
            new Set(
                orders.map(order => order.email)
            );


        ordersToday.textContent =
            todayOrders.length;

        revenueToday.textContent =
            todayRevenue;

        chartRevenue.textContent =
            "₹" + todayRevenue;

        customersCount.textContent =
            customers.size;

        totalOrders.textContent =
            `${orders.length} TOTAL`;


        const newOrders =
            orders.filter(
                order => order.status === "NEW"
            ).length;

        const preparing =
            orders.filter(
                order => order.status === "PREPARING"
            ).length;

        const completed =
            orders.filter(
                order => order.status === "COMPLETED"
            ).length;


        newCount.textContent = newOrders;
        preparingCount.textContent = preparing;
        completedCount.textContent = completed;


        renderOrders();

    }


    /* ORDERS */

    function renderOrders() {

        if (orders.length === 0) {

            ordersList.innerHTML = `
                <div class="no-orders">
                    NO TRANSMISSIONS RECEIVED
                </div>
            `;

            return;

        }


        ordersList.innerHTML = "";


        [...orders]
            .reverse()
            .forEach(order => {

                const card =
                    document.createElement("div");

                card.className =
                    "order-card";


                const items =
                    order.items
                        .map(item =>
                            `${item.name} × ${item.quantity}`
                        )
                        .join(", ");


                card.innerHTML = `

                    <div class="order-card-top">

                        <div>

                            <div class="order-id">
                                ${order.id}
                            </div>

                            <div class="order-customer">
                                ${order.customer}
                            </div>

                        </div>

                        <div class="order-price">
                            ₹${order.total}
                        </div>

                    </div>


                    <div class="order-items">
                        ${items}
                    </div>


                    <div class="order-bottom">

                        <small>
                            ${new Date(order.date)
                                .toLocaleString()}
                        </small>

                        <select
                            class="status-select"
                            data-id="${order.id}"
                        >

                            <option value="NEW"
                                ${order.status === "NEW" ? "selected" : ""}>
                                RECEIVED
                            </option>

                            <option value="PREPARING"
                                ${order.status === "PREPARING" ? "selected" : ""}>
                                BREWING
                            </option>

                            <option value="COMPLETED"
                                ${order.status === "COMPLETED" ? "selected" : ""}>
                                COMPLETED
                            </option>

                        </select>

                    </div>
                `;


                ordersList.appendChild(card);

            });


        document
            .querySelectorAll(".status-select")
            .forEach(select => {

                select.addEventListener(
                    "change",
                    () => {

                        const order =
                            orders.find(
                                item =>
                                    item.id ===
                                    select.dataset.id
                            );


                        if (order) {

                            order.status =
                                select.value;

                            localStorage.setItem(
                                "orbitBrewOrders",
                                JSON.stringify(orders)
                            );

                            renderDashboard();

                        }

                    }
                );

            });

    }


    /* LOGOUT */

    document
        .getElementById("logoutButton")
        .onclick = () => {

            sessionStorage.removeItem(
                "orbitOwnerAuth"
            );

            window.location.href =
                "login.html";

        };


    /* SIDE NAV */

    document
        .querySelectorAll(".side-link")
        .forEach(link => {

            link.addEventListener("click", () => {

                document
                    .querySelectorAll(".side-link")
                    .forEach(item =>
                        item.classList.remove("active")
                    );

                link.classList.add("active");

            });

        });


    renderDashboard();

});