import UserDTO from "../services/DTOs/user.dto.js";
import UserService from "../services/dao/mongoDb/users.dao.js";

const usersService = new UserService();

export const renderProfile = async (request, response) => {
  try {
    if (!request.isAuthenticated()) {
      return response.status(401).send("Unauthorized: Usuario no autenticado");
    }

    console.log(request.user.email)
    const email = request.user.email;
    const userFromDatabase = await usersService.getUserByEmail(email);
    const userToRender = new UserDTO(userFromDatabase);

    response.render("profile", {
      title: "Perfil",
      userToRender,
    });
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Internal Server Error");
  }
};
