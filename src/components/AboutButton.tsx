'use client';

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboutDialog } from "@/components/AboutDialog";

export function AboutButton() {
  return (
    <div className="flex justify-center mb-8">
      <Button
        variant="ghost"
        size="sm"
        className="text-sm text-neutral-400 hover:text-white transition"
      >
        <Info className="w-4 h-4" />
      </Button>
      <AboutDialog />
    </div>
  );
} 