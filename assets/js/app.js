const allBtnAddToCart = document.querySelectorAll(".btn-add-to-cart")
const allQuantityInput = document.querySelectorAll('.quantity-input')
const allBtnRemoveTocart = document.querySelectorAll('.btn-remove-to-cart')
const allBtnFavorite = document.querySelectorAll('.btn-favorite')

const searchInput = document.querySelector('#prod-search')

allBtnAddToCart.forEach(btn => {
    handleAddtoCartbtn(btn)
})

allQuantityInput.forEach(input => {
    handleQuantityInput(input)
})

allBtnRemoveTocart.forEach(btn => {
    handleRemoveToCardBtn(btn)
})

allBtnFavorite.forEach(btn => {
    btn.addEventListener('click', function (event) {
        const url = '/api/users/favorites/'
        const productId = btn.getAttribute('data-id')
        axiosInstance.post(url, {
            type: 'add_product_to_favorite',
            content: {
                product_id: productId
            }
        }).then(({ data }) => {
            console.log(data)
            console.log(productId + ' is in favorite')
        })
    })
})


function handleCart(cart, update_list = true) {
    document.querySelector('.cart-count').innerHTML = cart.cart_products.length
    const contentList = document.querySelector('.cart-item-list')

    if (update_list) {
        contentList.innerHTML = ''
        cart.cart_products.forEach(product => {
            contentList.innerHTML += `
            <li class="cart-item cart-product-item cart-product-item-${product?.id || 0}" id="product-${product?.id || 0}">
            <div class="item-img">
              <a href="/products/${product.slug}/"><img src="${product?.image_url}"
                  alt="Commodo Blown Lamp"></a>
              <button data-id=${product?.id || 0} class="close-btn btn-remove-to-cart"><i class="fas fa-times"></i></button>     
            </div>
            <div class="item-content">
              <div class="product-rating">
                <span class="icon">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </span>
                <span class="rating-number">(64)</span>
              </div>
              <h3 class="item-title"><a href="/products/${product.slug}/">${product?.name || '-'}</a></h3>
              <div class="item-price product-${product?.id || 0}-total-price"><span class="currency-symbol">$</span>${product?.total_price || '-'}</div>
              <div class="pro-qty item-quantity">
                <input type="number" data-id="${product?.id || 0}" class="quantity-input product-${product?.id || 0}-quantity" value="${product?.quantity || 0}">
              </div>
            </div>
          </li>
                `;
        })
        if (quantityHandler) quantityHandler(`.cart-product-item`)

        updateCart(cart)

        const allQuantityInput = contentList.querySelectorAll('.quantity-input')
        const allBtnRemoveTocart = contentList.querySelectorAll('.btn-remove-to-cart')
        allQuantityInput.forEach(input => {
            handleQuantityInput(input)
        })

        allBtnRemoveTocart.forEach(btn => {
            handleRemoveToCardBtn(btn)
        })
    }
}

function updateCart(cart) {
    document.querySelectorAll(`.cart-total`).forEach(el => {
        el.innerHTML = '$' + cart.total_price
    })
    document.querySelectorAll(`.cart-tax`).forEach(el => {
        el.innerHTML = '$' + cart.tax
    })
    document.querySelectorAll(`.invoice-total`).forEach(el => {
        el.innerHTML = '$' + cart.invoice_total
    })
}

function handleAddtoCartbtn(btn) {
    btn.addEventListener("click", event => {
        console.log("Tu as cliqué pour ajouter un element au panier")

        const url = '/api/cart/' + (getCookie("cart_id") || 0) + '/'
        axiosInstance.post(url, {
            type: 'add_product_to_cart',
            content: {
                product_id: btn.getAttribute('data-id')
            }
        }).then((res) => {
            console.log(res.data)
            handleCart(res.data.content.cart)
        })
    })
    btn.querySelector("a")?.addEventListener("click", event => {
        event.preventDefault()
    })
}

function handleQuantityInput(input) {
    input.addEventListener("input", event => {
        request(event.target.value)
    })

    const request = (value) => {
        console.log("la quantité a changé")

        const url = '/api/cart/' + (getCookie("cart_id") || 0) + '/'
        const productId = input.getAttribute('data-id')
        axiosInstance.post(url, {
            type: 'set_cart_product_quantity',
            content: {
                product_id: productId,
                quantity: value
            }
        }).then(({ data }) => {
            console.log(data)
            document.querySelectorAll(`.product-${productId}-quantity`).forEach(el => {
                el.value = data.content.quantity || value
            })
        })
    }
}

function handleRemoveToCardBtn(btn) {
    btn.addEventListener("click", event => {
        console.log("Suppréssion du produit")
        const productId = btn.getAttribute('data-id')
        const url = '/api/cart/' + (getCookie("cart_id") || 0) + '/'
        axiosInstance.post(url, {
            type: 'remove_product_to_cart',
            content: {
                product_id: productId
            }
        }).then(({ data }) => {
            console.log(data)
            document.querySelectorAll('.cart-product-item-' + productId).forEach((el) => {
                el.remove()
            })
            handleCart(data.content.cart, false)
            updateCart(data.content.cart)
        })
    })
}

/* -------------HANDLE SEARCH--------------- */
searchInput.addEventListener('input', e=>{
    if (e.target.value){
        axiosInstance.get('/api/product_search/?query='+e.target.value).then(({ data }) => {
            console.log(data)
            const  container = document.querySelector('.psearch-results')
            container.innerHTML = ''
            data.products.forEach((product)=>{
                container.innerHTML += `
                <div class="lax-product-list">
                    <div class="thumbnail">
                        <a href="/products/${product.slug}">
                        <img src="${product.image_url}" alt="Yantiti Leather Bags">
                        </a>
                    </div>
                    <div class="product-content">
                        <div class="product-rating">
                        <span class="rating-icon">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fal fa-star"></i>
                        </span>
                        <span class="rating-number"><span>100+</span> Reviews</span>
                        </div>
                        <h6 class="product-title"><a href="/products/${product.slug}">${product.name}</a></h6>
                        <div class="product-price-variant">
                        <span class="price current-price">$${product.price}</span>
                        </div>
                        <div class="product-cart">
                        <a href="#product-${product.id}" class="cart-btn btn-add-to-cart" data-id="${product.id}"><i class="fal fa-shopping-cart"></i></a>
                        <a href="souhait.html" class="cart-btn"><i class="fal fa-heart"></i></a>
                        </div>
                    </div>
                </div>
                ` 
                const allBtnAddToCart = document.querySelectorAll(".btn-add-to-cart")

                allBtnAddToCart.forEach(btn => {
                    handleAddtoCartbtn(btn)
                })
            })
        })
    }
})