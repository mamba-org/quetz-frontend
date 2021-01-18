export const formatPlural = (count: number, text: string): string =>
  `${count} ${text}${count > 1 ? 's' : ''}`;
