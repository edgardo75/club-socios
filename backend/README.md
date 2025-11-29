# Backend - Club de Socios

API REST para la gestión de socios del club.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env
```

## 📝 Scripts

```bash
# Desarrollo (con hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

## 🔌 Endpoints

### Socios

- `GET /api/socios` - Obtener todos los socios
- `GET /api/socios?search=query` - Buscar socios por nombre, apellido o DNI
- `GET /api/socios/:dni` - Obtener un socio por DNI
- `POST /api/socios` - Crear un nuevo socio
- `PUT /api/socios/:dni` - Actualizar un socio
- `DELETE /api/socios/:dni` - Eliminar un socio

### Validación de Carnet ⭐

- `GET /api/validacion/:dni` - Validar carnet de un socio (para el portero)

Este endpoint retorna:
- `estado`: "VERDE" o "ROJO"
- `socio`: Información del socio (incluyendo foto)
- `razones`: Array con las razones si es ROJO (ej: "Falta pago", "Falta revisión médica")
- `ultimoPago`: Información del último pago
- `proximaRevisionMedica`: Fecha de próxima revisión médica requerida

### Pagos

- `GET /api/pagos` - Obtener todos los pagos
- `GET /api/pagos/socio/:dni` - Obtener pagos de un socio
- `POST /api/pagos` - Crear un nuevo pago
- `DELETE /api/pagos/:id` - Eliminar un pago

### Ejemplo de creación de socio

```json
POST /api/socios
{
  "dni": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "fechaNacimiento": "1990-01-01",
  "direccion": "Calle 123",
  "estado": "activo",
  "foto": "https://ejemplo.com/foto.jpg",
  "ultimaRevisionMedica": "2024-01-15",
  "proximaRevisionMedica": "2025-01-15"
}
```

### Ejemplo de validación de carnet

```bash
GET /api/validacion/12345678
```

Respuesta si es VERDE:
```json
{
  "valido": true,
  "estado": "VERDE",
  "socio": {
    "dni": "12345678",
    "nombre": "Juan",
    "apellido": "Pérez",
    "foto": "https://ejemplo.com/foto.jpg",
    "numeroSocio": "SOC-000001"
  },
  "razones": [],
  "ultimoPago": {
    "mes": "2024-12",
    "fecha": "2024-12-01T10:00:00.000Z"
  }
}
```

Respuesta si es ROJO:
```json
{
  "valido": false,
  "estado": "ROJO",
  "socio": {
    "dni": "12345678",
    "nombre": "Juan",
    "apellido": "Pérez",
    "foto": "https://ejemplo.com/foto.jpg",
    "numeroSocio": "SOC-000001"
  },
  "razones": [
    "Falta pago",
    "Falta revisión médica"
  ]
}
```

### Ejemplo de creación de pago

```json
POST /api/pagos
{
  "socioDni": "12345678",
  "monto": 5000,
  "mes": "2024-12",
  "concepto": "Cuota mensual",
  "metodoPago": "efectivo"
}
```

## 📋 Estructura del Proyecto

```
backend/
├── src/
│   ├── types/
│   │   ├── socio.ts          # Tipos e interfaces de socios
│   │   ├── pago.ts           # Tipos e interfaces de pagos
│   │   └── validacion.ts     # Tipos de validación
│   ├── services/
│   │   ├── socios.service.ts    # Lógica de negocio de socios
│   │   ├── pagos.service.ts     # Lógica de negocio de pagos
│   │   └── validacion.service.ts # Lógica de validación de carnets
│   ├── routes/
│   │   ├── socios.routes.ts     # Rutas de socios
│   │   ├── pagos.routes.ts      # Rutas de pagos
│   │   └── validacion.routes.ts # Rutas de validación
│   └── index.ts              # Punto de entrada
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Funcionalidades Implementadas

✅ CRUD completo de socios
✅ Gestión de pagos
✅ Validación de carnets (VERDE/ROJO)
✅ Verificación de pagos al día
✅ Verificación de revisión médica vigente
✅ Endpoint para portero con información completa

## 🔄 Próximos Pasos

- [ ] Integrar base de datos (MongoDB, PostgreSQL, etc.)
- [ ] Agregar autenticación y autorización
- [ ] Implementar validación con Zod
- [ ] Agregar tests
- [ ] Integrar con lector de códigos QR/NFC
- [ ] Agregar historial de validaciones

