document.addEventListener('DOMContentLoaded', function() {
    const movieDetailsContainer = document.getElementById('movieDetails');
    const filmsList = document.getElementById('films');
    const buyTicketBtn = document.getElementById('buyTicketBtn');
  
    // Fetch data from JSON server
    const baseUrl = 'http://localhost:3000';
  
    // Function to fetch movie details by ID
    async function fetchMovieDetails(id) {
      try {
        const response = await fetch(`${baseUrl}/films/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const movie = await response.json();
        return movie;
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    }
  
    // Function to fetch all movies
    async function fetchAllMovies() {
      try {
        const response = await fetch(`${baseUrl}/films`);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const movies = await response.json();
        return movies;
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }
  
    // Function to update movie details on the page
    function updateMovieDetails(movie) {
      const { title, runtime, showtime, capacity, tickets_sold, poster } = movie;
      const availableTickets = capacity - tickets_sold;
      
      movieDetailsContainer.innerHTML = `
        <h2>${title}</h2>
        <img src="${poster}" alt="${title} Poster">
        <p>Runtime: ${runtime} minutes</p>
        <p>Showtime: ${showtime}</p>
        <p>Available Tickets: ${availableTickets}</p>
      `;
  
      // Update Buy Ticket button
      if (availableTickets > 0) {
        buyTicketBtn.innerText = 'Buy Ticket';
        buyTicketBtn.disabled = false;
      } else {
        buyTicketBtn.innerText = 'Sold Out';
        buyTicketBtn.disabled = true;
      }
    }
  
    // Function to handle buying a ticket
    async function buyTicket(movie) {
      const { id, tickets_sold } = movie;
      const updatedTicketsSold = tickets_sold + 1;
  
      // Update tickets_sold on the server (simulated with a delay)
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async request delay
  
      // Simulate updating tickets_sold on the server (not actually updating here)
      console.log(`Purchased ticket for movie ${id}`);
  
      // Update movie object locally (not persistent)
      movie.tickets_sold = updatedTicketsSold;
      
      // Update movie details on the page
      updateMovieDetails(movie);
    }
  
    // Event listener for Buy Ticket button
    buyTicketBtn.addEventListener('click', function() {
      const movieId = parseInt(document.querySelector('.film.selected').dataset.id);
      const movie = movies.find(m => m.id === movieId);
      buyTicket(movie);
    });
  
    // Function to render the list of movies
    function renderMovies(movies) {
      filmsList.innerHTML = '';
      movies.forEach(movie => {
        const { id, title } = movie;
        const li = document.createElement('li');
        li.className = 'film item';
        li.dataset.id = id;
        li.textContent = title;
        li.addEventListener('click', function() {
          const selected = document.querySelector('.film.selected');
          if (selected) selected.classList.remove('selected');
          this.classList.add('selected');
          fetchMovieDetails(id).then(movie => {
            updateMovieDetails(movie);
          });
        });
        filmsList.appendChild(li);
      });
    }
  
    // Initialize the application
    let movies = [];
  
    fetchAllMovies().then(data => {
      movies = data;
      renderMovies(movies);
      // Select the first movie by default
      if (movies.length > 0) {
        const firstMovieId = movies[0].id;
        fetchMovieDetails(firstMovieId).then(movie => {
          updateMovieDetails(movie);
        });
      }
    });
  });
  