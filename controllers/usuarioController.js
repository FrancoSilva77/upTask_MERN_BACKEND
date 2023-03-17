import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/generarId.js";

const registrar = async (req, res) => {
  // Evitar registros dupicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("usuario ya Registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();

    res.json(usuarioAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar que el usuario esté confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido Confirmada");
    return res.status(404).json({ msg: error.message });
  }

  // Comparar Password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(404).json({ msg: error.message });
  }
};

export { registrar, autenticar };
