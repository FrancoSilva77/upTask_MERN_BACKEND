import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/UsuarioRoutes.js";
import proyectoRoutes from "./routes/ProyectoRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

// Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
