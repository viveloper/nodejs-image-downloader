var fs = require('fs');

fs.readFile('./data/movies.json', 'utf8', function (err, data) {
  const resData = JSON.parse(data);
  const movies = resData.Movies.Items[0].Items;
  // console.log(movies.length);
  const newMovies = [];
  movies.forEach((movie) => {
    fs.readFile('./data/moviesDetail.json', 'utf8', function (err, data) {
      const moviesDetail = JSON.parse(data);
      moviesDetail.forEach((movieDetails) => {
        if (
          movie.RepresentationMovieCode ===
          movieDetails.Movie.RepresentationMovieCode
        ) {
          newMovies.push(movie);
          if (newMovies.length === 79) {
            console.log(newMovies.length);
            resData.Movies.Items[0].Items = newMovies;
            fs.writeFile(
              './data/fixedMovies.json',
              JSON.stringify(resData),
              () => {
                console.log('success');
              }
            );
          }
        }
      });
    });
  });
});
