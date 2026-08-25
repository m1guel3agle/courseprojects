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

# Tutorial 05 — Limpieza de código

El Tutorial 05 nos pedía identificar las malas prácticas escondidas en el código y corregirlas. Esto fue lo que encontre y como lo implemente:

## Lo que encontre

- **`formatToCOP` duplicada** en `BooksIndexView.vue` y `BooksShowView.vue`. Cualquier cambio futuro había que hacerlo dos veces.
- **Filtrado con `watch` en lugar de `computed`**. Funcionaba, pero era más código del necesario para algo que Vue resuelve solo con reactividad declarativa.
- **Validación del rating (1-5) en el componente**, no en el servicio. Cualquier otro lugar que llamara a `createReview` podía guardar un rating fuera de rango.
- **`OtherService` con un nombre que no decía nada**. Solo trabajaba con categorías de libros.
- **`getReviews()` sin uso** en `ReviewService`, código muerto.
- **`isSubmitting` que no cumplía su función real**, porque la operación era síncrona y nunca daba tiempo a evitar un doble envío.
- **El formulario de reseñas sin mensaje de éxito**, a diferencia del de creación de libros.

## Como lo mejore

1. Creamos `src/utils/formatters.ts` con una sola versión de `formatToCOP`, y la importamos donde se necesita.
2. Cambiamos el filtrado de libros a un `computed`, eliminando el `watch` y el `ref` intermedio.
3. Movimos el `Math.min(5, Math.max(1, rating))` a `ReviewService.createReview`, para que la regla viva en un solo lugar.
4. Renombramos `OtherService` a `CategoryService`, que refleja lo que realmente hace.
5. Quitamos `getReviews()` por no tener uso.
6. Eliminamos `isSubmitting` y agregamos un mensaje de éxito al publicar una reseña.
7. Tipamos el formulario de reseñas con `Pick<ReviewInterface, ...>` en vez de dejar que TypeScript lo infiriera solo.

## Resultado

Mismo comportamiento para el usuario precios en COP, filtro por categoría, reseñas, pero con menos duplicación, nombres más claros y reglas de negocio en el lugar correcto.
