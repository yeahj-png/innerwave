import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface PerfectFifthDialogProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function PerfectFifthDialog({ enabled, onToggle }: PerfectFifthDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-full transition-all duration-200 flex-shrink-0 ${
            enabled ? 'text-indigo-400 bg-indigo-500/10' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Music2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-64 p-4">
        <DialogHeader>
          <DialogTitle>Perfect Fifth Overlay</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Add a perfect fifth harmonic overlay to enhance the frequency effect
          </p>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-indigo-600"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 