# Weather Dashboard

A real-time weather dashboard that allows users to view current weather conditions for any city using the OpenWeatherMap API.

## Features

- Search for weather data by city name
- Real-time weather information including temperature, humidity, wind speed, etc.
- Clean and responsive user interface
- Error handling for invalid cities and network issues

## Project Structure

```
weather-dashboard/
├── client/ # React Frontend
│   ├── src/
│   │   ├── components/ # WeatherCard, SearchBar, ErrorMessage
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/ # Node.js Backend
│   ├── routes/
│   │   └── weather.js # /weather endpoint logic
│   ├── server.js
│   └── package.json
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

1. Enter a city name in the search box
2. Click the Search button or press Enter
3. View the current weather conditions for the specified city

## Technologies Used

- **Frontend**:

  - React.js
  - Axios for API requests
  - CSS for styling

- **Backend**:
  - Node.js
  - Express.js
  - Axios for API requests
  - dotenv for environment variables
  - cors for handling cross-origin requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenWeatherMap API for providing weather data
- Create React App for bootstrapping the frontend
