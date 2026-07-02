import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DeviceCapability {
  memory: number; // GB
  cores: number;
  networkQuality: string;
  benchmarkScore: number;
  totalScore: number;
  bucket: 'slow' | 'medium' | 'fast';
  memoryUsage: number; // MB
}

interface CapabilityContextType {
  capability: DeviceCapability | null;
  isSlimMode: boolean;
  fps: number;
  refreshCapability: () => void;
  performanceOverride: 'auto' | 'high' | 'slim';
  setPerformanceOverride: (mode: 'auto' | 'high' | 'slim') => void;
  showWidget: boolean;
  setShowWidget: (show: boolean) => void;
}

const CapabilityContext = createContext<CapabilityContextType | undefined>(undefined);

// Non-blocking micro-benchmark for CPU speed
const runBenchmarkAsync = (): Promise<number> => {
  return new Promise((resolve) => {
    const run = () => {
      const start = performance.now();
      let count = 0;
      
      // Smaller CPU loop (100k instead of 1M to avoid thread locking)
      for (let i = 0; i < 100000; i++) {
        count += Math.sqrt(i) * Math.random();
      }
      
      const totalTime = performance.now() - start;
      
      // Normalize to 0-100 scale (scaled back to 1M equivalent)
      const score = Math.max(0, Math.min(100, 100 - (totalTime * 10 / 2)));
      resolve(Math.round(score));
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => run());
    } else {
      setTimeout(run, 0);
    }
  });
};

// Calculate capability scores asynchronously
const calculateCapabilityAsync = async (): Promise<DeviceCapability> => {
  // Get device memory (in GB)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Get CPU cores
  const cores = navigator.hardwareConcurrency || 4;
  
  // Get network quality
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const networkQuality = connection?.effectiveType || '4g';
  
  // Run benchmark asynchronously
  const benchmarkScore = await runBenchmarkAsync();
  
  // Calculate individual scores
  const memoryScore = memory <= 2 ? 20 : memory <= 4 ? 40 : memory <= 6 ? 80 : 100;
  const coreScore = cores <= 2 ? 20 : cores <= 4 ? 40 : cores <= 6 ? 80 : 100;
  const networkScore = networkQuality === 'slow-2g' || networkQuality === '2g' ? 20 
    : networkQuality === '3g' ? 40 
    : networkQuality === '4g' ? 80 
    : 100;
  
  // Weighted total score
  const totalScore = Math.round(
    benchmarkScore * 0.30 +
    memoryScore * 0.30 +
    coreScore * 0.20 +
    networkScore * 0.20
  );
  
  // Determine bucket
  const bucket = totalScore <= 70 ? 'slow' : totalScore <= 90 ? 'medium' : 'fast';
  
  // Get memory usage
  const memoryUsage = (performance as any).memory?.usedJSHeapSize 
    ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) 
    : 0;
  
  return {
    memory,
    cores,
    networkQuality,
    benchmarkScore,
    totalScore,
    bucket,
    memoryUsage
  };
};

export const CapabilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [capability, setCapability] = useState<DeviceCapability | null>(null);
  const [fps, setFps] = useState<number>(60);
  const [performanceOverride, setPerformanceOverrideState] = useState<'auto' | 'high' | 'slim'>(() => {
    const saved = localStorage.getItem('perfOverride');
    return (saved as 'auto' | 'high' | 'slim') || 'auto';
  });
  const [showWidget, setShowWidgetState] = useState<boolean>(() => {
    const saved = localStorage.getItem('showPerfWidget');
    return saved !== 'false'; // default to true
  });

  const setPerformanceOverride = (mode: 'auto' | 'high' | 'slim') => {
    setPerformanceOverrideState(mode);
    localStorage.setItem('perfOverride', mode);
  };

  const setShowWidget = (show: boolean) => {
    setShowWidgetState(show);
    localStorage.setItem('showPerfWidget', String(show));
  };
  
  const refreshCapability = async () => {
    const cap = await calculateCapabilityAsync();
    setCapability(cap);
    
    // Store capability in localStorage for server-side detection
    localStorage.setItem('deviceCapability', JSON.stringify(cap));
  };
  
  useEffect(() => {
    // Initial capability detection
    refreshCapability();
    
    // Listen to network changes dynamically if supported
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', refreshCapability);
    }
    
    // Refresh every 30 seconds
    const interval = setInterval(refreshCapability, 30000);
    
    return () => {
      clearInterval(interval);
      if (connection) {
        connection.removeEventListener('change', refreshCapability);
      }
    };
  }, []);

  // Derived slim mode state
  const isSlimMode = performanceOverride === 'slim' || (performanceOverride === 'auto' && capability?.bucket === 'slow');

  // Reactively apply body class
  useEffect(() => {
    if (isSlimMode) {
      document.body.classList.add('slim-mode');
    } else {
      document.body.classList.remove('slim-mode');
    }
  }, [isSlimMode]);

  // Frame rate (FPS) tracker
  useEffect(() => {
    if (isSlimMode) {
      // In slow/slim mode, cap frame rate indicator to reduce continuous animation loop load
      setFps(30);
      return;
    }

    let lastTime = performance.now();
    let frames = 0;
    let animationFrameId: number;

    const checkFps = () => {
      const now = performance.now();
      frames++;

      if (now >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        frames = 0;
        lastTime = now;
      }

      animationFrameId = requestAnimationFrame(checkFps);
    };

    animationFrameId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSlimMode]);

  // Derive active capability incorporating override
  const activeCapability = capability ? {
    ...capability,
    bucket: performanceOverride === 'high' ? 'fast' : performanceOverride === 'slim' ? 'slow' : capability.bucket
  } as DeviceCapability : null;
  
  return (
    <CapabilityContext.Provider value={{ 
      capability: activeCapability, 
      isSlimMode, 
      fps, 
      refreshCapability,
      performanceOverride,
      setPerformanceOverride,
      showWidget,
      setShowWidget
    }}>
      {children}
    </CapabilityContext.Provider>
  );
};

export const useCapability = () => {
  const context = useContext(CapabilityContext);
  if (context === undefined) {
    throw new Error('useCapability must be used within a CapabilityProvider');
  }
  return context;
};
