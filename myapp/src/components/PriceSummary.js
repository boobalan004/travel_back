import React from 'react';

const PriceSummary = ({ pricePerPerson = 45000, adults, children, basePrice, addOnsTotal, totalPrice }) => {
  const totalMembers = adults + children;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-5 rounded-lg border border-blue-700">
      <h3 className="text-lg font-bold mb-4">Price Breakdown</h3>
      <div className="space-y-2 text-sm mb-4 border-b border-gray-600 pb-4">
        <div className="flex justify-between">
          <span className="text-gray-300">Price Per Person:</span>
          <span className="font-semibold">₹{Number(pricePerPerson || 45000).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Adults × {adults}:</span>
          <span className="font-semibold">₹{(Number(pricePerPerson || 45000) * adults).toLocaleString('en-IN')}</span>
        </div>
        {children > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-300">Children × {children}:</span>
            <span className="font-semibold">₹{(Number(pricePerPerson || 45000) * children).toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between bg-blue-800/50 px-2 py-1 rounded">
          <span className="text-gray-200">Base Price ({totalMembers} members):</span>
          <span className="font-bold text-blue-300">₹{Number(basePrice || 0).toLocaleString('en-IN')}</span>
        </div>
        {addOnsTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-300">Add-ons:</span>
            <span className="font-semibold text-green-400">+₹{Number(addOnsTotal).toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between text-lg font-bold">
        <span>Total Amount:</span>
        <span className="text-green-400">₹{Number(totalPrice || 0).toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
