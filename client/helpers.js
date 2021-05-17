// wrap navigator.geolocation.getCurrentPosition in a
// promise so we use async/await instead of callbacks.
export function getCurrentPositionAsync(options = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}
