export default function getSrcFromImageFile(file) {
  const appPrefix = 'chatr-inlined-image-sources';
  const fileName = `${appPrefix}-${file.name}-${file.lastModified}`;

  const storedSrc = localStorage.getItem(fileName);

  if (storedSrc) return Promise.resolve(storedSrc);

  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.addEventListener('load', event => {
        const src = event.target.result;
        localStorage.setItem(fileName, src);
        resolve(src);
      });
    } catch (err) {
      reject(err);
    }
  });
}
