// Formateador de moneda oficial para República Dominicana (Pesos Dominicanos - RD$)
export function formatPrice(amount) {
  if (amount === null || amount === undefined || amount === '') return 'RD$ 0';
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `RD$ ${num.toLocaleString('es-DO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

export function formatPriceWithDecimals(amount) {
  if (amount === null || amount === undefined || amount === '') return 'RD$ 0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `RD$ ${num.toLocaleString('es-DO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
