'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function FeedbackButton() {
  const [copied, setCopied] = useState(false);
  const email = 'galleryjonai@gmail.com';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-4 bg-neutral-900 border border-neutral-800 shadow-lg rounded-lg"
        align="end"
      >
        <div className="space-y-3">
          <p className="text-sm text-neutral-300">
            Got feedback? Email us at:
          </p>
          <div className="flex items-center gap-2 bg-neutral-800/50 rounded-lg p-2">
            <span className="text-sm text-neutral-200 font-mono flex-grow">
              {email}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-400 hover:text-neutral-200"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 