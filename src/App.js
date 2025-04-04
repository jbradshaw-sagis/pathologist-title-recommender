 import React, { useState, useEffect, useMemo, useCallback } from 'react';

const PathologistTitleRecommender = () => {
  // Define options for board certifications and fellowships using useMemo
  const boardCertificationOptions = useMemo(() => [
    { value: 'Dermatopathology', noun: 'Dermatopathologist' },
    { value: 'Dermatology', noun: 'Dermatologist' },
    { value: 'Anatomic / Clinical Pathology', noun: 'Anatomic / Clinical Pathologist' },
    { value: 'Anatomic Pathology', noun: 'Anatomic Pathologist' },
    { value: 'Hematopathology', noun: 'Hematopathologist' },
    { value: 'Molecular Pathology', noun: 'Molecular Pathologist' },
    { value: 'Cytopathology', noun: 'Cytopathologist' },
    { value: 'Surgical Pathology', noun: 'Surgical Pathologist' }
  ], []);

  const fellowshipOptions = useMemo(() => [
    { value: 'Dermatopathology', noun: 'Dermatopathologist' },
    { value: 'Gastrointestinal Pathology', noun: 'Gastrointestinal Pathologist' },
    { value: 'Gastrointestinal / Liver Pathology', noun: 'Gastrointestinal / Liver Pathologist' },
    { value: 'Molecular Pathology', noun: 'Molecular Pathologist' }
  ], []);

  // State for selected certifications and fellowships
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [selectedFellowships, setSelectedFellowships] = useState([]);
  const [recommendedTitle, setRecommendedTitle] = useState('');

  // Format a list of items based on the specified rules - wrapped in useCallback
  const formatList = useCallback((items) => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} & ${items[1]}`;
    
    const allButLast = items.slice(0, items.length - 1);
    const last = items[items.length - 1];
    return `${allButLast.join(', ')} & ${last}`;
  }, []);

  // Generate the recommended job title
  useEffect(() => {
    let title = '';
    
    // Special case for Dermatopathology and Dermatology
    if (selectedCertifications.length === 2 && 
        selectedCertifications.includes('Dermatopathology') && 
        selectedCertifications.includes('Dermatology')) {
      title = 'Board-Certified Dermatologist & Dermatopathologist';
    } 
    // General case for board certifications
    else if (selectedCertifications.length > 0) {
      const nouns = selectedCertifications.map(cert => {
        const option = boardCertificationOptions.find(opt => opt.value === cert);
        return option ? option.noun : '';
      }).filter(Boolean);
      
      title = `Board-Certified ${formatList(nouns)}`;
    }
    
    // Add fellowship training if selected
    if (selectedFellowships.length > 0) {
      const fellowshipNouns = selectedFellowships.map(fellowship => {
        const option = fellowshipOptions.find(opt => opt.value === fellowship);
        return option ? option.noun : '';
      }).filter(Boolean);
      
      if (title && fellowshipNouns.length > 0) {
        title += ` and Fellowship-Trained ${formatList(fellowshipNouns)}`;
      } else if (fellowshipNouns.length > 0) {
        title = `Fellowship-Trained ${formatList(fellowshipNouns)}`;
      }
    }
    
    setRecommendedTitle(title);
  }, [selectedCertifications, selectedFellowships, boardCertificationOptions, fellowshipOptions, formatList]);

  // Handle board certification selection
  const handleCertificationChange = (certification) => {
    setSelectedCertifications(prev => {
      if (prev.includes(certification)) {
        return prev.filter(cert => cert !== certification);
      } else {
        return [...prev, certification];
      }
    });
  };

  // Handle fellowship selection
  const handleFellowshipChange = (fellowship) => {
    setSelectedFellowships(prev => {
      if (prev.includes(fellowship)) {
        return prev.filter(f => f !== fellowship);
      } else {
        return [...prev, fellowship];
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Pathologist Job Title Recommender</h1>
        </div>
        
        <div className="p-8">
          {/* Board Certifications Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Board Certifications (multi-select)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {boardCertificationOptions.map((option) => (
                <div key={option.value} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id={`cert-${option.value}`}
                    checked={selectedCertifications.includes(option.value)}
                    onChange={() => handleCertificationChange(option.value)}
                    className="h-4 w-4 text-blue-600 mr-3"
                  />
                  <label htmlFor={`cert-${option.value}`} className="text-gray-700 cursor-pointer">
                    {option.value}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Fellowship Training Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Fellowship Training (multi-select)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {fellowshipOptions.map((option) => (
                <div key={option.value} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id={`fellow-${option.value}`}
                    checked={selectedFellowships.includes(option.value)}
                    onChange={() => handleFellowshipChange(option.value)}
                    className="h-4 w-4 text-blue-600 mr-3"
                  />
                  <label htmlFor={`fellow-${option.value}`} className="text-gray-700 cursor-pointer">
                    {option.value}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended Job Title Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Recommended Job Title</h2>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-gray-800 min-h-12 shadow-inner mt-3">
              <p className="font-medium text-center text-lg">
                {recommendedTitle || "Please select board certifications and/or fellowship training"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathologistTitleRecommender;