const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");

function register(req, res) {
  const { firstname, lastname, email, password } = req.body;

  if (!email) res.status(400).send({ msg: "mail es obligatorio" });
  if (!password) res.status(400).send({ msg: "la contraseña es obligatoria" }); // validaciones de usuario

  const user = new User({
    firstname,
    lastname,
    email: email.toLowerCase(),
    role: "user",
    active: false,
  });

  const salt = bcrypt.genSaltSync(10); // necesario para crear la encriptacion de la contraseña
  const hashPassword = bcrypt.hashSync(password, salt); //esta variable encripta la contreseña para que no pase como un texto plano.
  user.password = hashPassword;

  user.save((error, userStorage) => {
    if (error) {
      res
        .status(200)
        .send({ msg: "error al crear usuario o usuario repetido" });
    } else {
      res.status(200).send(userStorage);
    }
  }); // esta ultima funcion sirve para guardar los datos del usuario en la base de datos
}

function login(req, res) {
  const { email, password } = req.body;
  if (!email) res.status(400).send({ msg: "El email es obligatorio" });
  if (!password) res.status(400).send({ msg: "El password es obligatorio" });

  const emailLowerCase = email.toLowerCase();

  User.findOne({ email: emailLowerCase }, (error, userStore) => {
    if (error) {
      res.status(500).send({ msg: "Error del servidor" });
    } else {
      bcrypt.compare(password, userStore.password, (bcryptError, check) => {
        if (bcryptError) {
          res.status(500).send({ msg: "Error del servidor2" });
        } else if (!check) {
          res.status(400).send({ msg: "El password es incorrecto" });
        } else if (!userStore.active) {
          res.status(401).send({ msg: "El Usuario no activo" });
        } else {
          res.status(200).send(
            {
              access: jwt.createAccessToken(userStore),
              refresh: jwt.creareRefreshToken(userStore),
            } // validacion de contraseña
          );
        }
      });
    }
  });
}
function refreshAccessToken(req, res) {
  const { token } = req.body;

  if (!token) res.status(400).send({ msg: "token requerido" });
  const { user_id } = jwt.decoded(token);

  User.findOne({ _id: user_id }, (error, userStorage) => {
    if (error) {
      res.status(500).send({ msg: "Error del servidor" });
    } else {
      res.status(200).send({ accessToken: jwt.createAccessToken(userStorage) });
    }
  }); // refresca el token para que tenga mas duracions
}

module.exports = {
  register,
  login,
  refreshAccessToken,
};
