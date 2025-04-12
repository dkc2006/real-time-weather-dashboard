#  Real Time Weather Dashboard

A real-time weather dashboard that allows users to view current weather conditions for any city using the OpenWeatherMap API.

## Features

- Search for weather data by city name
- Real-time weather information including temperature, humidity, wind speed, etc.
- City name autocomplete for easier searching
- 5-day weather forecast
- Dark/Light theme toggle
- Search history saved in localStorage
- Clean and responsive user interface
- Error handling for invalid cities and network issues

## Project Structure

```
weather-dashboard/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx      # Error message display component
│   │   │   ├── ForecastSection.jsx   # 5-day forecast component
│   │   │   ├── SearchBar.jsx         # Search bar with autocomplete
│   │   │   ├── SearchHistory.jsx     # Recent searches component
│   │   │   ├── ThemeToggle.jsx       # Dark/light mode toggle
│   │   │   └── WeatherCard.jsx       # Current weather display
│   │   ├── App.css                  # Main app styles
│   │   ├── App.js                   # Main application component
│   │   ├── index.css                # Global styles
│   │   └── index.js                 # React entry point
│   └── package.json
├── server/                    # Node.js Backend
│   ├── routes/
│   │   └── weather.js         # API endpoints for weather data
│   ├── server.js              # Express server configuration
│   └── package.json
├── .env                       # Environment variables (not in git)
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (sign up at https://openweathermap.org/appid)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following content:

```
PORT=5000
OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual OpenWeatherMap API key.

### 3. Frontend Setup

```bash
cd ../client
npm install
```

### 4. Running the Application

#### Start the backend server:

```bash
cd ../server
npm run dev
```

#### Start the frontend development server:

```bash
cd ../client
npm start
```

The application should now be running:

- Backend at: http://localhost:5000
- Frontend at: http://localhost:3000

## Usage

1. Enter a city name in the search box (suggestions will appear as you type)
2. Click on a suggestion or click the Search button
3. View the current weather conditions and 5-day forecast for the specified city
4. Toggle between dark and light modes using the theme switch
5. Click on a city in your search history to quickly view its weather again

## Bonus Features

### Dark/Light Mode

- Toggle between dark and light themes
- Theme preference is saved in localStorage

### Search History

- Recent searches are saved locally
- Click on previous searches to quickly view weather data
- Shows relative time of searches

### 5-Day Forecast

- View weather predictions for the next 5 days
- Includes daily high/low temperatures and conditions

### City Autocomplete

- As you type, the app suggests matching cities
- Select from suggestions for accurate results

## Technologies Used

- **Frontend**:

  - React.js
  - Axios for API requests
  - CSS for styling with dynamic theming
  - localStorage for persistent data

- **Backend**:
  - Node.js
  - Express.js
  - Axios for API requests
  - dotenv for environment variables
  - cors for handling cross-origin requests

## API Integration

- **OpenWeatherMap API**:
  - Current Weather Data API
  - 5 Day / 3 Hour Forecast API
  - Geocoding API for city suggestions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenWeatherMap API for providing weather data
- Create React App for bootstrapping the frontend
