export function handleHome(request) {
    const html = `
    <!DOCTYPE html>
    <html lang="en" class="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZenTrip - Peaceful Travel</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
            
            :root {
                --bg-depth: #050505;
                /* iOS Liquid Glass Specs */
                --liquid-bg: rgba(255, 255, 255, 0.08);
                --liquid-border: rgba(255, 255, 255, 0.12);
                --liquid-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                --liquid-blur: blur(20px) saturate(180%);
            }

            body { 
                font-family: 'Plus Jakarta Sans', sans-serif; 
                background-color: var(--bg-depth);
                color: #fff; 
                overflow-x: hidden;
            }
            
            h1, h2, h3, .brand-font { font-family: 'Outfit', sans-serif; }

            /* --- Calming Aurora Background (Green/Purple/White) --- */
            .aurora-container {
                position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden;
            }
            .aurora-blob {
                position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.5;
                transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            /* Green Blob */
            .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, #059669 0%, transparent 70%); animation: breath 12s infinite alternate; }
            /* Purple Blob */
            .blob-2 { bottom: -10%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, #7c3aed 0%, transparent 70%); animation: breath 15s infinite alternate-reverse; }
            /* White/Blueish Tint Blob for "Calm" */
            .blob-3 { top: 40%; left: 30%; width: 35vw; height: 35vw; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%); opacity: 0.3; animation: rotateBlob 25s infinite linear; }

            @keyframes breath { 0% { opacity: 0.3; scale: 1; } 100% { opacity: 0.5; scale: 1.1; } }
            @keyframes rotateBlob { from { transform: rotate(0deg) translate(30px) rotate(0deg); } to { transform: rotate(360deg) translate(30px) rotate(-360deg); } }

            /* --- Liquid Glass Implementation (iOS Style) --- */
            /* Unlike standard glassmorphism, this uses saturation boost and specific borders */
            .liquid-glass {
                background: var(--liquid-bg);
                backdrop-filter: var(--liquid-blur);
                -webkit-backdrop-filter: var(--liquid-blur);
                border: 1px solid var(--liquid-border);
                box-shadow: var(--liquid-shadow), inset 0 0 0 1px rgba(255,255,255,0.05);
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            .liquid-glass:hover {
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 255, 255, 0.25);
                transform: translateY(-4px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            }

            /* --- Typography Gradients (Green/Purple) --- */
            .gradient-text-calm {
                background: linear-gradient(135deg, #fff 0%, #a7f3d0 100%); /* White to soft green */
                -webkit-background-clip: text; background-clip: text; color: transparent;
            }
            .gradient-text-vibrant {
                background: linear-gradient(135deg, #d8b4fe 0%, #34d399 100%); /* Purple to Green */
                -webkit-background-clip: text; background-clip: text; color: transparent;
            }

            /* --- Animations --- */
            .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; transform: translateY(20px); }
            .delay-100 { animation-delay: 0.1s; }
            .delay-200 { animation-delay: 0.2s; }
            .delay-300 { animation-delay: 0.3s; }
            @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

            /* --- Demo Button Specifics --- */
            .demo-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3); /* Green tint border */
                position: relative; overflow: hidden;
            }
            .demo-btn::after {
                content: ''; position: absolute; inset: 0;
                background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2), transparent);
                transform: translateX(-100%); transition: transform 0.6s;
            }
            .demo-btn:hover::after { transform: translateX(100%); }
            .demo-btn:hover { border-color: rgba(16, 185, 129, 0.8); background: rgba(16, 185, 129, 0.1); }

            /* Phone Mockup */
            .phone-mockup { border: 8px solid #1a1a1a; border-radius: 40px; background: #000; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.8); }
            .phone-notch { width: 90px; height: 24px; background: #1a1a1a; border-radius: 0 0 14px 14px; margin: 0 auto; z-index: 20; position: relative; }
        </style>
    </head>
    <body class="selection:bg-emerald-500/30 selection:text-white">

        <div class="aurora-container" id="aurora-bg">
            <div class="aurora-blob blob-1"></div>
            <div class="aurora-blob blob-2"></div>
            <div class="aurora-blob blob-3"></div>
        </div>

        <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-black/10 backdrop-blur-xl">
            <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">🧘</span>
                    <span class="text-xl font-bold brand-font tracking-wide text-white">ZenTrip</span>
                </div>
                <div class="flex items-center gap-4">
                     <a href="https://github.com" target="_blank" class="text-xs font-medium text-white/50 hover:text-white transition-colors">Open Source</a>
                </div>
            </div>
        </nav>

        <main class="relative pt-36 pb-20 px-6 max-w-7xl mx-auto">
            
            <div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                
                <div class="text-left space-y-8 fade-in-up">
                    
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-[11px] font-bold tracking-widest uppercase">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
                        Free & Open-Source
                    </div>
                    
                    <h1 class="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight">
                        <span class="gradient-text-calm">Organize chaos.</span><br />
                        <span class="gradient-text-vibrant">Travel calm.</span>
                    </h1>

                    <p class="text-lg text-white/60 max-w-lg leading-relaxed font-light">
                        The minimalist, simple and free itinerary planner. No logins. No ads. 
                        Just a secure, shareable link for you and your travel companions.
                    </p>

                    <div class="space-y-6 max-w-md pt-2">
                        
                        <div class="liquid-glass p-2.5 rounded-2xl flex flex-col sm:flex-row items-center gap-2 group">
                            <div class="w-full sm:flex-1 px-4 py-2 sm:py-0 relative">
                                <label class="block text-[10px] text-white/30 font-bold uppercase tracking-wider mb-0.5">Start a Trip</label>
                                <div class="flex items-center font-mono text-white/90 text-sm">
                                    <span class="text-emerald-400 mr-1">/</span>
                                    <input id="tripIdInput" readonly class="bg-transparent border-none outline-none w-full cursor-text" value="...">
                                </div>
                            </div>
                            <button onclick="launchTrip()" class="w-full sm:w-auto bg-white text-black hover:bg-emerald-50 transition-all px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                <span>Launch</span>
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </button>
                        </div>

                        <div class="flex items-center gap-4 pl-2">
                            <a href="/demo" class="demo-btn px-5 py-2.5 rounded-full text-sm font-semibold text-white flex items-center gap-2.5 transition-all group">
                                <span class="text-lg group-hover:scale-110 transition-transform">🚀</span>
                                <span>Try the Demo</span>
                                <svg class="w-3 h-3 text-white/50 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                            </a>
                            <span class="text-xs text-white/20">Pre-loaded with Japan Plan</span>
                        </div>

                    </div>
                </div>

                <div class="hidden lg:flex justify-center fade-in-up delay-200 perspective-[2000px]">
                    <div class="phone-mockup w-[320px] h-[640px] transform rotate-y-[-12deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out overflow-hidden relative bg-zinc-950">
                        <div class="phone-notch"></div>
                        
                        <div class="w-full h-full pt-10 px-4 pb-4 overflow-hidden relative">
                            <div class="absolute inset-0 bg-gradient-to-b from-zinc-900 to-[#0a0a0a] z-0"></div>
                            
                            <div class="relative z-10">
                                <div class="flex justify-between items-end pb-4 border-b border-white/10 mb-5">
                                    <div><h2 class="text-white font-bold text-xl tracking-tight">Japan 2026</h2></div>
                                    <div class="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400">YO</div>
                                </div>
                                
                                <div class="relative pl-6 space-y-5">
                                    <div class="absolute left-[7px] top-2 bottom-0 w-[2px] bg-white/10"></div>
                                    
                                    <div class="relative">
                                        <div class="absolute left-[-26px] top-0 w-3 h-3 rounded-full border-2 border-white/20 bg-zinc-900"></div>
                                        <div class="text-xs text-white/50 mb-1.5 font-medium">09:00 AM</div>
                                        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5">
                                            <div class="flex gap-3">
                                                <div class="text-xl">✈️</div>
                                                <div>
                                                    <div class="text-white font-bold text-sm">Arrival NRT</div>
                                                    <div class="text-white/40 text-xs mt-0.5">Pick up WiFi.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="relative pt-1">
                                         <div class="absolute left-[-29px] top-2 z-10">
                                            <div class="w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-900 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                        </div>
                                        <div class="text-xs text-emerald-400 font-bold mb-1.5 tracking-wide">NOW • 11:30 AM</div>
                                        <div class="bg-white/10 backdrop-blur-lg saturate-150 border border-emerald-500/40 rounded-2xl p-3.5 shadow-lg shadow-emerald-900/20">
                                            <div class="flex gap-3">
                                                <div class="text-xl">🍜</div>
                                                <div>
                                                    <div class="text-white font-bold text-sm">Ichiran Ramen</div>
                                                    <div class="text-white/40 text-xs mt-0.5">Order ticket machine.</div>
                                                    <div class="flex gap-2 mt-2">
                                                        <span class="text-[10px] bg-white/10 border border-white/5 px-2 py-0.5 rounded-full text-white/70">Map</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="relative pt-1 opacity-40">
                                        <div class="absolute left-[-26px] top-2 w-3 h-3 rounded-full border-2 border-white/20 bg-zinc-900"></div>
                                        <div class="text-xs text-white/50 mb-1.5">02:00 PM</div>
                                        <div class="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                                            <div class="flex gap-3">
                                                <div class="text-xl">⛩️</div>
                                                <div>
                                                    <div class="text-white font-bold text-sm">Meiji Shrine</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex gap-1 z-20 shadow-2xl">
                                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm text-white border border-white/5">🌏</div>
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm grayscale opacity-50">📝</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-6 fade-in-up delay-300">
                
                <div class="liquid-glass rounded-[2rem] p-8 relative overflow-hidden md:col-span-2 group">
                    <div class="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500">
                        <svg class="w-64 h-64 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-2">Liquid Itinerary</h3>
                    <p class="text-white/50 max-w-md text-sm leading-relaxed">
                        A vertical timeline that flows with your day. Attach maps, tickets, and notes to every event. 
                        ZenTrip automatically sorts everything by time, highlighting what's next with a glowing indicator.
                    </p>
                </div>

                <div class="liquid-glass rounded-[2rem] p-8 flex flex-col justify-between group">
                    <div>
                        <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">Private & Secure</h3>
                        <p class="text-sm text-white/50 leading-relaxed">
                            No logins. Your data lives in a secure, randomly generated URL.
                        </p>
                    </div>
                </div>

                <div class="liquid-glass rounded-[2rem] p-8 flex flex-col justify-between group">
                    <div>
                        <div class="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">Collaborative</h3>
                        <p class="text-sm text-white/50 leading-relaxed">
                            Sync checklists in real-time. See who packed what, instantly.
                        </p>
                    </div>
                </div>

                <div class="liquid-glass rounded-[2rem] p-8 md:col-span-2 relative overflow-hidden group">
                     <div class="absolute top-1/2 right-10 transform -translate-y-1/2 opacity-30">
                        <div class="flex -space-x-4">
                            <div class="w-12 h-12 rounded-full border-2 border-zinc-900 bg-zinc-700"></div>
                            <div class="w-12 h-12 rounded-full border-2 border-zinc-900 bg-zinc-600"></div>
                            <div class="w-12 h-12 rounded-full border-2 border-zinc-900 bg-zinc-500 flex items-center justify-center text-xs font-bold text-black">+2</div>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">❤️ Designed for Couples</h3>
                    <p class="text-white/50 max-w-sm text-sm leading-relaxed">
                    Share the link and everyone can add stops, check off items, and update documents instantly.
                    </p>
                </div>

            </div>

            <footer class="mt-24 border-t border-white/5 pt-10 text-center">
                <p class="text-white/20 text-sm">ZenTrip · Designed for peace of mind.</p>
            </footer>

        </main>

        <script>
            document.addEventListener('DOMContentLoaded', () => {
                // 1. ID Generation
                const rawUuid = crypto.randomUUID().replace(/-/g, '');
                const cleanId = rawUuid.substring(0, 16);
                document.getElementById('tripIdInput').value = cleanId;

                // 2. Parallax Mouse Effect
                document.addEventListener('mousemove', (e) => {
                    const x = e.clientX / window.innerWidth;
                    const y = e.clientY / window.innerHeight;
                    
                    const blobs = document.querySelectorAll('.aurora-blob');
                    if(blobs.length >= 3) {
                        blobs[0].style.transform = \`translate(\${x * 30}px, \${y * 30}px)\`;
                        blobs[1].style.transform = \`translate(\${-x * 30}px, \${-y * 30}px)\`;
                        blobs[2].style.transform = \`translate(\${x * 15}px, \${-y * 15}px)\`;
                    }
                });
            });

            function launchTrip() {
                const btn = document.querySelector('button');
                const id = document.getElementById('tripIdInput').value;
                if(!id) return;

                btn.innerHTML = '<svg class="animate-spin w-4 h-4 text-black" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
                btn.style.opacity = '0.8';
                setTimeout(() => { window.location.href = '/' + id; }, 500);
            }
        </script>
    </body>
    </html>
    `;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
}