// Estado inicial de la aplicación
// Esta función devuelve el objeto con el estado inicial que usará el reducer
export const initialStore = () => {
  return {
    token: localStorage.getItem("token") || null, // Token JWT persistido en localStorage
    user: null,       // Datos del usuario logueado
    products: [],     // Lista de productos obtenidos de la API
    cart: [],         // Items del carrito del usuario logueado
  }
}

// Función reducer que maneja todos los cambios de estado
// Recibe el estado actual y una acción, devuelve el nuevo estado
export default function storeReducer(store, action = {}) {
  switch (action.type) {

    // ── AUTENTICACIÓN ─────────────────────────────────────────────────────
    case 'set_token':
      // Guarda el token JWT en el store después del login/registro
      return { ...store, token: action.payload }

    case 'set_user':
      // Guarda los datos del usuario en el store después del login/registro
      return { ...store, user: action.payload }

    case 'logout':
      // Limpia el token, usuario y carrito al cerrar sesión
      return { ...store, token: null, user: null, cart: [] }

    // ── PRODUCTOS ─────────────────────────────────────────────────────────
    case 'set_products':
      // Guarda la lista de productos obtenida de la API
      return { ...store, products: action.payload }

    // ── CARRITO ───────────────────────────────────────────────────────────
    case 'set_cart':
      // Guarda los items del carrito obtenidos de la API
      return { ...store, cart: action.payload }

    case 'clear_cart':
      // Vacía el carrito después de un pago exitoso o al cerrar sesión
      return { ...store, cart: [] }

    default:
      throw Error('Acción desconocida: ' + action.type)
  }
}