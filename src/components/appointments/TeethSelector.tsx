
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TeethSelectorProps {
  selectedTeeth: string[];
  onTeethChange: (teeth: string[]) => void;
}

export const TeethSelector: React.FC<TeethSelectorProps> = ({ selectedTeeth, onTeethChange }) => {
  const upperTeeth = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
  const lowerTeeth = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

  const toggleTooth = (tooth: string) => {
    if (selectedTeeth.includes(tooth)) {
      onTeethChange(selectedTeeth.filter(t => t !== tooth));
    } else {
      onTeethChange([...selectedTeeth, tooth]);
    }
  };

  const clearSelection = () => {
    onTeethChange([]);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Select Affected Teeth</h4>
        <Button variant="outline" size="sm" onClick={clearSelection}>
          Clear All
        </Button>
      </div>
      
      {/* Upper Teeth */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-600">Upper Teeth</h5>
        <div className="flex gap-1 flex-wrap justify-center">
          {upperTeeth.map((tooth) => (
            <Button
              key={tooth}
              variant={selectedTeeth.includes(tooth) ? "default" : "outline"}
              size="sm"
              className={`w-8 h-8 p-0 text-xs ${
                selectedTeeth.includes(tooth) 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-blue-100'
              }`}
              onClick={() => toggleTooth(tooth)}
            >
              {tooth}
            </Button>
          ))}
        </div>
      </div>

      {/* Lower Teeth */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-600">Lower Teeth</h5>
        <div className="flex gap-1 flex-wrap justify-center">
          {lowerTeeth.map((tooth) => (
            <Button
              key={tooth}
              variant={selectedTeeth.includes(tooth) ? "default" : "outline"}
              size="sm"
              className={`w-8 h-8 p-0 text-xs ${
                selectedTeeth.includes(tooth) 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-blue-100'
              }`}
              onClick={() => toggleTooth(tooth)}
            >
              {tooth}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Teeth Display */}
      {selectedTeeth.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-slate-600">Selected Teeth:</h5>
          <div className="flex gap-1 flex-wrap">
            {selectedTeeth.map((tooth) => (
              <Badge key={tooth} variant="secondary" className="text-xs">
                {tooth}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
