import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VolumeDialogProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeDialog({ volume, onVolumeChange }: VolumeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full transition-all duration-200 flex-shrink-0 text-neutral-400 hover:text-neutral-200"
        >
          {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-64 p-4">
        <DialogHeader>
          <DialogTitle>Volume Control</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-neutral-300 flex-shrink-0" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Slider
                  value={[volume]}
                  onValueChange={([v]) => onVolumeChange(v)}
                  max={100}
                  step={1}
                  className="relative flex items-center select-none touch-none w-full [&>[data-thumb]]:h-4 [&>[data-thumb]]:w-4 [&>[data-thumb]]:border-2 [&>[data-thumb]]:border-indigo-500 [&>[data-thumb]]:bg-white [&>[data-thumb]]:rounded-full [&>[data-track]]:h-1.5 [&>[data-track]]:bg-neutral-600 [&>[data-range]]:bg-indigo-500"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">Volume: {volume}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
} 