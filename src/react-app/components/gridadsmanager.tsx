import React, { useState, useEffect, useRef } from 'react';

interface GridAd {
  id: number | string;
  title: string;
  Group: string;
}

const GridAdsManager: React.FC = () => {
  const [ads, setAds] = useState<GridAd[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [groupAds, setGroupAds] = useState<GridAd[]>([]);
  const [inputValues, setInputValues] = useState<{ [id: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
    const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}ads/fetcher/fetch_all_gridads.php`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const text = await response.text();
        
        const cleanedText = text.replace(/^Connected successfully\s*/, '').trim();

        const data = JSON.parse(cleanedText);
       
        setAds(data);
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError('Failed to fetch grid ads');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Get unique group names (from 'Group' property)
  const groups = Array.from(new Set(ads.map(ad => ad.Group)));

  useEffect(() => {
    if (selectedGroup) {
      const filtered = ads.filter(ad => ad.Group === selectedGroup);
      setGroupAds(filtered);
      const values: { [id: string]: string } = {};
      filtered.forEach(ad => {
        values[ad.id] = ad.title;
      });
      setInputValues(values);
    } else {
      setGroupAds([]);
      setInputValues({});
    }
  }, [selectedGroup, ads]);

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

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group);
    setDropdownOpen(false);
  };

  const handleInputChange = (id: string | number, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string | number) => {
    if (!inputValues[id]) {
      alert('Please enter a title');
      return;
    }
    try {
      const response = await fetch(`${API_URL}ads/updater/update_gridads.php`, {
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
        // Update the specific ad in the ads state to ensure UI reflects changes
        setAds(prev => prev.map(ad => 
          ad.id === id ? { ...ad, title: inputValues[id] } : ad
        ));
        alert('Title updated successfully!');
      } else {
        alert(data.error || 'Failed to update title');
      }
    } catch (e) {
      console.error('Error in handleSave:', e);
      alert('Failed to update title');
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-amber-600">Grid Ads Manager (Video Page)</h1>
      {isLoading && <p className="text-amber-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Custom Dropdown */}
      <div className="mb-4" ref={dropdownRef}>
        <label className="font-medium">Select Group</label>
        <div className="relative">
          <button
            type="button"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-500 text-white text-left"
            onClick={() => setDropdownOpen(open => !open)}
          >
            {selectedGroup || "-- Select a group --"}
            <span className="float-right">▾</span>
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 w-full border rounded-md mt-1 bg-white shadow-lg max-h-48 overflow-y-auto">
              {groups.map(group => (
                <li
                  key={group}
                  className="p-2 cursor-pointer bg-amber-500 text-black hover:bg-black hover:text-amber-500 transition"
                  onClick={() => handleGroupSelect(group)}
                >
                  {group}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Show up to 4 input fields for each ad in the selected group */}
      {selectedGroup && (
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2 text-amber-600">{selectedGroup}</h2>
          {groupAds.slice(0, 4).map(ad => (
            <div key={ad.id} className="mb-4">
              <label className="font-medium mb-1">Group: {ad.Group} <br /> Section: {ad.id}</label>
              <input
                type="text"
                value={inputValues[ad.id] || ''}
                onChange={e => handleInputChange(ad.id, e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder={`Title for ID ${ad.id}`}
              />
              <button
                onClick={() => handleSave(ad.id)}
                className="mt-2 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GridAdsManager;