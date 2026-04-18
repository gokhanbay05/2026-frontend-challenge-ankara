# Missing Podo: The Ankara Case - Investigation Dashboard

This project is an investigation dashboard built for the "Missing Podo: The Ankara Case" frontend challenge. It brings together scattered clues, check-ins, messages, and sighting records from various endpoints into an interactive UI to track Podo's last known locations and identify suspicious activities.

## 🕵️‍♂️ Key Features
* **Live Investigation Timeline**: A time-based flow reconstructing Podo's journey using real-time data fetching.
* **Fuzzy Person Matching (Bonus)**: Implemented algorithmic string similarity (Jaro-Winkler concept) to correctly correlate records of the same person across different data sources, even with slight typos.
* **Contact Networking**: Automatically cross-references messages and check-ins to build a web of relationships for each person.
* **Debounced Search**: Clean, URL-based search mechanism allowing investigator queries to be easily shared.
* **Solid Architecture**: Built with Vite + React, styled using Tailwind CSS, and uses Zustand for lightning-fast global state management.

## 🚀 Setup & Installation

This project requires Node.js to be installed on your machine.

1. **Install Dependencies**
   Run the following command at the root of the project:
   ```bash
   npm install
   ```

2. **Run the Development Server**
   Start the local dev server by running:
   ```bash
   npm run dev
   ```

3. **Explore the App**
   Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal) to begin the investigation!

## 🛠️ Tech Stack
* **Framework:** React 19 + Vite
* **Styling:** Tailwind CSS V4 + Lucide Icons
* **State Management:** Zustand
* **Routing:** React Router v7
* **Data Fetching:** Axios (with Promise.all optimization for concurrent parallel requests)
