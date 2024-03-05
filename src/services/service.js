import CartsServiceDao from "./dao/mongoDb/carts.dao.js";
import TicketServiceDao from "./dao/mongoDb/tickets.dao.js";
import ProductsServiceDao from "./dao/mongoDb/products.dao.js";
import ChatServiceDao from "./dao/mongoDb/chat.dao.js";
import UsersServiceDao from "./dao/mongoDb/users.dao.js";

import CartRepository from "../repositories/cart.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import ChatRepository from "../repositories/chat.repository.js";
import UsersRepository from "../repositories/users.repository.js";

const cartDao = new CartsServiceDao();
const ticketDao = new TicketServiceDao();
const productsDao = new ProductsServiceDao();
const chatDao = new ChatServiceDao();
const usersDao = new UsersServiceDao();

export const cartService = new CartRepository(cartDao);
export const ticketService = new TicketRepository(ticketDao);
export const productsService = new ProductsRepository(productsDao);
export const chatService = new ChatRepository(chatDao);
export const usersService = new UsersRepository(usersDao);
