import { chatService } from "../services/service.js";
import chatSocket from "../sockets/chat.socket.js";

export const renderChatLog = (request, response) => {
  response.render("chat", {
    title: "Chat.",
    fileCss: "../css/styles.css",
  });
};

export const sendMessage = async (request, response) => {
  const { user, message } = request.body;
  const mesg = { user, message };

  try {
    await chatService.createMessage(mesg);
    chatSocket.emitAddProduct(mesg);
    response.status(201).json({
      data: {
        message: "Mensaje creado",
      },
    });
  } catch (e) {
    response.status(500).json({
      error: {
        message: e.message,
      },
    });
  }
};
