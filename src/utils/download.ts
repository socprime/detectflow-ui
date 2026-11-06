export const downloadFile = (data: string, filename: string, type: 'csv' | 'yaml') => {
  const blob = new Blob([data], { type: type === 'csv' ? 'text/csv' : 'text/yaml' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `${filename}.${type}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
