'use client';

import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AboutDialog } from "@/components/AboutDialog";

export function InfoButton() {
  return (
    <AboutDialog>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        <Info className="h-4 w-4" />
      </Button>
    </AboutDialog>
  );
} 