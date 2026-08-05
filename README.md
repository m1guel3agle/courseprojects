# Tutorial 02 – Express + TypeScript + EJS (MVC con libros)

## ¿Puede detectar los más de 10 errores que hemos introducido en el código de este tutorial?

Durante el desarrollo del tutorial fui llevando un registro de las inconsistencias y errores que encontré, tanto los que me generaron fallos reales al correr la aplicación como los que son silenciosos que no rompen el programa, pero son malas prácticas o producen resultados incorrectos, aqui estan los 10 errores que encontre:

1. **Inconsistencia de mayúsculas en la propiedad `Category`/`category`.** El modelo `Book` define la propiedad como `Category` (con mayúscula inicial), pero las vistas `books.ejs` y `show.ejs` (en el párrafo descriptivo) la referencian como `book.category` (minúscula). Como JavaScript/TypeScript es *case-sensitive*, esto no lanza error, pero la categoría del libro nunca se muestra en esos lugares (aparece como `undefined`).

2. **Inconsistencia de mayúsculas en el nombre del archivo `books.ts`/`Books.ts`.** La guía indica crear el archivo como `Books.ts` (mayúscula), pero los `import` posteriores usan `'../data/books.js'` (minúscula). En sistemas de archivos sensibles a mayúsculas (Linux/Mac) esto rompe la importación con un error de "módulo no encontrado".

3. **Nombre de método `Main_Point` fuera de convención.** No sigue camelCase (lo esperado sería `mainPoint`), incluye guion bajo y mayúscula inicial, algo inusual en el estándar de TypeScript/JavaScript.

4. **Tipado débil con `any` en los controladores.** Los métodos `Main_Point` y `show` reciben `res: any` (y en `show`, también `req: any`), en vez de usar los tipos `Request` y `Response` de Express que sí se usan correctamente en `index` y `about`. Esto elimina el autocompletado y la verificación de tipos que TypeScript debería ofrecer.

5. **Import faltante en el controlador (el error original que me hizo fallar `/main-point`).** El archivo `HomeController.ts` usaba la variable `books` sin haberla importado desde `data/books.ts`. Esto no daba un error de compilación evidente en el momento, pero rompía el proceso en ejecución.

6. **Forma inconsistente de pasar datos a la vista.** `Main_Point` llama a `res.render('home/books', viewData)`, pasando el objeto `viewData` completo como *locals* (con `books` como una de sus llaves), en lugar de seguir el patrón `res.render('home/about', { viewData: viewData })` que usan `index` y `about`. Esto obliga a agregar un parche defensivo (`<% if (typeof viewData !== 'undefined') { %>`) en el layout `app.ejs` para que no truene cuando `viewData` llega indefinido.

7. **Sin manejo de error cuando el libro no existe.** `Book.findById` lanza una excepción (`throw new Error(...)`) si no encuentra el libro, pero el controlador `show` no la captura con `try/catch`. Si alguien visita `/books/999`, la aplicación responde con un error 500 feo en vez de un 404 amigable.

8. **Sin validación del parámetro `id`.** `parseInt(req.params.id)` no valida que el resultado sea un número válido. Si se visita `/books/abc`, `parseInt` devuelve `NaN`, y el comportamiento posterior queda indefinido en vez de responder con un error controlado.

9. **Imagen de portada idéntica y hardcodeada para todos los libros.** Tanto en `books.ejs` como en `show.ejs`, la imagen usa siempre la misma URL fija (`https://picsum.photos/seed/picsum/536/354`), sin relación con el libro mostrado — debería depender del `id` o algún campo propio del libro.

10. **Formato de precio poco confiable.** `book.price.toLocaleString()` no fuerza dos decimales ni una configuración regional explícita, por lo que precios como `45.00` pueden mostrarse como `45` en vez de `$45.00`, dando una presentación inconsistente entre libros.

11. **Datos "hardcodeados" directamente en el código fuente.** El archivo `books.ts` simula una base de datos con un arreglo fijo dentro del propio código fuente, sin ninguna capa de abstracción (repositorio/servicio) que separe el acceso a datos de la lógica del controlador. Esto dificulta escalar hacia una base de datos real más adelante.

12. **Sin ruta ni vista para manejar URLs no encontradas (404 genérico).** La aplicación no define un manejador para rutas que no existan, por lo que cualquier URL fuera de las definidas cae en el comportamiento por defecto de Express, en vez de una página de error controlada y consistente con el diseño del sitio.

---

## Propuesta de versión mejorada 

La idea es mantener la misma estructura de carpetas del tutorial (`models`, `data`, `controllers`, `routes`, `views`), pero corrigiendo la organización y consistencia del código:

### 1. Modelo (`src/models/Book.ts`)
- Renombrar la propiedad a `category` (minúscula), consistente con el resto de propiedades (`title`, `price`, `stock`).
- Que `findById` devuelva `Book | undefined` en vez de lanzar una excepción, dejando que sea el controlador quien decida cómo responder ante un libro no encontrado.

### 2. Datos (`src/data/books.ts`)
- Mantener el nombre de archivo siempre en minúscula, consistente con los `import`.
- Documentar con un comentario que este archivo simula una base de datos y debería reemplazarse por una consulta real más adelante.

### 3. Controlador (`src/controllers/HomeController.ts`)
- Renombrar `Main_Point` a `mainPoint`, siguiendo camelCase como el resto de métodos.
- Tipar correctamente todos los métodos con `Request` y `Response` de Express.
- Unificar la forma de pasar datos a las vistas: siempre `res.render('vista', { viewData, books })`, nunca pasando `viewData` como el objeto raíz.
- En `show`, validar el `id`:
  ```typescript
  static show(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).render('home/error', { viewData: { title: 'Solicitud inválida' } });
      return;
    }
    const book = Book.findById(books, id);
    if (!book) {
      res.status(404).render('home/error', { viewData: { title: 'Libro no encontrado' } });
      return;
    }
    res.render('home/show', { viewData: { title: book.title }, book });
  }
  ```

### 4. Rutas (`src/routes/Routes.ts`)
- Usar `HomeController.mainPoint` en vez de `HomeController.Main_Point`.
- Agregar un manejador final para rutas no encontradas (`router.use(...)`) que renderice una vista de error 404 simple.

### 5. Vistas (`src/views/home/*.ejs`)
- Usar siempre `book.category` (ya consistente con el modelo corregido).
- Quitar el parche `typeof viewData !== 'undefined'` de `app.ejs`, ya que con el render unificado siempre llegará un `viewData` definido.
- Formatear el precio con dos decimales fijos, por ejemplo: `book.price.toFixed(2)`.
- Crear una vista simple `error.ejs` para mostrar mensajes 400/404 con el mismo layout del resto del sitio.

---

## Conclusión

El ejercicio permitió ver cómo errores "silenciosos" de casing (mayúsculas/minúsculas) y de convenciones de nombres pueden pasar desapercibidos en un IDE pero causar fallos reales al correr en sistemas de archivos sensibles a mayúsculas, y cómo la falta de tipado fuerte (`any`) oculta problemas que TypeScript debería atrapar en tiempo de compilación. La versión mejorada no requiere librerías adicionales: basta con aplicar consistencia de nombres, tipado correcto y manejo explícito de casos de error.
