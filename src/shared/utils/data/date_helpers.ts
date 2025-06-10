export const getDateToday = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return today.toLocaleDateString('en-US', options);
};