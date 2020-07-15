// @ts-ignore
// import TensorFlowWorker from '../workers/tensorflow.worker';

export default function getPredictions(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;

    img.addEventListener('load', async event => {
      const tensorFlowWorker = new Worker('/canvas.worker.js');

      const canvas = document.createElement('canvas');

      canvas.width = img.width;
      canvas.height = img.height;

      const offscreenCanvas = canvas.transferControlToOffscreen();

      tensorFlowWorker.addEventListener('message', event => {
        const { predictions, err } = event.data;

        err ? reject(err) : resolve(predictions);

        tensorFlowWorker.terminate();
      });

      try {
        const imageBitmap = await createImageBitmap(
          img,
          0,
          0,
          img.width,
          img.height
        );

        tensorFlowWorker.postMessage({ canvas: offscreenCanvas, imageBitmap }, [
          offscreenCanvas,
          imageBitmap,
        ]);
      } catch (err) {
        reject(err);
      }
    });
  });
}
