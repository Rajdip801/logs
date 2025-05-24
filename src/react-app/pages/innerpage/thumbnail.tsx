import React, { useState, useEffect, useRef } from 'react';

interface Post {
  id: number | string;
  title: string;
  image_url: string;
}

const Thumbnailcontrol: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch data from API using fetch
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}ads/fetcher/fetch_all.php`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const text = await response.text();
        // Remove "Connected successfully" and parse the JSON
        const cleanedText = text.replace(/^Connected successfully\s*/, '').trim();
        const data = JSON.parse(cleanedText);
        setPosts(data);
        if (data.length > 0) {
          setSelectedPost(data[0]);
          setNewImageUrl(data[0].image_url);
        }
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting a post from the search results or dropdown
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setNewImageUrl(post.image_url);
    setDropdownOpen(false);
  };

  // Dropdown change handler
  // (Removed unused handleDropdownChange function)

  // Handle saving changes to the database
  const handleSave = async () => {
    if (selectedPost) {
      try {
        const response = await fetch(`${API_URL}ads/updater/update_image_url.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedPost.id, image_url: newImageUrl }),
        });
        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
        setPosts(posts.map(post =>
          post.id === selectedPost.id ? { ...post, image_url: newImageUrl } : post
        ));
        alert('Image URL updated successfully!');
      } catch (err) {
        alert('Failed to save changes');
      }
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-amber-600">Image URL Editor</h1>

      {isLoading && <p className="text-amber-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Custom Dropdown for all posts */}
      <div className="mb-4" ref={dropdownRef}>
        <label className="font-medium">Select Post</label>
        <div
          className="relative"
        >
          <button
            type="button"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-500 text-white text-left"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {selectedPost ? selectedPost.title : "Select a post"}
            <span className="float-right">&#9662;</span>
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 w-full border rounded-md mt-1 bg-white shadow-lg max-h-48 overflow-y-auto">
              {posts.map(post => (
                <li
                  key={post.id}
                  className={`p-2 cursor-pointer 
                    ${selectedPost?.id === post.id ? 'bg-amber-500 text-black' : 'bg-amber-500 text-black'}
                    hover:bg-black hover:text-amber-500 transition`}
                  onClick={() => handleSelectPost(post)}
                >
                  {post.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Search bar and transparent search results */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search titles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {searchTerm && (
          <ul
            className="border rounded-md mt-2 max-h-48 overflow-y-auto"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(2px)" }}
          >
            {filteredPosts.length === 0 && (
              <li className="p-2 text-amber-500">No results found.</li>
            )}
            {filteredPosts.map(post => (
              <li
                key={post.id}
                className={`p-2 cursor-pointer hover:bg-amber-100 ${selectedPost?.id === post.id ? 'bg-amber-500 text-white' : ''}`}
                onClick={() => handleSelectPost(post)}
              >
                {post.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedPost && (
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2 text-amber-600">{selectedPost.title}</h2>
          <div className="mb-4">
            <label className="font-medium">Image URL</label>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <img
              src={newImageUrl}
              alt="Thumbnail"
              className="mt-2 w-32 h-32 object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
              }}
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
          >
            Save Image URL
          </button>
        </div>
      )}
    </div>
  );
};

export default Thumbnailcontrol;