import { useEffect, useState } from 'react';
import { useCapability } from '@/contexts/CapabilityContext';
import { Activity, Cpu, Gauge, Zap } from 'lucide-react';

export const PerformanceWidget = () => {
  const { capability, fps, showWidget } = useCapability();
  const [memoryUsage, setMemoryUsage] = useState(0);

  useEffect(() => {
    const updateMemory = () => {
      if ((performance as any).memory) {
        const usage = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
        setMemoryUsage(usage);
      }
    };

    updateMemory();
    const interval = setInterval(updateMemory, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!capability || !showWidget) return null;

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'fast':
        return 'hsl(var(--success))';
      case 'medium':
        return 'hsl(var(--warning))';
      case 'slow':
        return 'hsl(var(--destructive))';
      default:
        return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 bg-widget-bg/95 backdrop-blur-sm text-widget-fg px-4 py-3 rounded-lg border-2 shadow-lg font-mono text-xs"
      style={{
        borderColor: getBucketColor(capability.bucket),
        minWidth: '200px'
      }}
    >
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-widget-fg/20">
        <Activity className="w-4 h-4" />
        <span className="font-semibold">Performance Monitor</span>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-widget-fg/70 flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            Memory:
          </span>
          <span className="font-semibold">{memoryUsage} MB</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-widget-fg/70 flex items-center gap-1">
            <Gauge className="w-3 h-3" />
            Speed:
          </span>
          <span className="font-semibold">{capability.benchmarkScore}/100</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-widget-fg/70 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500/20" />
            Frame Rate:
          </span>
          <span className={`font-semibold transition-colors duration-300 ${fps < 45 ? 'text-red-500 font-bold animate-pulse' : fps < 55 ? 'text-amber-500' : 'text-emerald-500'}`}>{fps} FPS</span>
        </div>
        
        <div className="flex items-center justify-between pt-1 border-t border-widget-fg/20">
          <span className="text-widget-fg/70">Bucket:</span>
          <span 
            className="font-bold uppercase px-2 py-0.5 rounded text-[10px]"
            style={{ 
              backgroundColor: getBucketColor(capability.bucket),
              color: 'white'
            }}
          >
            {capability.bucket}
          </span>
        </div>
      </div>
    </div>
  );
};
