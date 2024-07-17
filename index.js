document.addEventListener("DOMContentLoaded", () => {
  const filmList = document.getElementById("filmList");

  if (!filmList) {
    console.error("Element with id 'filmList' not found");
    return; // Exit early if filmList is null
  }

  const movieTitle = document.getElementById("movieTitle");
  const moviePoster = document.getElementById("moviePoster");
  const movieRuntime = document.getElementById("movieRuntime");
  const movieShowtime = document.getElementById("movieShowtime");
  const movieAvailableTickets = document.getElementById("movieAvailableTickets");
  const buyTicketBtn = document.getElementById("buyTicketBtn");

  let selectedMovie;

  function getMovieDetails(id) {
    fetch(`http://localhost:3000/films/${id}`)
      .then((response) => response.json())
      .then((movie) => {
        selectedMovie = movie;
        displayMovieDetails(movie);
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
      });
  }

  function displayMovieDetails(movie) {
    movieTitle.textContent = movie.title;
    moviePoster.src = movie.poster;

    movieRuntime.textContent = `Runtime: ${movie.runtime} minutes`;

    movieShowtime.textContent = `Showtime: ${movie.showtime}`;
    const availableTickets = movie.capacity - movie.tickets_sold;
    movieAvailableTickets.textContent = `Available Tickets: ${availableTickets}`;
    if (availableTickets === 0) {
      buyTicketBtn.textContent = "Sold Out";
      buyTicketBtn.disabled = true;
    } else {
      buyTicketBtn.textContent = "Buy Ticket";
      buyTicketBtn.disabled = false;
    }
  }

  fetch("http://localhost:3000/films")
    .then((response) => response.json())
    .then((movies) => {
      movies.forEach((movie) => {
        const listItem = document.createElement("li");
        listItem.textContent = movie.title;
        listItem.addEventListener("click", () => {
          getMovieDetails(movie.id);
        });
        filmList.appendChild(listItem);
      });

      // Display details of the first movie
      if (movies.length > 0) {
        getMovieDetails(movies[0].id);
      }
    })
    .catch((error) => {
      console.error('Error fetching films:', error);
    });

  buyTicketBtn.addEventListener("click", () => {
    if (selectedMovie && selectedMovie.tickets_sold < selectedMovie.capacity) {
      selectedMovie.tickets_sold += 1;
      displayMovieDetails(selectedMovie);
      updateTicketsSold(selectedMovie.id, selectedMovie.tickets_sold);
    }
  });

  function updateTicketsSold(id, ticketsSold) {
    fetch(`http://localhost:3000/films/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tickets_sold: ticketsSold }),
    })
    .catch((error) => {
      console.error('Error updating tickets sold:', error);
    });
  }
});
