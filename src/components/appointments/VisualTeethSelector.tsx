
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, RotateCcw } from 'lucide-react';

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
    { value: 'occlusal', label: 'Occlusal', color: '#ef4444', shortLabel: 'O' },
    { value: 'mesial', label: 'Mesial', color: '#3b82f6', shortLabel: 'M' },
    { value: 'distal', label: 'Distal', color: '#10b981', shortLabel: 'D' },
    { value: 'buccal', label: 'Buccal', color: '#f59e0b', shortLabel: 'B' },
    { value: 'lingual', label: 'Lingual', color: '#8b5cf6', shortLabel: 'L' },
    { value: 'full', label: 'Full Tooth', color: '#dc2626', shortLabel: 'F' }
  ];

  const upperTeeth = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
  const lowerTeeth = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

  const isToothPartSelected = (tooth: string, part: string) => {
    const selection = selectedTeeth.find(s => s.tooth === tooth);
    return selection ? selection.parts.includes(part) : false;
  };

  const toggleToothPart = (tooth: string, part: string) => {
    const existingSelection = selectedTeeth.find(s => s.tooth === tooth);
    
    if (part === 'full') {
      if (existingSelection?.parts.includes('full')) {
        // Remove entire tooth selection
        onTeethChange(selectedTeeth.filter(s => s.tooth !== tooth));
      } else {
        // Set as full tooth
        onTeethChange([
          ...selectedTeeth.filter(s => s.tooth !== tooth),
          { tooth, parts: ['full'] }
        ]);
      }
      return;
    }
    
    if (existingSelection) {
      if (existingSelection.parts.includes('full')) {
        // Replace full with specific part
        onTeethChange(selectedTeeth.map(s => 
          s.tooth === tooth ? { ...s, parts: [part] } : s
        ));
      } else if (existingSelection.parts.includes(part)) {
        // Remove this part
        const newParts = existingSelection.parts.filter(p => p !== part);
        if (newParts.length === 0) {
          onTeethChange(selectedTeeth.filter(s => s.tooth !== tooth));
        } else {
          onTeethChange(selectedTeeth.map(s => 
            s.tooth === tooth ? { ...s, parts: newParts } : s
          ));
        }
      } else {
        // Add this part
        onTeethChange(selectedTeeth.map(s => 
          s.tooth === tooth ? { ...s, parts: [...s.parts, part] } : s
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
      return isToothPartSelected(toothNumber, 'full') ? '#dc2626' : '#f8fafc';
    };

    const isSelected = selectedTeeth.some(s => s.tooth === toothNumber);

    return (
      <div className="relative group">
        <div className={`transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}>
          <svg 
            width="48" 
            height="60" 
            viewBox="0 0 48 60" 
            className={`rounded-lg transition-all duration-200 ${
              isSelected 
                ? 'shadow-lg ring-2 ring-blue-500/50' 
                : 'shadow-sm hover:shadow-md border border-slate-200'
            }`}
          >
            {/* Background */}
            <rect x="0" y="0" width="48" height="60" rx="8" fill="white" />
            
            {/* Tooth shape - more realistic */}
            <path
              d="M 8 12 Q 8 8 12 8 L 36 8 Q 40 8 40 12 L 40 32 Q 40 48 24 48 Q 8 48 8 32 Z"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            
            {/* Occlusal (Top) */}
            <path
              d="M 12 8 Q 16 6 24 6 Q 32 6 36 8 L 32 14 Q 24 12 16 14 Z"
              fill={getPartColor('occlusal')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleToothPart(toothNumber, 'occlusal');
              }}
            />
            
            {/* Mesial (Left/Front) */}
            <path
              d="M 8 12 Q 8 8 12 8 L 16 14 L 12 32 Q 8 28 8 24 Z"
              fill={getPartColor('mesial')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleToothPart(toothNumber, 'mesial');
              }}
            />
            
            {/* Distal (Right/Back) */}
            <path
              d="M 36 8 Q 40 8 40 12 L 40 24 Q 40 28 36 32 L 32 14 Z"
              fill={getPartColor('distal')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleToothPart(toothNumber, 'distal');
              }}
            />
            
            {/* Buccal (Cheek side - center left) */}
            <path
              d="M 16 14 L 12 32 Q 16 36 20 32 L 20 18 Z"
              fill={getPartColor('buccal')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleToothPart(toothNumber, 'buccal');
              }}
            />
            
            {/* Lingual (Tongue side - center right) */}
            <path
              d="M 32 14 L 36 32 Q 32 36 28 32 L 28 18 Z"
              fill={getPartColor('lingual')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleToothPart(toothNumber, 'lingual');
              }}
            />
            
            {/* Center area */}
            <rect
              x="20"
              y="18"
              width="8"
              height="14"
              fill={getPartColor('full')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleToothPart(toothNumber, 'full');
              }}
            />
            
            {/* Full tooth overlay when fully selected */}
            {isToothPartSelected(toothNumber, 'full') && (
              <path
                d="M 8 12 Q 8 8 12 8 L 36 8 Q 40 8 40 12 L 40 32 Q 40 48 24 48 Q 8 48 8 32 Z"
                fill="#dc2626"
                fillOpacity="0.8"
                className="cursor-pointer"
                onClick={() => toggleToothPart(toothNumber, 'full')}
              />
            )}
          </svg>
          
          {/* Tooth number */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full min-w-[24px] text-center">
            {toothNumber}
          </div>
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        
        {/* Hover tooltip */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          Tooth {toothNumber}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Visual Teeth Selector
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearSelection} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Legend */}
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-slate-700">Tooth Parts Guide:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {toothParts.map((part) => (
              <div key={part.value} className="flex items-center gap-2 p-2 rounded-lg bg-white/60 border border-slate-200">
                <div 
                  className="w-4 h-4 rounded-full border border-slate-300" 
                  style={{ backgroundColor: part.color }}
                />
                <span className="text-sm font-medium">{part.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 bg-blue-50 p-2 rounded-lg">
            💡 Click on different parts of each tooth to select specific areas, or click the center for the full tooth.
          </p>
        </div>
        
        <Separator />
        
        {/* Upper Teeth */}
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Upper Teeth (Maxilla)
          </h5>
          <div className="flex gap-2 flex-wrap justify-center p-4 bg-white/60 rounded-xl border border-slate-200">
            {upperTeeth.map((tooth) => (
              <ToothSVG key={tooth} toothNumber={tooth} isUpper={true} />
            ))}
          </div>
        </div>

        {/* Lower Teeth */}
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Lower Teeth (Mandible)
          </h5>
          <div className="flex gap-2 flex-wrap justify-center p-4 bg-white/60 rounded-xl border border-slate-200">
            {lowerTeeth.map((tooth) => (
              <ToothSVG key={tooth} toothNumber={tooth} isUpper={false} />
            ))}
          </div>
        </div>

        {/* Selected Teeth Summary */}
        {selectedTeeth.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-slate-700">Selected Teeth Summary:</h5>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {selectedTeeth.length} {selectedTeeth.length === 1 ? 'tooth' : 'teeth'}
                </Badge>
              </div>
              <div className="grid gap-2">
                {selectedTeeth.map((selection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-700">{selection.tooth}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selection.parts.map((part, partIndex) => (
                          <Badge 
                            key={partIndex} 
                            className="text-xs text-white border-0"
                            style={{ 
                              backgroundColor: toothParts.find(p => p.value === part)?.color || '#dc2626' 
                            }}
                          >
                            {toothParts.find(p => p.value === part)?.shortLabel || part}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTeethChange(selectedTeeth.filter((_, i) => i !== index))}
                      className="text-slate-400 hover:text-red-500 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
