import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

self.addEventListener('message', async event => {
  try {
    const model = await mobilenet.load({
      version: 2,
      alpha: 1,
    });
    const predictions = await model.classify(event.data);

    self.postMessage(predictions);
  } catch (err) {
    self.postMessage(err);
  }
});
