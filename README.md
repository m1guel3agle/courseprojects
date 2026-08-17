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

## Tutorial 04 – SPA/CSR con Vue.js (interfaces, servicios, Pinia y LocalStorage)

### ¿Encuentra ventajas versus la versión anterior? (Parte B)

Sí. Antes, en la Parte A, la vista `BooksIndexView.vue` importaba `books` directamente desde `data/books.ts`, es decir, la vista sabía exactamente de dónde venían los datos y cómo estaban estructurados. Con la capa de servicios, la vista ya no le importa el origen de los datos: solo le pide a `BookService.getBooks()` que se los dé. Esto trae varias ventajas, como el desacoplamiento entre la vista y el origen de los datos por ejemplo si mañana cambio de dónde vienen los libros, solo modifico `BookService.ts` sin tocar las vistas, la reutilización de esa misma lógica de acceso a datos en varias vistas, y una organización más limpia que separa cómo obtengo los datos de cómo los muestro.

### ¿Puede entender la diferencia entre esta versión y la anterior? (Parte C)

Sí, la diferencia principal está en la persistencia de los datos. En la versión anterior, los libros vivían solo en memoria dentro de un array de TypeScript, así que cada vez que recargaba la página los datos volvían a su estado original y cualquier libro que creara se perdía. Con esta version los datos viven en un store de Pinia que se sincroniza automáticamente con el LocalStorage del navegador, de modo que si creo un libro, recargo la página o cierro y vuelvo a abrir el navegador, el libro sigue ahí porque queda guardado bajo la key `piniaState`.
