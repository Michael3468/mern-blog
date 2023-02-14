/**
 * formatDate
 * @param {Date} date
 */
export const formatDate = (date) => {
  const d = new Date(date);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};
