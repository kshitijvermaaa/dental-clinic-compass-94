
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ToothSelection {
  tooth: string;
  parts: string[];
}

interface VisualTeethSelectorProps {
  selectedTeeth: ToothSelection[];
  onTeethChange: (teeth: ToothSelection[]) => void;
}

const toothParts = [
  { value: 'occlusal', label: 'Occlusal (Chewing Surface)', color: '#ef4444', shortLabel: 'O' },
  { value: 'mesial', label: 'Mesial (Front Edge)', color: '#3b82f6', shortLabel: 'M' },
  { value: 'distal', label: 'Distal (Back Edge)', color: '#10b981', shortLabel: 'D' },
  { value: 'buccal', label: 'Buccal (Cheek Side)', color: '#f59e0b', shortLabel: 'B' },
  { value: 'lingual', label: 'Lingual (Tongue Side)', color: '#8b5cf6', shortLabel: 'L' },
  { value: 'cervical', label: 'Cervical (Neck)', color: '#06b6d4', shortLabel: 'C' },
  { value: 'root', label: 'Root', color: '#84cc16', shortLabel: 'R' },
  { value: 'full', label: 'Full Tooth', color: '#dc2626', shortLabel: 'F' }
];

// Generate tooth numbers for each quadrant
const generateTeethNumbers = () => {
  const upperRight = Array.from({length: 8}, (_, i) => `1${i + 1}`);
  const upperLeft = Array.from({length: 8}, (_, i) => `2${i + 1}`);
  const lowerLeft = Array.from({length: 8}, (_, i) => `3${i + 1}`);
  const lowerRight = Array.from({length: 8}, (_, i) => `4${i + 1}`);
  
  return { upperRight, upperLeft, lowerLeft, lowerRight };
};

export const VisualTeethSelector: React.FC<VisualTeethSelectorProps> = ({
  selectedTeeth,
  onTeethChange
}) => {
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const { upperRight, upperLeft, lowerLeft, lowerRight } = generateTeethNumbers();

  const isToothSelected = (tooth: string) => {
    return selectedTeeth.some(t => t.tooth === tooth);
  };

  const getToothParts = (tooth: string) => {
    const toothData = selectedTeeth.find(t => t.tooth === tooth);
    return toothData ? toothData.parts : [];
  };

  const handleToothClick = (tooth: string) => {
    setSelectedTooth(tooth);
    const currentParts = getToothParts(tooth);
    setSelectedParts(currentParts);
  };

  const handlePartSelection = (part: string, checked: boolean) => {
    if (checked) {
      setSelectedParts([...selectedParts, part]);
    } else {
      setSelectedParts(selectedParts.filter(p => p !== part));
    }
  };

  const applySelection = () => {
    if (!selectedTooth) return;
    
    const updatedTeeth = selectedTeeth.filter(t => t.tooth !== selectedTooth);
    
    if (selectedParts.length > 0) {
      updatedTeeth.push({
        tooth: selectedTooth,
        parts: selectedParts
      });
    }
    
    onTeethChange(updatedTeeth);
    setSelectedTooth(null);
    setSelectedParts([]);
  };

  const removeToothSelection = (tooth: string) => {
    const updatedTeeth = selectedTeeth.filter(t => t.tooth !== tooth);
    onTeethChange(updatedTeeth);
  };

  const clearAllSelections = () => {
    onTeethChange([]);
    setSelectedTooth(null);
    setSelectedParts([]);
  };

  const ToothButton = ({ tooth, quadrantClass }: { tooth: string; quadrantClass: string }) => {
    const isSelected = isToothSelected(tooth);
    const parts = getToothParts(tooth);
    const isCurrentlySelected = selectedTooth === tooth;
    
    return (
      <div className="relative">
        <Button
          variant={isCurrentlySelected ? "default" : isSelected ? "secondary" : "outline"}
          className={`
            w-12 h-12 text-xs font-bold transition-all duration-200 relative
            ${isCurrentlySelected ? 'ring-2 ring-blue-500 bg-blue-600 text-white' : ''}
            ${isSelected && !isCurrentlySelected ? 'bg-green-100 border-green-300 text-green-700' : ''}
            ${quadrantClass}
            hover:scale-105
          `}
          onClick={() => handleToothClick(tooth)}
        >
          {tooth}
        </Button>
        {isSelected && parts.length > 0 && (
          <div className="absolute -top-2 -right-2 flex flex-wrap gap-0.5 max-w-[50px]">
            {parts.slice(0, 3).map((part, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: toothParts.find(p => p.value === part)?.color }}
                title={toothParts.find(p => p.value === part)?.label}
              >
                {toothParts.find(p => p.value === part)?.shortLabel}
              </div>
            ))}
            {parts.length > 3 && (
              <div className="w-3 h-3 rounded-full bg-slate-400 text-[8px] font-bold text-white flex items-center justify-center">
                +
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Visual Teeth Selector</span>
          {selectedTeeth.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllSelections}>
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Teeth Grid */}
        <div className="space-y-6">
          {/* Upper Teeth */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-center text-slate-600">Upper Teeth</div>
            <div className="flex justify-center">
              <div className="grid grid-cols-16 gap-1">
                {/* Upper Right */}
                {upperRight.reverse().map(tooth => (
                  <ToothButton key={tooth} tooth={tooth} quadrantClass="rounded-tl-lg" />
                ))}
                {/* Upper Left */}
                {upperLeft.map(tooth => (
                  <ToothButton key={tooth} tooth={tooth} quadrantClass="rounded-tr-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Lower Teeth */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-center text-slate-600">Lower Teeth</div>
            <div className="flex justify-center">
              <div className="grid grid-cols-16 gap-1">
                {/* Lower Right */}
                {lowerRight.reverse().map(tooth => (
                  <ToothButton key={tooth} tooth={tooth} quadrantClass="rounded-bl-lg" />
                ))}
                {/* Lower Left */}
                {lowerLeft.map(tooth => (
                  <ToothButton key={tooth} tooth={tooth} quadrantClass="rounded-br-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Part Selection Panel */}
        {selectedTooth && (
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Select Parts for Tooth {selectedTooth}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {toothParts.map(part => (
                  <div key={part.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`part-${part.value}`}
                      checked={selectedParts.includes(part.value)}
                      onCheckedChange={(checked) => handlePartSelection(part.value, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`part-${part.value}`} 
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <div 
                        className="w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center"
                        style={{ backgroundColor: part.color }}
                      >
                        {part.shortLabel}
                      </div>
                      {part.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-3">
                <Button onClick={applySelection} className="bg-green-600 hover:bg-green-700">
                  Apply Selection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedTooth(null);
                    setSelectedParts([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Teeth Summary */}
        {selectedTeeth.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800">
                Selected Teeth ({selectedTeeth.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedTeeth.map((toothData, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center border border-green-300">
                        <span className="font-bold text-green-700">{toothData.tooth}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-green-800">Tooth {toothData.tooth}</div>
                        <div className="flex gap-1 flex-wrap">
                          {toothData.parts.map((part, partIndex) => (
                            <Badge 
                              key={partIndex} 
                              className="text-xs text-white border-0"
                              style={{ 
                                backgroundColor: toothParts.find(p => p.value === part)?.color 
                              }}
                            >
                              {toothParts.find(p => p.value === part)?.shortLabel} - {toothParts.find(p => p.value === part)?.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeToothSelection(toothData.tooth)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <Card className="bg-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Part Color Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {toothParts.map(part => (
                <div key={part.value} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: part.color }}
                  >
                    {part.shortLabel}
                  </div>
                  <span className="text-xs text-slate-600">{part.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
