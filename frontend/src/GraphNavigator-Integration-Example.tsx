import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TabiyaDatasetExplorer from "./pages/TabiyaDatasetExplorer";

/**
 * Example integration of the GraphNavigator component
 * This shows how to add the TabiyaDatasetExplorer to your routing
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-gray-900">JobCompass</h1>
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/explorer"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dataset Explorer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explorer" element={<TabiyaDatasetExplorer />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to JobCompass
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Explore the relationships between occupations and skills in the Tabiya
          dataset
        </p>
        <Link
          to="/explorer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Launch Dataset Explorer
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Interactive Visualization
          </h3>
          <p className="text-gray-600">
            Explore occupations and skills through an interactive graph
            interface powered by Sigma.js
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Smart Search
          </h3>
          <p className="text-gray-600">
            Find specific occupations or skills with fuzzy search and automatic
            graph centering
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            High Performance
          </h3>
          <p className="text-gray-600">
            Web worker-based data processing and progressive loading for smooth
            interaction
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
