import TicketDTO from "../services/dao/DTOs/user.dto.js";

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = async () => {
    return this.dao.getAll();
  };
  createTicket = async (ticketData) => {
    return this.dao.createTicket(ticketData);  };
}
