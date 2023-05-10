// We need some more tools and our magic joke box for the main part of our app.
import React, { useEffect, useState } from "react";
import useRandomJoke from "./useRandomJoke";
import LoadingSpinner from "./LoadingSpinner";

// This is the main part of our app that shows jokes and lets us save our favorites.
const Joke = () => {
  // We keep track of our favorite jokes here.
  const [favoriteJokes, setFavoriteJokes] = useState([]);
  // We get the joke, if we're waiting for it, a way to get a new joke, and if there's a problem from our magic joke box.
  const { joke, loading, refreshJoke, error } = useRandomJoke();
  // We keep track of the ratings of the joke here.
  const [rating, setRating] = useState({});

  // We use this to add a joke to our favorites.
  const addToFavourites = (joke) => {
    if (!favoriteJokes.some((favJoke) => favJoke.id === joke.id)) {
      const updatedFavorites = [...favoriteJokes, joke];
      setFavoriteJokes(updatedFavorites);
      localStorage.setItem("favoriteJokes", JSON.stringify(updatedFavorites));
    }
  };

  // we save the joke ratings to local storage.
  const saveRatingsToLocalStorage = (newRating) => {
    localStorage.setItem("jokeRatings", JSON.stringify(newRating));
  };

  // we create a function to rate a joke thumbs up.
  const handleThumbsUp = (jokeId) => {
    const newRatings = {
      ...rating,
      [jokeId]: (rating[jokeId] || 0) + 1,
    };
    setRating(newRatings);
    saveRatingsToLocalStorage(newRatings);
  };

  // we create a function to rate a joke thumbs down.
  const handleThumbsDown = (jokeId) => {
    // we're creating a new object, taking it everything from the ratings object -
    // - the key is the jokeId (argument) and the value (which is a number) is added by one -
    // once the button is clicked. adding the new array to the old array & localStorage.
    const newRatings = {
      ...rating,
      [jokeId]: (rating[jokeId] || 0) - 1,
    };
    setRating(newRatings);
    saveRatingsToLocalStorage(newRatings);
  };

  // We use this to remove a joke from our favorites.
  const deleteFromFavorites = (jokeId) => {
    const updatedFavorites = favoriteJokes.filter((joke) => joke.id !== jokeId);
    setFavoriteJokes(updatedFavorites);
    localStorage.setItem("favoriteJokes", JSON.stringify(updatedFavorites));
  };

  // We use another special power called useEffect to remember our favorite jokes even if we leave and come back.
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteJokes");
    if (storedFavorites) {
      setFavoriteJokes(JSON.parse(storedFavorites));
    }
  }, []);

  // We use useEffect to load ratings from local storage.
  useEffect(() => {
    const storedRatings = localStorage.getItem("jokeRatings");
    if (storedRatings) {
      setRating(JSON.parse(storedRatings));
    }
  }, []);

  return (
    <div className="joke">
      <div
        className="joke__container"
        style={error === null ? null : { display: "none" }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <p className="joke__setup">{joke.setup}😄</p>
            <p className="joke__punch">{joke.punchline}🥁</p>
            <span
              style={
                rating[joke.id] < 0 ? { color: "red" } : { color: "green" }
              }
            >
              {" "}
              Laugh Meter: {rating[joke.id] || 0}
            </span>
          </>
        )}
        <div className="joke__btns">
          <button onClick={() => handleThumbsUp(joke.id)}>👍</button>
          <button onClick={() => handleThumbsDown(joke.id)}>👎</button>
          <button onClick={refreshJoke}>Refresh</button>
          <button onClick={() => addToFavourites(joke)}>
            Add to favourites
          </button>
        </div>
      </div>
      <div
        className="error"
        style={error === null ? { display: "none" } : null}
      >
        {loading ? <LoadingSpinner /> : <h3 className="error__msg">{error}</h3>}
        <div className="joke__btns">
          <button onClick={refreshJoke}>Refresh</button>
        </div>
      </div>
      <div
        className="Favorite"
        style={favoriteJokes.length < 1 ? { display: "none" } : null}
      >
        <h2>Favorite Jokes</h2>
        <ul>
          {favoriteJokes.map((joke) => (
            <li key={joke.id}>
              {joke.setup} - {joke.punchline}
              <button onClick={() => deleteFromFavorites(joke.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Joke;
