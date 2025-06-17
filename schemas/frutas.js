const { z } = require('zod')

const frutaSchema = z.object({
    
    id: z.number().int().min(1, 'ID must be at least 1').max(100, 'ID must be at most 100').default(1),
    imagen: z.string().min(1, 'Imagen must be at least 1 character').max(10, 'Imagen must be at most 10 characters'),
    nombre: z.string().min(1, 'Nombre must be at least 1 character').max(10, 'Nombre must be at most 10 characters'),
    precio: z.number().int().min(1, 'Precio must be at least 1').max(10000, 'Precio must be at most 100').default(220)
})
const validarFruta = (fruta) => {
  return frutaSchema.safeParse(fruta)
}

const validarFrutaParcialmente = (fruta) => {
  return frutaSchema.partial().safeParse(fruta)
}

module.exports = {
  validarFruta,
  validarFrutaParcialmente
}

