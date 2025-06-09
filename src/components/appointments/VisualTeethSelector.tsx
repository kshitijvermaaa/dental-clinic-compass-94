
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ToothSelection {
  tooth: string;
  parts: string[];
}

interface VisualTeethSelectorProps {
  selectedTeeth: ToothSelection[];
  onTeethChange: (teeth: ToothSelection[]) => void;
}

export const VisualTeethSelector: React.FC<VisualTeethSelectorProps> = ({ selectedTeeth, onTeethChange }) => {
  const [selectedMode, setSelectedMode] = useState('full');

  const toothParts = [
    { value: 'occlusal', label: 'Occlusal (Top)', color: '#ef4444' },
    { value: 'mesial', label: 'Mesial (Front)', color: '#3b82f6' },
    { value: 'distal', label: 'Distal (Back)', color: '#10b981' },
    { value: 'buccal', label: 'Buccal (Cheek)', color: '#f59e0b' },
    { value: 'lingual', label: 'Lingual (Tongue)', color: '#8b5cf6' },
    { value: 'full', label: 'Full Tooth', color: '#dc2626' }
  ];

  const upperTeeth = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
  const lowerTeeth = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

  const isToothPartSelected = (tooth: string, part: string) => {
    const selection = selectedTeeth.find(s => s.tooth === tooth);
    return selection ? selection.parts.includes(part) : false;
  };

  const toggleToothPart = (tooth: string, part: string) => {
    const existingSelection = selectedTeeth.find(s => s.tooth === tooth);
    
    if (existingSelection) {
      if (existingSelection.parts.includes(part)) {
        // Remove this part
        const newParts = existingSelection.parts.filter(p => p !== part);
        if (newParts.length === 0) {
          // Remove entire tooth selection
          onTeethChange(selectedTeeth.filter(s => s.tooth !== tooth));
        } else {
          // Update with remaining parts
          onTeethChange(selectedTeeth.map(s => 
            s.tooth === tooth ? { ...s, parts: newParts } : s
          ));
        }
      } else {
        // Add this part
        onTeethChange(selectedTeeth.map(s => 
          s.tooth === tooth ? { ...s, parts: [...s.parts.filter(p => p !== 'full'), part] } : s
        ));
      }
    } else {
      // New tooth selection
      onTeethChange([...selectedTeeth, { tooth, parts: [part] }]);
    }
  };

  const clearSelection = () => {
    onTeethChange([]);
  };

  const ToothSVG = ({ toothNumber, isUpper }: { toothNumber: string; isUpper: boolean }) => {
    const getPartColor = (part: string) => {
      if (isToothPartSelected(toothNumber, part)) {
        return toothParts.find(p => p.value === part)?.color || '#dc2626';
      }
      return isToothPartSelected(toothNumber, 'full') ? '#dc2626' : '#f3f4f6';
    };

    return (
      <div className="relative">
        <svg width="40" height="50" viewBox="0 0 40 50" className="border border-gray-300 rounded">
          {/* Tooth outline */}
          <rect x="2" y="5" width="36" height="40" rx="8" fill="#ffffff" stroke="#d1d5db" strokeWidth="1"/>
          
          {/* Occlusal (Top) */}
          <rect 
            x="4" 
            y="7" 
            width="32" 
            height="8" 
            rx="4" 
            fill={getPartColor('occlusal')} 
            className="cursor-pointer hover:opacity-80"
            onClick={() => toggleToothPart(toothNumber, 'occlusal')}
          />
          
          {/* Mesial (Front) */}
          <rect 
            x="4" 
            y="15" 
            width="8" 
            height="25" 
            fill={getPartColor('mesial')} 
            className="cursor-pointer hover:opacity-80"
            onClick={() => toggleToothPart(toothNumber, 'mesial')}
          />
          
          {/* Distal (Back) */}
          <rect 
            x="28" 
            y="15" 
            width="8" 
            height="25" 
            fill={getPartColor('distal')} 
            className="cursor-pointer hover:opacity-80"
            onClick={() => toggleToothPart(toothNumber, 'distal')}
          />
          
          {/* Buccal (Cheek side) */}
          <rect 
            x="12" 
            y="15" 
            width="8" 
            height="25" 
            fill={getPartColor('buccal')} 
            className="cursor-pointer hover:opacity-80"
            onClick={() => toggleToothPart(toothNumber, 'buccal')}
          />
          
          {/* Lingual (Tongue side) */}
          <rect 
            x="20" 
            y="15" 
            width="8" 
            height="25" 
            fill={getPartColor('lingual')} 
            className="cursor-pointer hover:opacity-80"
            onClick={() => toggleToothPart(toothNumber, 'lingual')}
          />
          
          {/* Full tooth overlay when selected */}
          {isToothPartSelected(toothNumber, 'full') && (
            <rect 
              x="2" 
              y="5" 
              width="36" 
              height="40" 
              rx="8" 
              fill="#dc2626" 
              fillOpacity="0.7"
              className="cursor-pointer"
              onClick={() => toggleToothPart(toothNumber, 'full')}
            />
          )}
        </svg>
        
        {/* Tooth number */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-white px-1 rounded">
          {toothNumber}
        </div>
        
        {/* Quick full tooth selection */}
        <button
          className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full hover:bg-red-600"
          onClick={() => toggleToothPart(toothNumber, 'full')}
          title="Select full tooth"
        >
          ●
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-slate-50">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Visual Teeth Selector</h4>
        <Button variant="outline" size="sm" onClick={clearSelection}>
          Clear All
        </Button>
      </div>
      
      {/* Legend */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-600">Tooth Parts Legend:</h5>
        <div className="flex gap-2 flex-wrap">
          {toothParts.map((part) => (
            <div key={part.value} className="flex items-center gap-1 text-xs">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: part.color }}
              />
              <span>{part.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">Click on tooth parts to select them. Use the red dot to select the full tooth.</p>
      </div>
      
      {/* Upper Teeth */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-600">Upper Teeth</h5>
        <div className="flex gap-1 flex-wrap justify-center">
          {upperTeeth.map((tooth) => (
            <ToothSVG key={tooth} toothNumber={tooth} isUpper={true} />
          ))}
        </div>
      </div>

      {/* Lower Teeth */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-600">Lower Teeth</h5>
        <div className="flex gap-1 flex-wrap justify-center">
          {lowerTeeth.map((tooth) => (
            <ToothSVG key={tooth} toothNumber={tooth} isUpper={false} />
          ))}
        </div>
      </div>

      {/* Selected Teeth Summary */}
      {selectedTeeth.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-slate-600">Selected Teeth Summary:</h5>
          <div className="space-y-1">
            {selectedTeeth.map((selection, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border text-sm">
                <span className="font-medium">Tooth {selection.tooth}:</span>
                <div className="flex gap-1">
                  {selection.parts.map((part, partIndex) => (
                    <span 
                      key={partIndex} 
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ 
                        backgroundColor: toothParts.find(p => p.value === part)?.color || '#dc2626' 
                      }}
                    >
                      {toothParts.find(p => p.value === part)?.label || part}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
