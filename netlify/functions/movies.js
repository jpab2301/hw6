// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined || year==``|| genre==``) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please enter a year and a genre as querystring parameters` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    for (let i=0; i < moviesFromCsv.length; i++) {
      // store each listing in memory
      let moviesTemp= moviesFromCsv [i]
        // check if the movies from CSV match the specified criteria
      if (year==moviesTemp.startYear && moviesTemp.genres.includes(genre) && moviesTemp.genres!=`\\N` && moviesTemp.runtime!=`\\N`){
      // create object for the wanted criteria
    let movieObject={
      title: moviesTemp.primaryTitle,
      year: moviesTemp.startYear,
      genre: moviesTemp.genres
       }
        // add the movie to the selection
        returnValue.movies.push(movieObject)
        // increase count by one
        returnValue.numResults=returnValue.numResults+1
      }

    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}