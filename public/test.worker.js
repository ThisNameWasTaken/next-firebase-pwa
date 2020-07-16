self.addEventListener('message', event => {
  console.log(event);
  self.postMessage('my message from the web worker');
});
