import { chatModel } from "../../../models/message.model.js";

export default class ChatServiceDao {
  async createMessage(mesg) {
    try {
      return await chatModel.create(mesg);
    } catch (error) {
      throw new Error(`Error creating message: ${error.message}`);
    }
  }

  async getAllMessages(mesg) {
    try {
      return await chatModel.find();
    } catch (error) {
      throw new Error(`Error creating message: ${error.message}`);
    }
  }
}

