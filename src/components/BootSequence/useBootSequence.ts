import { useState, useEffect, useRef } from "react";
import { BOOT_STEPS, BootStepItem } from "./bootData";

function playSynthNote(frequency: number, duration: number, volume = 0.05, type: OscillatorType = "sine") {
  if (typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (error) {
    // Browsers block audio before interaction, fail silently
  }
}

export function useBootSequence(onComplete: () => void) {
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Command Center...");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Initial start hum
    playSynthNote(150, 0.5, 0.06, "triangle");

    const timers: NodeJS.Timeout[] = [];

    // Schedule checkmark steps and update progress bar
    BOOT_STEPS.forEach((step, idx) => {
      const timer = setTimeout(() => {
        setActiveSteps((prev) => [...prev, step.id]);
        
        // Progress steps mapping
        const progressValues = [18, 39, 58, 74, 91, 100];
        setProgress(progressValues[idx]);

        // Synthesize step success tone
        playSynthNote(900 + idx * 80, 0.08, 0.04, "sine");
      }, step.delay);
      timers.push(timer);
    });

    // Launch dashboard transition step
    const launchTextTimer = setTimeout(() => {
      setLoadingText("Launching AI Shadow Dashboard...");
      playSynthNote(400, 0.15, 0.05, "sine");
    }, 2200);
    timers.push(launchTextTimer);

    // Complete boot sequence
    const completeTimer = setTimeout(() => {
      // Futuristic launch double-chime
      playSynthNote(1000, 0.1, 0.05, "sine");
      setTimeout(() => playSynthNote(1500, 0.25, 0.06, "sine"), 80);

      onCompleteRef.current();
    }, 2600);
    timers.push(completeTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return {
    activeSteps,
    progress,
    loadingText,
  };
}
