import { cartService, ticketService } from "../services/service.js";
import { productsService } from "../services/service.js";

export const getNewCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.json({ newCartId: newCart._id });
  } catch (error) {
    console.error("Error creating a new cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const cartsToRender = await cartService.getAllCarts();
    console.log(cartsToRender);

    const cartIds = cartsToRender.map(cart => cart._id);

    res.json({ cartIds });
  } catch (error) {
    console.error("Error getting all carts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }}

export const renderCart = async (req, res) => {
  try {
    const cartToRender = await cartService.getCartById(req.params.cid);
    console.log(cartToRender);

    res.render("cart", {
      title: "Carrito",
      cartToRender,
    })

  } catch (error) {
    console.error("Error getting the cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cartWithProducts = await cartService.getProductsFromCart(cid);

    res.json(cartWithProducts);
    console.log(cartWithProducts);
  } catch (error) {
    console.error("Error getting cart with products:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const deleteCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const deletedCart = await cartService.getCartById(cid);
    deletedCart.products = [];

    let updatedCart = await cartService.updateCart(cid, deletedCart);
    res.json(updatedCart);
    console.log(updatedCart);
  } catch (error) {
    console.error("Error getting cart with products:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const productId = pid;
    const quantity = req.body.quantity;
    const cartId = cid;

    const cart = await cartService.getCartById(cartId);

    if (cart) {
      const product = await productsService.getProductById(productId);

      if (product) {
        const index = cart.products.findIndex((item) =>
          item.product.equals(productId)
        );

        if (index !== 1) {
          cart.products[index].quantity -= 1;
        } else {
          cart.products.splice(index, 1);
        }

        const response = await cartService.updateCart(cartId, cart);

        res.status(200).json({ response: "OK", message: response });
      } else {
        res.status(404).json({ error: "Product not found." });
      }
    } else {
      res.status(404).json({ error: "Cart not found." });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const productId = pid;
    const quantity = req.body.quantity;
    const cartId = cid;

    const cart = await cartService.getCartById(cartId);

    if (cart) {
      const product = await productsService.getProductById(productId);

      if (product) {
        const index = cart.products.findIndex((item) =>
          item.product.equals(productId)
        );

        if (index !== -1) {
          cart.products[index].quantity += 1;
        } else {
          cart.products.push({ product: productId, quantity: quantity });
        }

        const response = await cartService.updateCart(cartId, cart);

        res.status(200).json({ response: "OK", message: response });
      } else {
        res.status(404).json({ error: "Product not found." });
      }
    } else {
      res.status(404).json({ error: "Cart not found." });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const modifyProductQuantityToCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartService.getCartById(cid);
    const products = req.body;

    products.forEach((e) => {
      const index = cart.products.findIndex((item) => item.product.equals(cid));
      if (index != -1) {
        cart.products[index].quantity += e.quantity;
      } else {
        cart.products.push({ product: e._id, quantity: e.quantity });
      }
    });
  } catch (error) {
    console.error("Error modifiying products in cart:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const modifyProductOnCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartService.getCartById(cid);
    const product = await productsService.getProductById(pid);

    const index = cart.products.findIndex((item) => item.product.equals(pid));

    if (index !== -1) {
      cart.products[index].quantity += req.body.quantity;
    } else {
      cart.products.push({ product: pid, quantity: req.body.quantity });
    }

    const updatedCart = await cartService.updateCart(cid, cart);

    res.status(200).json({ response: "OK", cart: updatedCart });
  } catch (error) {
    console.error("Error modifying products in cart:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const finishPurchase = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.getCartById(cartId);
    console.log(req.token)

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    let finalAmount = 0;
    let productsWithStock = [];
    let newTicket; 

    for (const item of cart.products) {
      try {
        const product = await productsService.getProductById(item.product);

        // Verificar stock
        if (product && product.stock >= item.quantity) {
          finalAmount += item.quantity * product.price;

          // Actualizar stock
          await productsService.updateProduct(item.product, {
            stock: product.stock - item.quantity,
          });

          // Agregar el producto con stock a la lista
          productsWithStock.push({
            product: product._id,
            quantity: item.quantity,
          });
        } else {
          console.warn(
            `Product with ID ${item.product} does not have enough stock and will remain in the cart.`
          );
        }
      } catch (error) {
        console.error("Error processing product:", error);
      }
    }

    cart.finalAmount = finalAmount;
    cart.products = productsWithStock; // Actualizar la lista de productos en el carrito

    await cartService.updateCart(cartId, cart);

    const userEmail = req.user.email;

    // Crear un ticket solo si hay productos con stock
    if (productsWithStock.length > 0) {
      newTicket = await ticketService.createTicket({
        code: `${req.params.cid}_${Date.now()}`,
        amount: finalAmount,
        purchaser: userEmail,
      });
    }

    res.json({
      message: "Purchase completed successfully.",
      finalAmount,
      newTicket,
    });
  } catch (error) {
    console.error("Error finishing purchase:", error);
    console.log(req.user)

    res.status(500).json({ error: "Internal Server Error." });
  }
};
