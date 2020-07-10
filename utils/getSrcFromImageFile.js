export default function getSrcFromImageFile(file) {
  return new Promise((resolve, reject) => {
    const dataUrlWorker = new Worker('/data-url.worker.js');

    function handleWorkerMessage(event) {
      const { src, err } = event.data;
      err ? reject(err) : resolve(src);

      dataUrlWorker.removeEventListener('message', handleWorkerMessage);
      dataUrlWorker.terminate();
    }

    dataUrlWorker.postMessage({ file });
    dataUrlWorker.addEventListener('message', handleWorkerMessage);
  });
}
