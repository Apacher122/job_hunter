export const formatTitle = (str: string): string => {
    return str
    .replace(/[%#&_]/g, match => ({
        '%': '\\%',
        '#': '\\#',
        '&': '\\&',
        '_': ' '
      }[match] || match))
      .toLowerCase()
      .replace(/\b\w/g, s => s.toUpperCase());
};

const formatText = (text: string): string => {
    return text
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/&/g, '\\&')
};