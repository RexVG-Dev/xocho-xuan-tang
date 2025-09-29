export const formatDate = ( date: Date) => {
  const optionMonth: Intl.DateTimeFormatOptions = { month: 'long' };
  const month = date.toLocaleDateString('es-ES', optionMonth);
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
