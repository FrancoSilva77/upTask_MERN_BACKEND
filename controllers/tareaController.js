import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;

  const existeProyecto = await Proyecto.findById(proyecto);

  if (!existeProyecto) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }

  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    // Almacenar el id en el proyecto
    existeProyecto.tareas.push(tareaAlmacenada._id);
    await existeProyecto.save();
    return res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id).populate("proyecto");
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no Válida");
      return res.status(403).json({ msg: error.message });
    }

    res.json(tarea);
  } catch (error) {
    error = new Error("La tarea no existe");
    return res.status(404).json({ msg: error.message });
  }
};

const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id).populate("proyecto");
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no Válida");
      return res.status(403).json({ msg: error.message });
    }

    // Actualizar
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
      const tareaAlmacenada = await tarea.save();
      res.json(tareaAlmacenada);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    error = new Error("La tarea no existe");
    return res.status(404).json({ msg: error.message });
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id).populate("proyecto");

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción No Válida");
      return res.status(400).json({ msg: error.message });
    }

    // Eliminar tarea
    try {
      const proyecto = await Proyecto.findById(tarea.proyecto);
      proyecto.tareas.pull(tarea._id);

      await Promise.allSettled([
        await proyecto.save(),
        await tarea.deleteOne(),
      ]);

      res.json({ msg: "La tarea se elimino" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    return res.status(404).json({ msg: "La tarea No Existe" });
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id).populate("proyecto");

    if (
      tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
      !tarea.proyecto.colaboradores.some(
        (colaborador) =>
          colaborador._id.toString() === req.usuario._id.toString()
      )
    ) {
      const error = new Error("Acción No Válida");
      return res.status(400).json({ msg: error.message });
    }

    try {
      tarea.estado = !tarea.estado;
      tarea.completado = req.usuario._id;
      await tarea.save();

      const tareaAlmacenada = await Tarea.findById(id)
        .populate("proyecto")
        .populate("completado");

      res.json(tareaAlmacenada);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    return res.status(404).json({ msg: "La tarea No Existe" });
  }
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
