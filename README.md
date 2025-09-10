# 🔮 Oráculo de Cartas  

Aplicación interactiva construida en **React + Vite + TailwindCSS** que permite explorar diferentes mazos de cartas (Tarot Egipcio, Tarot Rider-Waite, Baraja Española y Tarot de los Ángeles).  
Los usuarios pueden **filtrar, buscar, girar cartas en 3D** y visualizar sus significados en posición **derecha** o **invertida**.

---

## 🚀 Características

- ✅ Soporta **4 mazos distintos**:
  - Tarot Egipcio de Kier  
  - Tarot Rider-Waite  
  - Baraja Española  
  - Tarot de los Ángeles  
- ✅ Filtrado por **palo** (oros, copas, espadas, bastos).  
- ✅ Búsqueda rápida de cartas por número (ejemplo: `1, 2i, 3, 4i`).  
- ✅ Animación de **cartas giratorias en 3D**.  
- ✅ Hover dinámico para ver palabras clave y significados.  
- ✅ Diseño **responsive y minimalista**.  

---

## 📂 Estructura del Proyecto

```plaintext
.
├── angel_names.txt               # Lista de nombres de cartas de ángeles
├── eslint.config.js              # Configuración de ESLint
├── index.html                    # Entrada HTML de la app
├── package.json                  # Dependencias y scripts
├── package-lock.json
├── public/                       # Archivos estáticos (imágenes, etc.)
│   ├── images/
│   │   ├── arcana_egipcio_kier   # Imágenes del tarot egipcio
│   │   ├── baraja_espanola       # Imágenes de baraja española
│   │   ├── baraja_span           # Variantes de cartas españolas
│   │   ├── cartas_angeles        # Imágenes de cartas de ángeles
│   │   ├── night.gif             # Fondo animado
│   │   ├── stars.gif             # Fondo animado
│   │   └── tarot-rider-waite     # Imágenes del tarot Rider-Waite
│   └── vite.svg
├── README.md                     # Este archivo
├── src/
│   ├── angel_data.json           # Datos del tarot de ángeles
│   ├── App.css
│   ├── App.jsx                   # Componente principal
│   ├── assets/react.svg
│   ├── baraja_espanola_data.json # Datos de la baraja española
│   ├── cartas.json               # Datos del tarot egipcio
│   ├── components/
│   │   └── CartasList.jsx        # Lógica del oráculo (UI de cartas)
│   ├── index.css
│   ├── main.jsx                  # Punto de entrada de React
│   ├── rider.json                # Datos del Rider-Waite
│   └── updateCards.js            # Script de mantenimiento de cartas
├── structure.txt
├── tailwind.config.js            # Configuración de TailwindCSS
└── vite.config.js                # Configuración de Vite
```

---

## ⚙️ Instalación

1. Clona el repositorio:  
   ```bash
   git clone https://github.com/tuusuario/oraculo-cartas.git
   cd oraculo-cartas
   ```

2. Instala dependencias:  
   ```bash
   npm install
   # o
   pnpm install
   # o
   yarn install
   ```

3. Inicia el servidor de desarrollo:  
   ```bash
   npm run dev
   ```

4. Abre en tu navegador:  
   ```
   http://localhost:5173
   ```

---

## 🎴 Uso de la App

- Selecciona un **mazo** desde el menú desplegable.  
- Filtra cartas por **palo** (oros, copas, espadas, bastos).  
- Busca cartas escribiendo sus números:  
  - Ejemplo: `1, 2i, 3`  
  - (`i` = invertida, `d` = derecha por defecto).  
- Haz **clic en una carta** para girarla y ver el reverso.  
- Usa el **hover** para ver palabras clave y significados.  

---

## 🎨 Tecnologías Usadas

- [React](https://reactjs.org/)  
- [Vite](https://vitejs.dev/)  
- [TailwindCSS](https://tailwindcss.com/)  
- Archivos **JSON** para datos de cartas  
- Animaciones CSS (3D Flip)  

---

## 🖼️ Imágenes

Las imágenes están organizadas en `public/images/`:

```plaintext
public/images/
├── arcana_egipcio_kier/
├── baraja_espanola/
├── baraja_span/
├── cartas_angeles/
├── tarot-rider-waite/
├── night.gif
└── stars.gif
```

---

## 📖 Notas

- Si falta una carta, se usa la **imagen del reverso** como fallback.  
- Puedes agregar nuevos mazos extendiendo la constante `DECK_TYPES` y cargando su JSON correspondiente.  

---

## 🧙 Autor

Hecho con 💜 por [Tu Nombre o Usuario]  
