'use client';

import React, { useState, useEffect, useRef, ComponentProps } from 'react';
import { Card } from "@/components/ui/card";
import { Brain, Waves, Activity, Music, Radio, Wind } from "lucide-react";
import { useTonePlayer } from '@/hooks/useTonePlayer';
import { AudioControls } from '@/components/AudioControls';
import { MeditationVisual } from '@/components/MeditationVisual';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AboutDialog } from '@/components/AboutDialog';
import { FrequencyModeInfo } from '@/components/FrequencyModeInfo';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Timer, X, ChevronDown, ChevronUp, Info, Music2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils'; 