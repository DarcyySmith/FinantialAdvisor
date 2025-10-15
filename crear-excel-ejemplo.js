// Script para crear un archivo Excel de ejemplo
// Ejecuta: node crear-excel-ejemplo.js

const XLSX = require('xlsx');

// Datos de ejemplo
const datos = [
  { Categoria: 'Comida', Monto: 450.50 },
  { Categoria: 'Comida', Monto: 120.00 },
  { Categoria: 'Transporte', Monto: 180.00 },
  { Categoria: 'Transporte', Monto: 45.00 },
  { Categoria: 'Entretenimiento', Monto: 120.00 },
  { Categoria: 'Servicios', Monto: 250.75 },
  { Categoria: 'Salud', Monto: 95.00 },
  { Categoria: 'Ropa', Monto: 200.00 },
  { Categoria: 'Educación', Monto: 150.00 },
  { Categoria: 'Otros', Monto: 75.25 },
];

// Crear workbook y worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(datos);

// Agregar la hoja al workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos');

// Guardar el archivo
XLSX.writeFile(workbook, 'gastos-ejemplo.xlsx');

console.log('✅ Archivo "gastos-ejemplo.xlsx" creado exitosamente!');
console.log('📊 Total de gastos: $' + datos.reduce((sum, item) => sum + item.Monto, 0).toFixed(2));
console.log('📁 Ahora puedes importar este archivo en la app');
