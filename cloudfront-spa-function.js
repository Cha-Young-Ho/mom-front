function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Check if the URI has a file extension
  if (!uri.includes('.')) {
    // If it's a route without extension (like /admin, /gallery, etc.),
    // redirect to index.html
    request.uri = '/index.html';
  }

  return request;
}
