var http = require('http');
var fs = require('fs');

var download = function (url, dest, cb) {
  return new Promise((resolve, reject) => {
    const fileName = dest.split('/')[dest.split('/').length - 1];
    const directoryPath = dest.replace(fileName, '');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }
    var file = fs.createWriteStream(dest);
    http
      .get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
          file.close(cb); // close() is async, call cb after close completes.
          resolve('complete');
        });
      })
      .on('error', function (err) {
        // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
        reject('failed');
      });
  });
};

fs.readFile('./data/moviesDetail.json', 'utf8', async function (err, data) {
  const moviesDetail = JSON.parse(data);

  // let cnt = 0;
  // moviesDetail.forEach((movieDetails) => {
  //   movieDetails.Trailer.Items.forEach((item) => {
  //     if (item.MediaURL.startsWith('http')) {
  //       const url = item.MediaURL;
  //       const detailPath = url.split('/MovieMedia/')[1];
  //       const path = `./img/MovieMedia/${detailPath}`;
  //       cnt++;
  //       console.log(cnt);
  //     }
  //   });
  // });

  // moviesDetail.forEach((movieDetails) => {
  //   movieDetails.Trailer.Items.forEach((item) => {
  //     if (item.MediaURL.startsWith('http')) {
  //       const url = item.MediaURL;
  //       const detailPath = url.split('/MovieMedia/')[1];
  //       const path = `./img/MovieMedia/${detailPath}`;
  //       download(url, path);
  //     }
  //   });
  // });

  let cnt = 0;
  for (let i = 0; i < moviesDetail.length; i++) {
    const movieDetails = moviesDetail[i];
    for (let j = 0; j < movieDetails.Trailer.Items.length; j++) {
      const item = movieDetails.Trailer.Items[j];
      if (item.MediaURL.startsWith('http')) {
        const url = item.MediaURL;
        const detailPath = url.split('/MovieMedia/')[1];
        const path = `./img/MovieMedia/${detailPath}`;
        cnt++;
        if (cnt < 90) {
          console.log(`${cnt} files skip!`);
          continue;
        }
        try {
          await download(url, path);
          console.log(url, path, cnt);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
});
