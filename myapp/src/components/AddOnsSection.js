import React from 'react';

const AddOnsSection = ({ addOnsOptions, selectedAddOns, onAddOnChange }) => {
  return (
    <div className="space-y-3 mb-6">
      {addOnsOptions.map((addon) => (
        <label
          key={addon.id}
          className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedAddOns.includes(addon.id)}
            onChange={() => onAddOnChange(addon.id)}
            className="mr-4 w-5 h-5"
          />
          <div className="flex-1">
            <p className="font-semibold text-white">{addon.label}</p>
          </div>
          <span className="text-green-400 font-bold">+${addon.price}</span>
        </label>
      ))}
    </div>
  );
};

export default AddOnsSection;
