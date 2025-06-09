
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ToothSelection {
  tooth: string;
  parts: string[];
}

interface EnhancedTeethSelectorProps {
  selectedTeeth: ToothSelection[];
  onTeethChange: (teeth: ToothSelection[]) => void;
}

const toothParts = [
  { value: 'occlusal', label: 'Occlusal (Top)' },
  { value: 'mesial', label: 'Mesial (Front)' },
  { value: 'distal', label: 'Distal (Back)' },
  { value: 'buccal', label: 'Buccal (Cheek side)' },
  { value: 'lingual', label: 'Lingual (Tongue side)' },
  { value: 'cervical', label: 'Cervical (Neck)' },
  { value: 'root', label: 'Root' },
  { value: 'full', label: 'Full Tooth' }
];

export const EnhancedTeethSelector: React.FC<EnhancedTeethSelectorProps> = ({ selectedTeeth, onTeethChange }) => {
  const [selectedParts, setSelectedParts] = useState<string[]>(['full']);
  const upperTeeth = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
  const lowerTeeth = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

  const toggleTooth = (tooth: string) => {
    const existingSelection = selectedTeeth.find(s => s.tooth === tooth);
    
    if (existingSelection) {
      // Remove the tooth selection
      onTeethChange(selectedTeeth.filter(s => s.tooth !== tooth));
    } else {
      // Add new tooth selection with current parts
      onTeethChange([...selectedTeeth, { tooth, parts: [...selectedParts] }]);
    }
  };

  const clearSelection = () => {
    onTeethChange([]);
  };

  const isToothSelected = (tooth: string) => {
    return selectedTeeth.some(s => s.tooth === tooth);
  };

  const getToothParts = (tooth: string) => {
    const selection = selectedTeeth.find(s => s.tooth === tooth);
    return selection ? selection.parts : [];
  };

  const togglePart = (part: string) => {
    if (part === 'full') {
      setSelectedParts(['full']);
    } else {
      const newParts = selectedParts.includes(part)
        ? selectedParts.filter(p => p !== part && p !== 'full')
        : [...selectedParts.filter(p => p !== 'full'), part];
      
      setSelectedParts(newParts.length === 0 ? ['full'] : newParts);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Select Affected Teeth</h4>
        <Button variant="outline" size="sm" onClick={clearSelection}>
          Clear All
        </Button>
      </div>
      
      {/* Part Selection */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-600">Select Tooth Parts:</h5>
        <div className="flex gap-2 flex-wrap">
          {toothParts.map((part) => (
            <Button
              key={part.value}
              variant={selectedParts.includes(part.value) ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => togglePart(part.value)}
            >
              {part.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Upper Teeth */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-600">Upper Teeth</h5>
        <div className="flex gap-1 flex-wrap justify-center">
          {upperTeeth.map((tooth) => (
            <Popover key={tooth}>
              <PopoverTrigger asChild>
                <Button
                  variant={isToothSelected(tooth) ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 p-0 text-xs ${
                    isToothSelected(tooth) 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-blue-100'
                  }`}
                  onClick={() => toggleTooth(tooth)}
                >
                  {tooth}
                </Button>
              </PopoverTrigger>
              {isToothSelected(tooth) && (
                <PopoverContent className="w-48">
                  <div className="space-y-2">
                    <h6 className="font-medium text-sm">Tooth {tooth} Parts:</h6>
                    <div className="text-xs text-slate-600">
                      {getToothParts(tooth).map((part, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                          {toothParts.find(p => p.value === part)?.label || part}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              )}
            </Popover>
          ))}
        </div>
      </div>

      {/* Lower Teeth */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-600">Lower Teeth</h5>
        <div className="flex gap-1 flex-wrap justify-center">
          {lowerTeeth.map((tooth) => (
            <Popover key={tooth}>
              <PopoverTrigger asChild>
                <Button
                  variant={isToothSelected(tooth) ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 p-0 text-xs ${
                    isToothSelected(tooth) 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-blue-100'
                  }`}
                  onClick={() => toggleTooth(tooth)}
                >
                  {tooth}
                </Button>
              </PopoverTrigger>
              {isToothSelected(tooth) && (
                <PopoverContent className="w-48">
                  <div className="space-y-2">
                    <h6 className="font-medium text-sm">Tooth {tooth} Parts:</h6>
                    <div className="text-xs text-slate-600">
                      {getToothParts(tooth).map((part, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                          {toothParts.find(p => p.value === part)?.label || part}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              )}
            </Popover>
          ))}
        </div>
      </div>

      {/* Selected Teeth Display */}
      {selectedTeeth.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-slate-600">Selected Teeth & Parts:</h5>
          <div className="space-y-2">
            {selectedTeeth.map((selection, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <Badge variant="default" className="text-xs">
                  Tooth {selection.tooth}
                </Badge>
                <div className="flex gap-1 flex-wrap">
                  {selection.parts.map((part, partIndex) => (
                    <Badge key={partIndex} variant="secondary" className="text-xs">
                      {toothParts.find(p => p.value === part)?.label || part}
                    </Badge>
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
