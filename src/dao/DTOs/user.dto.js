class UserDTO {
  constructor(user) {
    this.full_name = `${user.first_name}  ${user.last_name}`;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.active = true;
    this.email = user.email;
    this.rol = user.rol;
  }
}

module.exports = UserDTO;
