// We're using some tools from React to help us make a cool app.
import { useState, useEffect } from "react";

// This is like a magic box that gives us a random joke when we need it.
const useRandomJoke = () => {
  // We're keeping track of the joke, if we're waiting for it, and if there's a problem.
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // We use this special power called useEffect to do things when we need to.
  useEffect(() => {
    // This helper helps us get a joke from the internet.
    const fetchJoke = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://official-joke-api.appspot.com/random_joke`
        );
        const data = await response.json();
        setJoke(data);
      } catch (error) {
        console.error("error fetching joke", error);
        setError("Please try fetch another joke");
      } finally {
        setLoading(false);
      }
    };
    fetchJoke();
  }, [refresh]);

  // We can use this to get a new joke whenever we want.
  const refreshJoke = () => setRefresh(!refresh);

  // This magic box gives us the joke, if we're waiting for it, a way to get a new joke, and if there's a problem.
  return { joke, loading, refreshJoke, error };
};
export default useRandomJoke;
