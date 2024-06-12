const catalogo = document.getElementById("catalogo")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const nameInput = document.getElementById("name-comp")
const nameWarn = document.getElementById("name-warn")

let cart = [];


// Abrir o modela do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"

})

// Fechar o modal do carrinho
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

catalogo.addEventListener("click", function () {
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        // console.log(name)
        // console.log(price)
        addToCart(name, price)
    }
})

// Adicionar no carrinho
function addToCart(name, price,) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity += 1;
        return;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()

}

// ATUALIZA O CARRINHO ---
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justfy-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>

        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

// REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

nameInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        nameInput.classList.remove("border-red-500")
        nameWarn.classList.add("hidden")
    }
})

// FINALIZAR PEDIDO

checkoutBtn.addEventListener("click", function () {

    // ALERTA FECHADO

    // const isOpen = checkCanecaOpen();
    // if (!isOpen) {
    //     Toastify({
    //         text: "Ops, no momento estamos fechados!",
    //         duration: 3000,
    //         close: true,
    //         gravity: "top", // `top` or `bottom`
    //         position: "right", // `left`, `center` or `right`
    //         stopOnFocus: true, // Prevents dismissing of toast on hover
    //         style: {
    //             background: "linear-gradient(to right, #8B0000, #FF0000, #FF6347, #FF0000, #8B0000)",
    //         },
    //     }).showToast();
    //     return;
    // }



    if (cart.length == 0) return;
    if (nameInput.value === "") {
        nameWarn.classList.remove("hidden")
        nameInput.classList.add("border-red-500")
        return;
    }

    // ENVIAR PEDIDO PARA API WHATSAPP

    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}`
        )
    })

    const message = encodeURIComponent(cartItems)
    const phone = "47996866060"

    window.open(`https://wa.me/${phone}?text=${message} Nome: ${nameInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})

// VERFICAR A HORA E MANIPULAR O CARD HORÁRIO
function checkCanecaOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 18; //true
}

const spanItem = document.getElementById("date-span")
const isOpen = checkCanecaOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")

} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

