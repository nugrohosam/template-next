export const getMonthName = (monthNumber: number): string | undefined => {
  if (typeof monthNumber !== 'number') {
    return;
  }

  if (monthNumber < 1 || monthNumber > 12) {
    return;
  }

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const currentMonth = monthNames[monthNumber - 1];

  return currentMonth;
};
