import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

self.addEventListener('message', async event => {
  try {
    const { canvas, imageBitmap } = event.data;

    const ctxWorker = canvas.getContext('2d');
    ctxWorker.drawImage(imageBitmap, 0, 0);

    const model = await mobilenet.load();

    const predictions = await model.classify(canvas);

    self.postMessage({ predictions });
  } catch (err) {
    self.postMessage({ err });
  }
});
