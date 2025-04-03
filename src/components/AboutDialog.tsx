import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AboutDialogProps {
  children?: React.ReactNode;
}

export function AboutDialog({ children }: AboutDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg p-6 max-w-lg mx-auto overflow-y-auto max-h-[90vh] animate-in fade-in-0 duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">About Innerwave</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <DialogDescription className="text-sm text-neutral-400 leading-relaxed">
            Innerwave is a modern meditation tool designed to help you explore sound, frequency, and states of mind. It offers a curated library of brainwave entrainment audio, from deep theta meditations to energizing beta session,  all accessible in a clean, intuitive interface.
          </DialogDescription>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-200">🔮 What's Inside</h2>
            <ul className="list-none space-y-2 text-sm text-neutral-400 leading-relaxed">
              <li>• Binaural, Isochronic & Monaural beat generators</li>
              <li>• Ancient Solfeggio healing frequencies</li>
              <li>• Earth's natural Schumann resonance</li>
              <li>• Optional perfect 5th harmonic overlay</li>
              <li>• Built-in timer & volume controls</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-200">🎧 How to Use</h2>
            <ul className="list-none space-y-2 text-sm text-neutral-400 leading-relaxed">
              <li>• Use stereo headphones for binaural beats (required for effect)</li>
              <li>• Start slow with low volume. Let your nervous system guide your experience</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-200">⚠️ Disclaimer</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Innerwave is a digital tool for exploration, education, and entertainment only. It is not a medical device, and does not claim to treat or cure any condition. If you have a history of seizures, epilepsy, or neurological sensitivity, consult a medical professional before using frequency-based audio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-200">🛠️ Built With</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Next.js, React, Tailwind CSS, and Tone.js
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
} 