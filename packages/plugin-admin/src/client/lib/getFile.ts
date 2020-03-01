export const getFile = (callback: (file: File) => any) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.addEventListener('change', () => {
    if (input.files) callback(input.files[0]);
  });
  input.click();
};
