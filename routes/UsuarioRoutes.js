import express from "express";
import { autenticar, registrar } from "../controllers/usuarioController.js";

const router = express.Router();

// Autenticación, Registro y Confirmación de Usuarios
router.post("/", registrar); // Crea un nuevo usuario
router.post('/login', autenticar)

export default router;
