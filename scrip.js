const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

//Lista de itens
let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal(); //Atualiza o Modal
    cartModal.style.display = "flex"    
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//Fechar o modal quando clicar no botão "FECHAR"
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//Adicionar o item no carrinho ao cilicar no botão do carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)        
    }
})

//Função para adicionar no carrinho
function addToCart(name, price){
    const existinItem = cart.find (item => item.name === name) //find passa na lista verificando se ja tem o item na lista
   
    //se o item ja existe na lista, ele aumenta a quantidade do item e não duplica ele na lista
    if(existinItem){
    existinItem.quantity +=1;    
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })

    }

    updateCartModal()    
   
}

//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document. createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
                <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
                </button>
                
            </div>
        `
        //Somando os itens do carrinho
        total += item.price * item.quantity;
        //

        cartItemsContainer.appendChild(cartItemElement)
    })

    //Mostrando a soma de todos os itens do carrinho no TOTAL
    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"        
    });

    //Mostrar quantos itens tem no carrinho
    cartCounter.innerHTML = cart.length;
}

//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);     
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();

    }
}

//Endereço de entrega
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    //quando começar a escrever na caixa de endereço, ele remove o aviso e a borda vermelha
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

    
})
//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    
//Aviso quando tentar comprar e o restaurante esta fechado
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,          
            close: true,
            gravity: "top", 
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    // Se não digitar o endereço, ele da um aviso em vermelho e a borda da caixa de texto fica vermelha
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar o pedido para a API do Whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "35991614154"

//Utilizando API do Whatsapp
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

//Verificar a hora e manipular o card de horário para mostrar se esta aberto ou fechado
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 11 && hora < 14; //true = Restaurante esta aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

//se estiver aberto, ele remove a cor vermelha e coloca a cor verde
if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
//se estiver fechado ele remove a cor verde e coloca a cor vermelha
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
}