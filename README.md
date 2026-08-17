## Tutorial 02 – Express + TypeScript + EJS (MVC con libros)

### Errores encontrados

1. **`Category` vs `category`** — el modelo define la propiedad con mayúscula pero las vistas la llaman en minúscula, entonces la categoría del libro nunca se muestra (sale `undefined`).

2. **`books.ts` vs `Books.ts`** — la guía dice crear el archivo con mayúscula, pero los imports lo llaman en minúscula. En Linux/Mac esto rompe la importación porque el sistema de archivos sí distingue mayúsculas.

3. **Falta un `import`** — el controlador usaba la variable `books` sin importarla desde `data/books.ts`. No marcaba error al compilar, pero tronaba al correr la app.

4. **Uso de `any` en vez de tipos de Express** — algunos métodos del controlador reciben `req: any` / `res: any` en lugar de `Request` y `Response`, perdiendo el chequeo de tipos que TypeScript debería dar.

5. **Sin manejo de libro no encontrado** — si el libro no existe, `findById` lanza una excepción que nadie captura, y en vez de un 404 amigable la app responde con un error 500 feo. Tampoco se valida que el `id` de la URL sea un número (si mandas `/books/abc` da `NaN` y el comportamiento queda indefinido).

6. **Forma inconsistente de pasar datos a la vista** — un método pasa el objeto `viewData` directo como raíz, mientras los demás lo envuelven en `{ viewData }`. Para que no truene, tuvieron que meter un parche (`if (typeof viewData !== 'undefined')`) en el layout, en vez de arreglar la causa.

### Propuesta de versión mejorada

Mismo tutorial, mismas carpetas, pero corrigiendo consistencia y errores:

- **Modelo:** propiedad `category` en minúscula; `findById` devuelve `undefined` en vez de lanzar excepción.
- **Datos:** archivo siempre en minúscula (`books.ts`), comentado como simulación de base de datos.
- **Controlador:** método renombrado a `mainPoint` (camelCase), tipado correcto con `Request`/`Response`, forma unificada de pasar datos a las vistas (`{ viewData, books }`), y validación del `id` con respuestas 400/404 en vez de un error 500.
- **Rutas:** usar el nombre corregido `mainPoint` y agregar un manejador de rutas no encontradas (404).
- **Vistas:** usar `book.category` en todos lados, quitar el parche `typeof viewData !== 'undefined'`, formatear precios con `.toFixed(2)`, y crear una vista `error.ejs` para los mensajes de error.

### Conclusión

El ejercicio permitió ver cómo errores "silenciosos" de casing (mayúsculas/minúsculas) y de convenciones de nombres pueden pasar desapercibidos en un IDE pero causar fallos reales al correr en sistemas de archivos sensibles a mayúsculas, y cómo la falta de tipado fuerte (`any`) oculta problemas que TypeScript debería atrapar en tiempo de compilación. La versión mejorada no requiere librerías adicionales: basta con aplicar consistencia de nombres, tipado correcto y manejo explícito de casos de error.
