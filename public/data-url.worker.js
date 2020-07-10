self.addEventListener('message', event => {
  const { file } = event.data;

  try {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener('load', event => {
      const src = event.target.result;

      self.postMessage({ src });
    });
  } catch (err) {
    self.postMessage({ err });
  }
});
