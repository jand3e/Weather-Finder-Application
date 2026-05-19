import React, { useState } from 'react';

const API_KEY = 'https://openweathermap.org/api';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (event) => {
    event.preventDefault();

    if (!city.trim()) {
      setError('Please enter a city name.');
      setWeather(null);
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.cod === '404') {
          setError('City not found');
        } else {
          setError(data.message || 'Unable to fetch weather data');
        }
        setWeather(null);
      } else {
        setWeather({
          name: data.name,
          temperature: data.main.temp,
          condition: data.weather[0]?.description || 'Unknown',
        });
      }
    } catch (fetchError) {
      setError('Unable to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Weather Finder</h1>
      <form onSubmit={fetchWeather} className="weather-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>
            <strong>Temperature:</strong> {weather.temperature} °C
          </p>
          <p>
            <strong>Condition:</strong> {weather.condition}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
