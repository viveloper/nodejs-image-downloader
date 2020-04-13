var http = require('http');
var fs = require('fs');

var download = function (url, dest, cb) {
  const fileName = dest.split('/')[dest.split('/').length - 1];
  const directoryPath = dest.replace(fileName, '');
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  console.log(url, dest);
  var file = fs.createWriteStream(dest);
  http
    .get(url, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on('error', function (err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
};

fs.readFile('movies.json', 'utf8', function (err, data) {
  const resData = JSON.parse(data);
  const movies = resData.Movies.Items[0].Items;
  movies.forEach((movie) => {
    if (movie.PosterURL.startsWith('http')) {
      const url = movie.PosterURL;
      const detailPath = url.split('/MovieImg/')[1];
      const path = `./img/MovieImg/${detailPath}`;
      download(url, path);
    }
  });
});
