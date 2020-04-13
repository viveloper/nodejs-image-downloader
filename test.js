var fs = require('fs');

fs.readFile('movies.json', 'utf8', function (err, data) {
  const resData = JSON.parse(data);
  const movies = resData.Movies.Items[0].Items;
  const customMovies = movies
    .filter((movie) => movie.PosterURL.startsWith('http'))
    .map((movie) => {
      return {
        RepresentationMovieCode: movie.RepresentationMovieCode,
        MoviePlayYN: movie.MoviePlayYN,
        MoviePlayEndYN: movie.MoviePlayEndYN,
        MovieNameKR: movie.MovieNameKR,
        MovieNameUS: movie.MovieNameUS,
        MovieName: movie.MovieName,
        PosterURL: `http://localhost:3000/movieImg/${movie.RepresentationMovieCode}.jpg`,
        ViewGradeCode: movie.ViewGradeCode,
        ViewGradeNameKR: movie.ViewGradeNameKR,
        ViewGradeNameUS: movie.ViewGradeNameUS,
        ViewGradeName: movie.ViewGradeName,
        BookingRate: movie.BookingRate,
        ReleaseDate: movie.ReleaseDate,
        DDay: movie.DDay,
        ViewEvaluation: movie.ViewEvaluation,
        ViewRate: movie.ViewRate,
      };
    });
  const jsonMovies = JSON.stringify(customMovies);
  // console.log(jsonMovies);
  fs.writeFile('./customMovies.json', jsonMovies, function (err) {
    if (err) return console.log(err);
    console.log('success');
  });
});
