import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="fixed top-4 right-4 p-2 rounded-full hover:bg-neutral-800 transition-colors z-50">
          <Info className="w-5 h-5 text-neutral-400 hover:text-neutral-300" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg p-6 max-w-md mx-auto data-[state=open]:animate-fadeIn">
        <DialogHeader>
          <DialogTitle>About Innerwave</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DialogDescription>
            Welcome to Innerwave, a modern web application for exploring brainwave entrainment and sound therapy. This app offers various types of audio frequencies designed to help with meditation, focus, relaxation, and other cognitive states.
          </DialogDescription>

          <div className="space-y-2">
            <h3 className="font-medium text-neutral-200">Features:</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Multiple frequency types (Binaural, Isochronic, Monaural)</li>
              <li>Solfeggio healing frequencies</li>
              <li>Schumann resonance presets</li>
              <li>Perfect fifth harmonics</li>
              <li>Timer functionality</li>
              <li>Volume control</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-neutral-200">Usage Tips:</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Use stereo headphones for binaural beats</li>
              <li>Start with alpha frequencies (8-12 Hz) for relaxation</li>
              <li>Try theta frequencies (4-8 Hz) for meditation</li>
              <li>Experiment with different durations and volumes</li>
            </ul>
          </div>

          <p className="text-sm text-neutral-400">
            Built with Next.js, React, and Web Audio API. For educational and experimental purposes only.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 