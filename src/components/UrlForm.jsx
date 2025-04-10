import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShortUrl, resetCreatedUrl } from "../redux/urlSlice";

export const UrlForm = () => {
  const dispatch = useDispatch();
  const { createdUrl, loading } = useSelector((state) => state.url);

  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    // Cleanup created URL on unmount
    return () => dispatch(resetCreatedUrl());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Please log in to shorten a URL.");
      return;
    }

    const requestData = {
      url: longUrl,
      ...(customAlias && { alias: customAlias }),
      ...(expirationDate && { expirationDate: new Date(expirationDate).toISOString() }),
    };

    dispatch(createShortUrl(requestData));

    setLongUrl("");
    setCustomAlias("");
    setExpirationDate("");
  };

  const handleCopy = () => {
    const fullUrl = `http://localhost:8000/${createdUrl?.id}`;
    navigator.clipboard.writeText(fullUrl);
    alert("Short URL copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Shorten Your URL</h2>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-3">Long URL</label>
            <input
              type="url"
              required
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-3">
              Custom Alias <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-custom-alias"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-3">
              Expiration Date <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </div>
        </form>

        {createdUrl && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg shadow text-center">
            <p className="text-lg font-medium text-gray-800 mb-2">Your Short URL:</p>
            <a
              href={`http://localhost:8000/${createdUrl.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-words"
            >
              http://localhost:8000/{createdUrl.id}
            </a>
            <div className="mt-3">
              <button
                onClick={handleCopy}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-4 rounded transition duration-200"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
