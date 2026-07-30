import bcrypt from "bcryptjs";

class AuthService {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hash: string
  ) {
    return bcrypt.compare(password, hash);
  }
}

export default new AuthService();