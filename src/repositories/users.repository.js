export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUserByEmail = (email) => {
    return this.dao.getUserByEmail({ email });
  };
}
