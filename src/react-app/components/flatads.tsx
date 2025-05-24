import React, { useState, useEffect, useRef } from 'react';

interface FlatAd {
  id: number | string;
  title: string;
}

const FlatAdsManager: React.FC = () => {
  const [ads, setAds] = useState<FlatAd[]>([]);
  const [inputValues, setInputValues] = useState<{ [id: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdId, setSelectedAdId] = useState<string | number>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}ads/fetcher/fetch_flatads.php`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const text = await response.text();
        const cleanedText = text.replace(/^Connected successfully\s*/, '').trim();
        const data = JSON.parse(cleanedText);
        const limitedAds = data.slice(0, 8);
        setAds(limitedAds);
        const values: { [id: string]: string } = {};
        limitedAds.forEach((ad: FlatAd) => {
          values[ad.id] = ad.title;
        });
        setInputValues(values);
        if (limitedAds.length > 0) {
          setSelectedAdId(limitedAds[0].id);
        } else {
          setSelectedAdId('');
        }
      } catch (err) {
        setError('Failed to fetch flat ads');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
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

  const handleInputChange = (id: string | number, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string | number) => {
    if (!inputValues[id]) {
      alert('Please enter a title');
      return;
    }
    try {
      const response = await fetch(`${API_URL}ads/updater/update_flatads.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: inputValues[id] }),
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const text = await response.text();
      const cleanedText = text.replace(/^Connected successfully\s*/, '').trim();
      const data = JSON.parse(cleanedText);

      if (data.success) {
        setAds(prev => prev.map(ad =>
          ad.id === id ? { ...ad, title: inputValues[id] } : ad
        ));
        alert('Title updated successfully!');
      } else {
        alert(data.error || 'Failed to update title');
      }
    } catch (e) {
      alert('Failed to update title');
    }
  };

  const selectedAd = ads.find(ad => String(ad.id) === String(selectedAdId));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-amber-600">Flat Ads Manager</h1>
      {isLoading && <p className="text-amber-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Custom Dropdown to select ad */}
      <div className="mb-4" ref={dropdownRef}>
        <label className="font-medium mb-1">Select Ad</label>
        <div className="relative">
          <button
            type="button"
            className="w-full p-2 border rounded-md bg-amber-100 text-white text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
            onClick={() => setDropdownOpen(open => !open)}
            disabled={ads.length === 0}
          >
            {selectedAd ? `Section: ${selectedAd.id}` : "No ads available"}
            <span className="float-right">&#9662;</span>
          </button>
          {dropdownOpen && ads.length > 0 && (
            <ul className="absolute z-10 w-full border rounded-md mt-1 bg-white shadow-lg max-h-48 overflow-y-auto">
              {ads.map(ad => (
                <li
                  key={ad.id}
                  className={`p-2 cursor-pointer bg-amber-500 text-black hover:bg-black hover:text-amber-500 transition
                    ${selectedAdId === ad.id ? 'font-bold' : ''}`}
                  onClick={() => {
                    setSelectedAdId(ad.id);
                    setDropdownOpen(false);
                  }}
                >
                  Section: {ad.id}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Show input and save for selected ad */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-2 text-amber-600">Manage Flat Ads</h2>
        {selectedAd && (
          <div
            key={selectedAd.id}
            className="w-full border p-4 rounded-md flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <label className="font-medium">Section: {selectedAd.id}</label>
              <input
                type="text"
                value={inputValues[selectedAd.id] || ''}
                onChange={e => handleInputChange(selectedAd.id, e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder={`Title for ID ${selectedAd.id}`}
              />
            </div>
            <button
              onClick={() => handleSave(selectedAd.id)}
              className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
            >
              Save
            </button>
          </div>
        )}
        {ads.length === 0 && !isLoading && !error && (
          <p className="text-gray-500">No flat ads available.</p>
        )}
        {ads.length > 0 && !selectedAdId && (
          <p className="text-gray-500">Please select an ad to manage.</p>
        )}
      </div>
    </div>
  );
};

export default FlatAdsManager;