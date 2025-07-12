# Luz de Fe - Portal Católico de Evangelización

![Luz de Fe](https://img.shields.io/badge/Luz%20de%20Fe-Portal%20Cat%C3%B3lico-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite)

## 📖 Descripción

**Luz de Fe** es un portal católico moderno y completo diseñado para la evangelización, formación espiritual y acompañamiento en la fe. Ofrece contenido diario, recursos de oración, y una comunidad virtual para fortalecer la vida espiritual de los católicos en el mundo digital.

### ✨ Características Principales

- **📖 Evangelio del Día** - Lecturas diarias con reflexiones espirituales
- **👼 Santo del Día** - Biografías y testimonios de santos
- **🙏 Oraciones Católicas** - Colección organizada por categorías
- **✨ Novenas** - Nueve días de oración y reflexión
- **📚 Blog Católico** - Artículos sobre espiritualidad y fe
- **📅 Calendario Litúrgico** - Seguimiento del año litúrgico
- **💝 Peticiones de Oración** - Comunidad de oración virtual
- **🎨 Arte Sacro** - Galería de arte cristiano histórico
- **🌙 Modo Oscuro** - Interfaz adaptable para mejor experiencia
- **📱 Diseño Responsivo** - Optimizado para todos los dispositivos

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript 5.5.3** - Superset tipado de JavaScript
- **Vite 5.4.2** - Herramienta de construcción rápida
- **Tailwind CSS 3.4.1** - Framework de CSS utilitario
- **React Router DOM 6.26.0** - Enrutamiento para aplicaciones React

### Iconografía y UI
- **Lucide React 0.344.0** - Iconos modernos y elegantes
- **Google Fonts** - Tipografías Playfair Display e Inter

### Herramientas de Desarrollo
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos automáticos de CSS

## 🎨 Diseño y Estética

### Paleta de Colores
- **Azul Mariano** (`marian-blue`) - Color principal inspirado en la Virgen María
- **Oro Sagrado** (`sacred-gold`) - Color de acento para elementos importantes
- **Escala de Grises** - Para modo oscuro y elementos neutros

### Tipografía
- **Playfair Display** - Fuente serif para títulos y elementos decorativos
- **Inter** - Fuente sans-serif para texto de cuerpo y UI

### Principios de Diseño
- **Diseño Centrado en el Usuario** - Navegación intuitiva y accesible
- **Estética Católica** - Colores y elementos que reflejan la tradición
- **Responsividad Total** - Experiencia óptima en todos los dispositivos
- **Accesibilidad** - Cumplimiento de estándares WCAG
- **Rendimiento** - Carga rápida y optimización de recursos

## 📁 Estructura del Proyecto

```
luz-de-fe/
├── public/
│   ├── favicon.svg
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Ads/
│   │   │   └── AdBanner.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── Search/
│   │   │   └── SearchModal.tsx
│   │   └── UI/
│   │       ├── Logo.tsx
│   │       └── Newsletter.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── DailyGospel.tsx
│   │   ├── SaintOfTheDay.tsx
│   │   ├── Prayers.tsx
│   │   ├── DailyReadings.tsx
│   │   ├── Novenas.tsx
│   │   ├── Blog.tsx
│   │   ├── BlogPost.tsx
│   │   ├── LiturgicalCalendar.tsx
│   │   ├── PrayerRequests.tsx
│   │   ├── SacredArt.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   └── Cookies.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/luz-de-fe.git
cd luz-de-fe
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Construir para producción**
```bash
npm run build
```

5. **Previsualizar build de producción**
```bash
npm run preview
```

## 📱 Páginas y Funcionalidades

### 🏠 Página Principal
- Hero section con llamadas a la acción
- Cita del día
- Grid de características principales
- Artículos recientes del blog
- Newsletter de suscripción

### 📖 Evangelio del Día
- Lectura del Evangelio diario
- Reflexión espiritual profunda
- Oración del día
- Funciones de compartir
- Navegación entre días

### 👼 Santo del Día
- Biografía del santo del día
- Imagen y datos relevantes
- Historia y legado espiritual
- Oración al santo

### 🙏 Oraciones
- Categorización por temas (familia, salud, trabajo, etc.)
- Buscador de oraciones
- Oraciones tradicionales y contemporáneas
- Funcionalidad de favoritos

### ✨ Novenas
- Novenas tradicionales católicas
- Seguimiento de progreso (9 días)
- Meditaciones diarias
- Intenciones específicas
- Descarga en PDF

### 📚 Blog Católico
- Artículos sobre espiritualidad
- Categorización y etiquetas
- Búsqueda avanzada
- Comentarios y compartir
- Autor y fecha de publicación

### 📅 Calendario Litúrgico
- Año litúrgico completo
- Colores litúrgicos
- Festividades y solemnidades
- Santos del día
- Navegación mensual

### 💝 Peticiones de Oración
- Formulario de peticiones
- Comunidad de oración
- Categorización de intenciones
- Moderación de contenido
- Estadísticas de oraciones

### 🎨 Arte Sacro
- Galería de arte cristiano
- Filtros por época y estilo
- Información histórica
- Funciones de compartir
- Zoom y descarga

## 🔧 Configuración Avanzada

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_APP_NAME=Luz de Fe
VITE_APP_URL=https://luzdefe.com
VITE_CONTACT_EMAIL=contacto@luzdefe.com
VITE_ANALYTICS_ID=your-analytics-id
VITE_ADMIN_EMAIL=admin@luzdefe.com
VITE_ADMIN_PASSWORD=REMOVED_DEMO_PASSWORD
```

### Personalización de Colores
Editar `tailwind.config.js` para personalizar la paleta:

```javascript
theme: {
  extend: {
    colors: {
      'marian-blue': {
        // Personalizar tonos de azul mariano
      },
      'sacred-gold': {
        // Personalizar tonos de oro sagrado
      }
    }
  }
}
```

## 🌐 SEO y Optimización

### Meta Tags
- Títulos descriptivos y únicos
- Meta descriptions optimizadas
- Open Graph para redes sociales
- Twitter Cards
- Canonical URLs

### Rendimiento
- Lazy loading de imágenes
- Code splitting automático
- Compresión de assets
- CDN para recursos estáticos
- Service Worker (PWA ready)

### Accesibilidad
- Navegación por teclado
- Lectores de pantalla
- Contraste de colores WCAG AA
- Texto alternativo en imágenes
- Estructura semántica HTML5

## 📊 Analytics y Monitoreo

### Google Analytics
- Seguimiento de páginas vistas
- Eventos de interacción
- Conversiones de newsletter
- Tiempo en página
- Dispositivos y navegadores

### Métricas Importantes
- Tiempo de carga de página
- Tasa de rebote
- Páginas más visitadas
- Conversiones de oración
- Engagement del blog

## 🔒 Privacidad y Cumplimiento

### GDPR/LOPD
- Política de privacidad completa
- Gestión de cookies
- Consentimiento explícito
- Derecho al olvido
- Portabilidad de datos

### Seguridad
- HTTPS obligatorio
- Sanitización de inputs
- Protección XSS
- CSP headers
- Rate limiting

## 🚀 Despliegue

### Netlify (Recomendado)
```bash
npm run build
# Subir carpeta dist/ a Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### Servidor Propio
```bash
npm run build
# Servir carpeta dist/ con nginx/apache
```

## 🤝 Contribución

### Guías de Contribución
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- ESLint para linting
- Prettier para formateo
- Conventional Commits
- TypeScript estricto
- Componentes funcionales con hooks

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto y Soporte

### Información de Contacto
- **Email**: contacto@luzdefe.com
- **Teléfono**: +34 600 000 000
- **Dirección**: Madrid, España

### Soporte Técnico
- **Issues**: GitHub Issues
- **Documentación**: Wiki del proyecto
- **FAQ**: Sección de ayuda en el sitio

### Redes Sociales
- **Facebook**: @luzdefe
- **Twitter**: @luzdefe
- **Instagram**: @luzdefe
- **YouTube**: @luzdefe

## 🙏 Agradecimientos

Agradecemos a todos los colaboradores, la comunidad católica digital, y especialmente a:

- **Padre Miguel Rodríguez** - Director Espiritual
- **María González** - Coordinadora de Contenido
- **Carlos Martín** - Desarrollador Principal
- **Comunidad de Beta Testers** - Por sus valiosos comentarios

---

**"Vosotros sois la luz del mundo"** - Mateo 5:14

*Desarrollado con ❤️ para la gloria de Dios y el servicio de la Iglesia Católica*