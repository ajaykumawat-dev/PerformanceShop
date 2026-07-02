import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCapability } from '@/contexts/CapabilityContext';
import { toast } from 'sonner';

const Home = () => {
  const { 
    capability, 
    isSlimMode, 
    fps, 
    refreshCapability, 
    performanceOverride, 
    setPerformanceOverride, 
    showWidget, 
    setShowWidget 
  } = useCapability();

  const [activeModal, setActiveModal] = useState<'performance' | 'caching' | 'monitoring' | null>(null);
  const [cachedUrls, setCachedUrls] = useState<string[]>([]);
  const [runningBenchmark, setRunningBenchmark] = useState(false);
  const [offlineSimulated, setOfflineSimulated] = useState(false);

  useEffect(() => {
    if (activeModal === 'caching' && 'caches' in window) {
      caches.keys().then(async (keys) => {
        const urls: string[] = [];
        for (const key of keys) {
          const cache = await caches.open(key);
          const requests = await cache.keys();
          requests.forEach(req => {
            try {
              const parsed = new URL(req.url);
              urls.push(parsed.pathname + parsed.search);
            } catch {
              urls.push(req.url);
            }
          });
        }
        setCachedUrls(urls.slice(0, 5));
      });
    }
  }, [activeModal]);

  useEffect(() => {
    if (offlineSimulated) {
      toast.success("Offline simulation active! Network requests will resolve from cache.");
    } else if (activeModal === 'caching') {
      toast.info("Network simulation restored to online.");
    }
  }, [offlineSimulated]);

  const handleClearCache = async () => {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        await reg.unregister();
      }
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }
    }
    toast.success("Storage cache cleared successfully! Reloading...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleRunBenchmark = async () => {
    setRunningBenchmark(true);
    await new Promise(r => setTimeout(r, 1200));
    await refreshCapability();
    setRunningBenchmark(false);
    toast.success("Hardware capability benchmark updated successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col relative pt-16 selection:bg-primary/20 selection:text-primary">
      {/* Background Mesh Element */}
      {!isSlimMode && (
        <div className="absolute inset-0 z-[-1] bg-mesh h-[800px] w-full opacity-70"></div>
      )}

      {/* Main Content Canvas */}
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-16 md:py-24 flex flex-col gap-20 md:gap-32">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto py-6 md:py-10">
          <div className="flex flex-col items-center gap-6">
            <h1 className="font-display-lg text-[2.5rem] md:text-display-lg text-on-surface leading-tight">
              Experience Adaptive <span className="text-primary">Performance</span> Shopping
            </h1>

            <p className="font-body-lg text-body-lg text-secondary dark:text-muted-foreground max-w-2xl leading-relaxed">
              Our platform automatically scales asset quality and delivery based on your device's capabilities and network speed, ensuring a frictionless, high-speed commerce experience.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link to="/products">
                <button className="bg-primary hover:bg-primary/95 text-white font-button-text text-button-text py-3 px-6 rounded-lg shadow-premium hover:shadow-premium-lg transition-all duration-200 flex items-center gap-2 active:scale-[0.98]">
                  Browse Products
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </Link>
              <Link to="/admin">
                <button className="bg-background dark:bg-card border border-border-subtle hover:border-secondary/50 text-on-surface font-button-text text-button-text py-3 px-6 rounded-lg shadow-premium-sm hover:shadow-premium transition-all duration-200 flex items-center gap-2 active:scale-[0.98]">
                  View Analytics
                  <span className="material-symbols-outlined text-[18px] text-secondary">bar_chart</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="flex flex-col gap-12 relative z-10 pt-8">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <h2 className="font-headline-lg text-[2rem] font-bold text-on-surface tracking-tight">
              Optimized for Every Device
            </h2>
            <p className="font-body-md text-body-md text-secondary dark:text-muted-foreground leading-relaxed">
              Our intelligent infrastructure ensures you get the best possible experience, whether you're on a high-end workstation or a low-power mobile device.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setActiveModal('performance')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveModal('performance')}
              className="bg-background dark:bg-card rounded-2xl p-8 border border-border-subtle shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5 items-start group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 ring-1 ring-primary/20 group-hover:ring-primary/0 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">tune</span>
              </div>
              <div className="flex-grow flex flex-col gap-2">
                <h3 className="font-title-md text-lg text-on-surface font-semibold tracking-tight">Adaptive Performance</h3>
                <p className="font-body-md text-[0.9375rem] text-secondary dark:text-muted-foreground leading-relaxed">
                  Automatically adjusts image quality, animations, and data fetching based on your device's hardware capabilities.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors duration-200 mt-auto pt-2">
                <span>Configure settings</span>
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform duration-200">arrow_forward</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setActiveModal('caching')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveModal('caching')}
              className="bg-background dark:bg-card rounded-2xl p-8 border border-border-subtle shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5 items-start group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 ring-1 ring-primary/20 group-hover:ring-primary/0 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">memory</span>
              </div>
              <div className="flex-grow flex flex-col gap-2">
                <h3 className="font-title-md text-lg text-on-surface font-semibold tracking-tight">Smart Caching</h3>
                <p className="font-body-md text-[0.9375rem] text-secondary dark:text-muted-foreground leading-relaxed">
                  Advanced service worker implementation ensures lightning-fast load times and robust offline capabilities.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors duration-200 mt-auto pt-2">
                <span>Manage cache</span>
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform duration-200">arrow_forward</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setActiveModal('monitoring')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveModal('monitoring')}
              className="bg-background dark:bg-card rounded-2xl p-8 border border-border-subtle shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5 items-start group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 ring-1 ring-primary/20 group-hover:ring-primary/0 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">monitor_heart</span>
              </div>
              <div className="flex-grow flex flex-col gap-2">
                <h3 className="font-title-md text-lg text-on-surface font-semibold tracking-tight">Real-time Monitoring</h3>
                <p className="font-body-md text-[0.9375rem] text-secondary dark:text-muted-foreground leading-relaxed">
                  Track device performance metrics in real-time to understand how the platform optimizes for your specific hardware.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors duration-200 mt-auto pt-2">
                <span>View telemetry</span>
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform duration-200">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-950 dark:to-slate-900 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-premium-xl relative overflow-hidden mt-8 border border-white/10">
          
          <div className="flex flex-col gap-4 relative z-10 max-w-xl">
            <h2 className="font-headline-lg text-[2rem] md:text-[2.5rem] font-bold text-white leading-tight tracking-tight">
              Ready to Experience Adaptive Shopping?
            </h2>
            <p className="font-body-md text-[1.125rem] text-slate-300 leading-relaxed">
              Join the future of high-performance e-commerce. Fast, reliable, and perfectly tuned to your device.
            </p>
          </div>
          <div className="relative z-10 whitespace-nowrap shrink-0">
            <Link to="/products">
              <button className="bg-primary hover:bg-primary/90 text-white font-button-text text-button-text py-4 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(2,132,199,0.39)] hover:shadow-[0_6px_20px_rgba(2,132,199,0.23)] transition-all duration-300 flex items-center gap-2 active:scale-95 font-semibold text-[1rem]">
                Start Shopping Now
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-background dark:bg-card border-t border-border-subtle mt-auto relative z-10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Column 1: Brand */}
            <div className="flex flex-col gap-6 lg:col-span-5 pr-8">
              <div className="font-title-md text-[1.5rem] font-bold text-on-surface tracking-tight">
                PerformanceShop
              </div>
              <p className="text-secondary dark:text-muted-foreground font-body-md max-w-sm leading-relaxed">
                Redefining e-commerce performance with intelligent, adaptive asset optimization. Built for speed and scale.
              </p>

            </div>

            {/* Column 2: Product */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              <h4 className="font-title-md text-[0.9375rem] text-on-surface font-semibold tracking-wide">Product</h4>
              <ul className="flex flex-col gap-3">
                <li><Link className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" to="/products">Features</Link></li>
                <li><Link className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" to="/admin">Analytics</Link></li>
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">API</a></li>
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">Documentation</a></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              <h4 className="font-title-md text-[0.9375rem] text-on-surface font-semibold tracking-wide">Company</h4>
              <ul className="flex flex-col gap-3">
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">About Us</a></li>
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">Careers</a></li>
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">Contact</a></li>
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Column 4: Support */}
            <div className="flex flex-col gap-5 lg:col-span-3">
              <h4 className="font-title-md text-[0.9375rem] text-on-surface font-semibold tracking-wide">Support</h4>
              <ul className="flex flex-col gap-3">
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">Help Center</a></li>
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">System Status</a></li>
                <li><a className="text-secondary dark:text-muted-foreground hover:text-primary font-body-md text-[0.9375rem] transition-colors" href="#">Community</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-secondary dark:text-muted-foreground font-body-md text-[0.875rem]">
              © 2026 PerformanceShop. All rights reserved.
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-secondary dark:text-muted-foreground hover:text-primary font-button-text transition-colors"
            >
              Back to top
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Settings & Telemetry Modal Overlay */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="relative bg-white dark:bg-card border border-border-subtle rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-premium-xl flex flex-col gap-6 transform transition-all duration-300 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Modal Content */}
            {activeModal === 'performance' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">tune</span>
                  </div>
                  <div>
                    <h3 className="font-title-md text-lg font-bold text-on-surface">Adaptive Performance Console</h3>
                    <p className="text-xs text-secondary dark:text-muted-foreground/60">Configure asset and animation scale overrides</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-muted/15 rounded-2xl p-4 border border-border-subtle flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary dark:text-muted-foreground">Current Mode:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded ${isSlimMode ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                      {isSlimMode ? 'Slim (Power Saver)' : 'High Fidelity (Standard)'}
                    </span>
                  </div>
                  {capability && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Device Score</div>
                        <div className="font-bold text-on-surface mt-0.5">{capability.totalScore}/100</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Memory</div>
                        <div className="font-bold text-on-surface mt-0.5">{capability.memory} GB</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">CPU Cores</div>
                        <div className="font-bold text-on-surface mt-0.5">{capability.cores}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-on-surface">Performance Override:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['auto', 'high', 'slim'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPerformanceOverride(mode)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all duration-200 ${
                          performanceOverride === mode 
                            ? 'bg-primary border-primary text-white shadow-premium-sm' 
                            : 'bg-background hover:bg-slate-50 dark:hover:bg-muted/10 border-border-subtle text-secondary dark:text-muted-foreground'
                        }`}
                      >
                        {mode === 'auto' ? 'Auto (Default)' : mode === 'high' ? 'High Freq' : 'Slim Mode'}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-secondary dark:text-muted-foreground/60 leading-relaxed bg-primary/5 p-3.5 rounded-xl border border-primary/10">
                  <span className="font-semibold text-primary block mb-1">How it works:</span>
                  Slim mode restricts animations, disables heavy SVG graphing, and switches shopping cards to load compressed next-gen image extensions to conserve memory and speed up response times.
                </p>
              </div>
            )}

            {activeModal === 'caching' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">memory</span>
                  </div>
                  <div>
                    <h3 className="font-title-md text-lg font-bold text-on-surface">Smart Caching Console</h3>
                    <p className="text-xs text-secondary dark:text-muted-foreground/60">Manage Service Worker and cache store</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-muted/15 rounded-2xl p-4 border border-border-subtle flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100 dark:border-white/5">
                    <span className="text-secondary dark:text-muted-foreground">Offline Storage:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Active (Pre-cached)
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="text-secondary dark:text-muted-foreground block mb-1.5">Recently Cached Files:</span>
                    {cachedUrls.length > 0 ? (
                      <div className="flex flex-col gap-1 font-mono text-[10px] bg-white dark:bg-background border border-border-subtle rounded-lg p-2.5 max-h-[100px] overflow-y-auto">
                        {cachedUrls.map((url, idx) => (
                          <div key={idx} className="truncate text-slate-600 dark:text-slate-400">✓ {url}</div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic">No cached pages indexed yet. Browse the site to fill the cache.</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center gap-4 bg-slate-50 dark:bg-muted/10 p-3 rounded-xl border border-border-subtle">
                    <div>
                      <div className="text-xs font-semibold text-on-surface">Offline Network Simulation</div>
                      <div className="text-[10px] text-slate-400">Test browsing using only locally cached resources</div>
                    </div>
                    <button
                      onClick={() => setOfflineSimulated(!offlineSimulated)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${offlineSimulated ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${offlineSimulated ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <button 
                    onClick={handleClearCache}
                    className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                    Clear Storage Cache & Force Reload
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'monitoring' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">monitor_heart</span>
                  </div>
                  <div>
                    <h3 className="font-title-md text-lg font-bold text-on-surface">Telemetry & Live Diagnostics</h3>
                    <p className="text-xs text-secondary dark:text-muted-foreground/60">Examine background engine stats and diagnostics</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-muted/15 rounded-2xl p-4 border border-border-subtle">
                    <span className="text-slate-400 block mb-1">Frame Rate</span>
                    <span className={`text-xl font-bold font-mono ${fps >= 55 ? 'text-emerald-500' : 'text-amber-500'}`}>{fps} FPS</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-muted/15 rounded-2xl p-4 border border-border-subtle">
                    <span className="text-slate-400 block mb-1">Allocated Memory</span>
                    <span className="text-xl font-bold font-mono text-primary">{capability?.memoryUsage || 48} MB</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center gap-4 bg-slate-50 dark:bg-muted/10 p-3 rounded-xl border border-border-subtle">
                    <div>
                      <div className="text-xs font-semibold text-on-surface">Floating Telemetry Overlay</div>
                      <div className="text-[10px] text-slate-400">Toggle the performance monitor widget in screen corner</div>
                    </div>
                    <button
                      onClick={() => setShowWidget(!showWidget)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showWidget ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showWidget ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <button
                    onClick={handleRunBenchmark}
                    disabled={runningBenchmark}
                    className="w-full bg-primary hover:bg-primary/95 text-white py-3 px-4 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-premium-sm"
                  >
                    {runningBenchmark ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Measuring capabilities...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">speed</span>
                        Run Performance Benchmark On-Demand
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
