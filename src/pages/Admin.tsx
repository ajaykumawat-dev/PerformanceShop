import { useCapability } from '@/contexts/CapabilityContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, HardDrive, Network, Zap } from 'lucide-react';

const Admin = () => {
  const { capability, isSlimMode } = useCapability();

  if (!capability) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading capability data...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getBucketBadgeVariant = (bucket: string) => {
    switch (bucket) {
      case 'fast':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'slow':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className={`font-bold mb-2 ${isSlimMode ? 'text-2xl' : 'text-3xl'}`}>
            RUM Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real User Monitoring - Device Capability Metrics
          </p>
        </div>

        {/* Device Category Badge */}
        <div className="mb-8">
          <Card className={isSlimMode ? 'bg-muted' : 'bg-gradient-primary text-primary-foreground'}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm mb-1 ${!isSlimMode && 'text-primary-foreground/80'}`}>
                    Device Category
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={getBucketBadgeVariant(capability.bucket)}
                      className="text-lg py-1 px-3"
                    >
                      {capability.bucket.toUpperCase()}
                    </Badge>
                    <span className={`font-bold ${isSlimMode ? 'text-2xl' : 'text-3xl'}`}>
                      {capability.totalScore}/100
                    </span>
                  </div>
                </div>
                <Zap className={`${isSlimMode ? 'w-12 h-12' : 'w-16 h-16'} ${!isSlimMode && 'text-primary-foreground/40'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Grid */}
        <div className={`grid gap-6 ${isSlimMode ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {/* Micro-Benchmark Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-5 h-5" />
                Benchmark Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`font-bold mb-1 ${isSlimMode ? 'text-2xl' : 'text-3xl'} ${getScoreColor(capability.benchmarkScore)}`}>
                {capability.benchmarkScore}
              </div>
              <p className="text-sm text-muted-foreground">
                CPU Performance (30% weight)
              </p>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${capability.benchmarkScore}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Device Memory */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HardDrive className="w-5 h-5" />
                Device Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`font-bold mb-1 ${isSlimMode ? 'text-2xl' : 'text-3xl'}`}>
                {capability.memory} GB
              </div>
              <p className="text-sm text-muted-foreground">
                RAM (30% weight)
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Usage: {capability.memoryUsage} MB</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all duration-300"
                    style={{ width: `${Math.min(100, (capability.memoryUsage / (capability.memory * 1024)) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CPU Cores */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="w-5 h-5" />
                CPU Cores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`font-bold mb-1 ${isSlimMode ? 'text-2xl' : 'text-3xl'}`}>
                {capability.cores}
              </div>
              <p className="text-sm text-muted-foreground">
                Logical Processors (20% weight)
              </p>
              <div className="mt-3 flex gap-1">
                {Array(Math.min(8, capability.cores)).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 h-2 bg-accent rounded"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Network Quality */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Network className="w-5 h-5" />
                Network Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`font-bold mb-1 ${isSlimMode ? 'text-xl' : 'text-2xl'} uppercase`}>
                {capability.networkQuality}
              </div>
              <p className="text-sm text-muted-foreground">
                Connection Type (20% weight)
              </p>
              <Badge variant="outline" className="mt-3">
                {capability.networkQuality === '4g' ? 'Fast' : 
                 capability.networkQuality === '3g' ? 'Medium' : 'Slow'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Score Breakdown */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Score Calculation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">CPU Benchmark (30%)</span>
                  <span className="text-sm font-bold">{capability.benchmarkScore} / 100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${capability.benchmarkScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Memory (30%)</span>
                  <span className="text-sm font-bold">
                    {capability.memory <= 2 ? 20 : capability.memory <= 4 ? 40 : capability.memory <= 6 ? 80 : 100} / 100
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all"
                    style={{ width: `${capability.memory <= 2 ? 20 : capability.memory <= 4 ? 40 : capability.memory <= 6 ? 80 : 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">CPU Cores (20%)</span>
                  <span className="text-sm font-bold">
                    {capability.cores <= 2 ? 20 : capability.cores <= 4 ? 40 : capability.cores <= 6 ? 80 : 100} / 100
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all"
                    style={{ width: `${capability.cores <= 2 ? 20 : capability.cores <= 4 ? 40 : capability.cores <= 6 ? 80 : 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Network Quality (20%)</span>
                  <span className="text-sm font-bold">
                    {capability.networkQuality.includes('2g') ? 20 : capability.networkQuality === '3g' ? 40 : capability.networkQuality === '4g' ? 80 : 100} / 100
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-info transition-all"
                    style={{ width: `${capability.networkQuality.includes('2g') ? 20 : capability.networkQuality === '3g' ? 40 : capability.networkQuality === '4g' ? 80 : 100}%` }}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total Score</span>
                  <span className={`font-bold text-xl ${getScoreColor(capability.totalScore)}`}>
                    {capability.totalScore} / 100
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adaptive Behavior Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Current Adaptive Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${isSlimMode ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
              <div>
                <h4 className="font-semibold mb-2">Active Optimizations</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ {isSlimMode ? 'Low' : 'High'}-quality images loaded</li>
                  <li>✓ {isSlimMode ? 'Disabled' : 'Enabled'} animations</li>
                  <li>✓ {isSlimMode ? 'Basic' : 'Rich'} UI components</li>
                  <li>✓ Code splitting active</li>
                  <li>✓ Service worker caching</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Bundle Information</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Bundle variant: {isSlimMode ? 'Slim' : 'Full'}</li>
                  <li>• Prefetching: {isSlimMode ? 'Disabled' : 'Enabled'}</li>
                  <li>• Lazy loading: Active</li>
                  <li>• Cache strategy: Stale-while-revalidate</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
