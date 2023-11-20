function getGenreByValue(value) {
    var options = [
        { value: "", text: "--Genres--" },
        { value: 28, text: "Action" },
        { value: 12, text: "Adventure" },
        { value: 16, text: "Animation" },
        { value: 35, text: "Comedy" },
        { value: 80, text: "Crime" },
        { value: 99, text: "Documentary" },
        { value: 18, text: "Drama" },
        { value:10751, text: "Family" },
        { value: 14, text: "Fantasy" },
        { value: 36, text: "History" },
        { value: 27, text: "Horror" },
        { value: 10402, text: "Music" },
        { value: 9648, text: "Mystery" },
        { value: 10749, text: "Romance" },
        { value: 878, text: "Science Fiction" },
        { value: 10770, text: "TV Movie" },
        { value: 53, text: "Thriller" },
        { value: 10752, text: "War" },
        { value: 37, text: "Western" }
    ]

    for (var i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            return options[i].text;
        }
    }
}

let pageNumber = 1

function getRandomGenreAndRating() {
    var genreOptions = [
        { value: "", text: "--Genres--" },
        { value: 28, text: "Action" },
        { value: 12, text: "Adventure" },
        { value: 16, text: "Animation" },
        { value: 35, text: "Comedy" },
        { value: 80, text: "Crime" },
        { value: 99, text: "Documentary" },
        { value: 18, text: "Drama" },
        { value:10751, text: "Family" },
        { value: 14, text: "Fantasy" },
        { value: 36, text: "History" },
        { value: 27, text: "Horror" },
        { value: 10402, text: "Music" },
        { value: 9648, text: "Mystery" },
        { value: 10749, text: "Romance" },
        { value: 878, text: "Science Fiction" },
        { value: 10770, text: "TV Movie" },
        { value: 53, text: "Thriller" },
        { value: 10752, text: "War" },
        { value: 37, text: "Western" }
    ]

    var ratingOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    const randomGenreIndex = Math.floor(Math.random() * genreOptions.length)
    const randomRatingIndex = Math.floor(Math.random() * ratingOptions.length)

    return {
        genre: genreOptions[randomGenreIndex].value,
        rating: ratingOptions[randomRatingIndex]
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const { genre: randomGenreId, rating: randomRating } = getRandomGenreAndRating()

    fetchMovies(randomGenreId, 'en', randomRating)
})

const form = document.querySelector("form")
const main = document.querySelector("main")
const showMoreButton = document.querySelector('.show-more-button');

form.addEventListener("submit", (event) => {
    event.preventDefault() 
    main.innerHTML = ""

    const genreSelect = event.target.elements["genre"]
    const languageSelect = event.target.elements["language-sel"]
    const ratingInput = event.target.elements["rating-input"]

    const genreId = genreSelect.value
    const originalLanguage = languageSelect.value
    const userRating = ratingInput.value
    
    const divError = document.querySelector("#error-message")
    if (!genreId || !userRating || !originalLanguage){
        divError.style.display= "block"
    } else {
        divError.style.display= "none"
        fetchMovies(genreId, originalLanguage, userRating)
    }
})

showMoreButton.addEventListener("click", () => {
    const genreSelect = form.elements["genre"]
    const languageSelect = form.elements["language-sel"]
    const ratingInput = form.elements["rating-input"]

    const genreId = genreSelect.value
    const originalLanguage = languageSelect.value
    const userRating = ratingInput.value

    fetchMovies(genreId, originalLanguage, userRating, pageNumber)
    pageNumber++
})


function displayMovies(movieList) {

    movieList.forEach(movieInfo => {
        const article = document.createElement("article")
        article.classList.add("movie")

        const { title, genre_ids, original_language, vote_average, overview, poster_path} = movieInfo
        
        const genreList = []

        genre_ids.forEach((genre) => {
            genreList.push(getGenreByValue(genre))
        })

        article.innerHTML = `<h2><strong>${title}</strong></h2>
        <img class="poster" src="https://image.tmdb.org/t/p/original${poster_path}" alt="">
            <p><strong>Original Language:</strong> ${original_language}</p>
            <p><strong>User's Rating:</strong> ${vote_average}</p>
            <p><strong>Genre:</strong> ${genreList}</p>
            <p >Description: ${overview}</p>`

        main.appendChild(article)
    })
    showMoreButton.style.visibility = "visible"
}

function fetchMovies(genreId, originalLanguage, userRating) {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=${originalLanguage}&page=${pageNumber}&sort_by=popularity.desc&vote_average.gte=${userRating}&with_genres=${genreId}`

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${READACCESS}`
        }
    })
    .then(res => res.json())
    .then(json => {
        if (json.results && json.results.length > 0) {
            displayMovies(json.results.splice(0,9))
        } else {
            console.error('No movie data found.')
        }
    })
 .catch(err => alert(`There was an issue accessing the API! 🙀 \n ${err}`))
}


