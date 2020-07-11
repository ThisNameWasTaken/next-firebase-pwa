export function delayCallback(callback, delay) {
  const start = performance.now();
  const rafRef = {};

  function _loop() {
    const deltaTime = performance.now() - start;

    if (deltaTime >= delay) {
      callback();
    } else {
      rafRef.current = requestAnimationFrame(_loop);
    }
  }

  rafRef.current = requestAnimationFrame(_loop);

  return rafRef;
}

export function cancelDelayCallback(rafRef) {
  cancelAnimationFrame(rafRef.current);
}
