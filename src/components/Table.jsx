import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUrls } from "../redux/urlSlice";
import { QRCodeCanvas } from "qrcode.react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const Table = () => {
  const dispatch = useDispatch();
  const { urls, loading, error, createdUrl } = useSelector(
    (state) => state.url
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search Term
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchUrls());
  }, [dispatch]);

  useEffect(() => {
    if (createdUrl) {
      dispatch(fetchUrls());
    }
  }, [createdUrl, dispatch]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // 🔍 Filtering based on search term
  const filteredUrls = urls.filter((item) => {
    const shortUrl = `${baseUrl}/${item.shortID}`;
    return (
      item.redirectURL.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  const paginatedData = filteredUrls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="space-y-10">
      <div className="overflow-x-auto shadow-2xl rounded-2xl border border-gray-200 p-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">URL Statistics</h1>
          <input
            type="text"
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-blue-600 text-white text-left">
                <tr>
                  <th className="px-5 py-3">Original URL</th>
                  <th className="px-5 py-3">Short URL</th>
                  <th className="px-5 py-3">QR</th>
                  <th className="px-5 py-3">Total Clicks</th>
                  <th className="px-5 py-3">Created Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {paginatedData.map((item, index) => {
                  const shortUrl = `${baseUrl}/${item.shortID}`;
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-all relative"
                    >
                      <td className="px-5 py-3 max-w-xs truncate text-left">
                        {item.redirectURL}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-between items-center">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 transition-colors truncate"
                          >
                            {shortUrl}
                          </a>
                          <button
                            onClick={() => handleCopy(shortUrl)}
                            className="ml-2 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded whitespace-nowrap"
                          >
                            Copy
                          </button>
                        </div>
                      </td>

                      {/* QR Code Column */}
                      <td className="px-5 py-3 relative group">
                        <QRCodeCanvas value={shortUrl} size={40} />
                        <div className="absolute z-10 hidden group-hover:block bg-white border border-gray-300 p-2 rounded shadow-lg top-12 left-1/2 transform -translate-x-1/2">
                          <QRCodeCanvas value={shortUrl} size={250} />
                        </div>
                      </td>

                      <td className="px-5 py-3">{item.clicks || 0}</td>
                      <td className="px-5 py-3">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        {new Date(item.expirationDate).getTime() > Date.now() ? (
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                            Expired
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
