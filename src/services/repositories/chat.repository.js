export default class ChatRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createMessage = (mesg) => {
    return chatModel.create(mesg);
  };
  
  getAllMessages = (mesg) => {
    return chatModel.find();
  };
}
