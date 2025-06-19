const express = require("express")
const app = express()
const cors = require("cors")

const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");
const Movie = require("./models/movies.models");

app.use(express.json())//MIddleware

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions))

initializeDatabase();

const jsonData = fs.readFileSync('movies.json', 'utf-8');
const moviesData = JSON.parse(jsonData);

// const newMovie = {
//     title: "New Movie",
//     releaseYear: "2025",
//     genre: ["Drama"],
//     director: "Aditya Roy Chopra",
//     actors: ["Actor1", "Actor2"],
//     language: "Hindi",
//     country: "India",
//     rating: 6.1,
//     plot: "A young man and woman fall in love on a Europe trip.",
//     awards: "IFA Filmfare Awards",
//     posterUrl: "https://example.com/poster1.jpg",
//     trailerUrl: "https://example.com/trailer1.mp4"
// };

//BE4.2_CW
async function createMovie(newMovie) {
    try {
        const movie = new Movie(newMovie);
        const savedMovie = await movie.save();
        return savedMovie
    } catch (error) {
        console.error("Error saving movie:", error);
    }
}

//createMovie(newMovie);

app.post("/movies", async (req,res) => {
    try{
      const savedMovie = await createMovie(req.body)
      res.status(201).json({message: "Movie added sucessfully.", movie: savedMovie})

    }catch (error){
        res.status(500).json({error: "Failed to add movie"})
    }
})


//find a movie with a particular title

async function readMOvieByTitle(movieTitle){
    try {
       const movie = await Movie.findOne({title: movieTitle})
       return movie
    } catch(error){
        throw error
    }
}

app.get("/index/:title", async(req,res) => {
    try{
        const movie = await readMOvieByTitle(req.params.title)
        if(movie){
            res.json(movie)
        } else {
            res.status(404).json({error: "MOvie not found"})
        }
    } catch (error){
        res.status(500).json({error: "Failed to fetch movie"})
    }
})

// readMOvieByTitle("Lagaan")

// to get all the movies in the database

async function readAllMovies(){
    try{
        const allMovies = await Movie.find()
        // console.log(allMovies)
        return allMovies
    } catch(error){
        console.log(error)
    }
}

app.get("/movies", async (req,res) => {
    try{
        const movies = await readAllMovies()
        if(movies.length != 0){
            res.json(movies)
        } else {
            res.status(404).json({error: "No movies found."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to fetch movies."})
    }
})

// readAllMovies()

// get movie by director name

async function readMOvieByDirector(directorName){
    try {
        const movieByDirector = await Movie.find({director: directorName})
        // console.log(movieByDirector)
        return movieByDirector
    } catch (error) { 
        console.log(error)
    }
}

app.get("/movies/director/:directorName", async(req,res) => {
    try{
       const movies = await readMOvieByDirector(req.params.directorName) 
       if(movies.length != 0){
        res.json(movies)
       } else {
        res.status(404).json({error: "No movies found."})
       }
    } catch(error){
        res.status(500).json({error: "Failed to fetch movies"})
    }
})

async function readMovieByGenre(genreName)
{
    try {
       const movieByGenre = await Movie.find({genre: genreName}) 
       return movieByGenre
    } catch (error){
        console.log(error)
    }
}

app.get("/movies/genres/:genreName", async(req,res) => {
    try{
       const movies = await readMovieByGenre(req.params.genreName) 
       if(movies.length != 0){
        res.json(movies)
       } else {
        res.status(404).json({error: "No movies found."})
       }
    } catch(error){
        res.status(500).json({error: "Failed to fetch movies"})
    }
})

//4.3 CW
async function deleteMovie(movieId){
    try {
        const deletedMovie = await Movie.findByIdAndDelete(movieId)
        return deletedMovie
    } catch (error){
        console.log(error)
    }
}

app.delete('/movies/:movieId', async (req,res) => {
    try {
        const deletedMovie = await deleteMovie(req.params.movieId)
        if(deletedMovie){
             res.status(500).json({error: "MOvei deleted Successfully"})
        }
    } catch (error){
        res.status(500).json({error: "Failed to delete movie"})
    }
})

//4.4_CW :: Update Movie Data
async function updateMovie(movieId, dataToUpdate){
    try{
      const updatedMovie = await Movie.findByIdAndUpdate(movieId,dataToUpdate,{
         new: true,
      })
       return updatedMovie
    } catch (error){
        console.log("Error in Updating Movie rating", error)
    }
}

app.post("/movies/:movieId", async (req,res) => {
    try{
      const updatedMovie = await updateMovie(req.params.movieId, req.body)
      if(updatedMovie){
        res.status(200).json({message: "Movie updated successfully."})
      } else {
        res.status(404).json({error: "Movie not found"})
      }
    } catch (error){
      res.status(500).json({error: "Failed to Update movie"})
    }
})


//4.1 Cw

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
