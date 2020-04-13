var fs = require('fs');
var axios = require('axios');
var FormData = require('form-data');

fs.readFile('movies.json', 'utf8', function (err, data) {
  const resData = JSON.parse(data);
  const movies = resData.Movies.Items[0].Items;
  const moviesDetailsDataPromise = movies.reduce(async (promise, movie) => {
    const result = await promise.then();

    const code = movie.RepresentationMovieCode;

    const form = new FormData();

    form.append(
      'paramList',
      `
        {
          "MethodName": "GetMovieDetailTOBE",
          "channelType": "HO",
          "osType": "Chrome",
          "osVersion": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36",
          "multiLanguageID": "KR",
          "representationMovieCode": "${code}",
          "memberOnNo": ""
        }
      `
    );

    // In Node.js environment you need to set boundary in the header field 'Content-Type' by calling method `getHeaders`
    const formHeaders = form.getHeaders();

    const movieDetails = await axios.post(
      'https://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx',
      form,
      {
        headers: {
          ...formHeaders,
        },
      }
    );

    result.push(movieDetails.data);

    return Promise.resolve(result);
  }, Promise.resolve([]));

  moviesDetailsDataPromise.then((moviesDetailsData) => {
    fs.writeFile(
      'moviesDetails.json',
      JSON.stringify(moviesDetailsData),
      (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      }
    );
  });
});
