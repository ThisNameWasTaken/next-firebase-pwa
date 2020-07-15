importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet');

// Waiting to receive the OffScreenCanvas
self.onmessage = function (e) {
  console.log('worker', e.data);
  const canvasB = e.data.canvas;
  const imageBitmap = e.data.imageBitmap;
  const ctxWorker = canvasB.getContext('2d');

  ctxWorker.drawImage(imageBitmap, 0, 0);

  mobilenet
    .load()
    .then(model => {
      // Classify the image.
      model
        .classify(canvasB)
        .then(predictions => {
          console.log(predictions);
          self.postMessage({ predictions });
        })
        .catch(console.error);
    })
    .catch(console.error);

  // let counter = 0;

  // startCounting();
  // function startCounting() {
  //   setInterval(function () {
  //     redrawCanvasB();
  //     counter++;
  //   }, 100);
  // }

  // function redrawCanvasB() {
  //   ctxWorker.clearRect(0, 0, canvasB.width, canvasB.height);
  //   ctxWorker.font = '16px Verdana';
  //   ctxWorker.textAlign = 'center';
  //   ctxWorker.fillText(
  //     'Counting: ' + counter,
  //     canvasB.width / 2,
  //     canvasB.height / 2
  //   );
  // }
};
