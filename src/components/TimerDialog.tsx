import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

interface TimerDialogProps {
  selectedTimer: number | null;
  onTimerSelect: (minutes: number | null) => void;
}

const timerPresets = [5, 10, 15, 20, 30, 45, 60];

export function TimerDialog({ selectedTimer, onTimerSelect }: TimerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className={`relative h-9 w-9 rounded-full transition-all duration-200 flex-shrink-0 ${
              selectedTimer ? 'text-indigo-400 bg-indigo-500/10' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Timer className="h-4 w-4" />
            {selectedTimer && (
              <span className="absolute -top-1 -right-1 text-xs bg-indigo-600 rounded-full px-1.5 py-0.5">
                {selectedTimer}m
              </span>
            )}
          </Button>
          <span className="text-xs text-neutral-500 text-center mt-1">Timer</span>
        </div>
      </DialogTrigger>
      <DialogContent className="w-48 p-2">
        <DialogHeader>
          <DialogTitle>Set Timer</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {timerPresets.map(mins => (
            <Button
              key={mins}
              variant={selectedTimer === mins ? "default" : "outline"}
              className="w-full h-9 text-sm transition-colors duration-200"
              onClick={() => onTimerSelect(selectedTimer === mins ? null : mins)}
            >
              {mins}m
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 