"use client";

export default function Home() {
  const bookmarks = [
    { id: 1, title: "Google", url: "https://www.google.com" },
    { id: 2, title: "GitHub", url: "https://www.github.com" },
  ];
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={() => {}}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={"title"}
              onChange={(e) => {}}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="url"
              placeholder="URL"
              value={"url"}
              onChange={(e) => {}}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Add Bookmark
          </button>
        </form>

        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{bookmark.title}</h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {bookmark.url}
                </a>
              </div>
              <button
                onClick={() => {}}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
