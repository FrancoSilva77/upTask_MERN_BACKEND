import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información Email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <uptask@uptask.com>',
    to: email,
    subject: "UpTask - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: ` <p> <strong>Hola ${nombre}</strong>  Comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya casi lista, solo debes comprobarla en el siguiente enlace</p>

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>


<p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `,
  });
};

const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información Email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <uptask@uptask.com>',
    to: email,
    subject: "UpTask - Reestablece tu contraseña",
    text: "Comprueba tu cuenta en UpTask",
    html: ` <p> <strong>Hola ${nombre}</strong>  has solicitado reestablecer tu contraseña</p>
    <p>Sigue el siguiente enlace</p>

    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a>


    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    `,
  });
};

export { emailRegistro, emailOlvidePassword };
