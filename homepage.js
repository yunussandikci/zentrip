export function handleHome(request) {
    const html = `
    <!DOCTYPE html>
    <html lang="en" class="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZenTrip - Plan Your Journey</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
            
            :root {
                --primary-purple: #A855F7;
                --deep-bg: #030005;
            }

            body { 
                font-family: 'Plus Jakarta Sans', sans-serif; 
                background-color: var(--deep-bg);
                color: #fff; 
                overflow-x: hidden;
            }
            
            h1, h2, h3, .brand-font {
                font-family: 'Outfit', sans-serif;
            }
  
            /* --- Liquid Background Animation --- */
            .liquid-bg-container {
                position: fixed;
                inset: 0;
                z-index: -1;
                overflow: hidden;
                background: #050505;
            }

            .orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(80px);
                opacity: 0.6;
                animation: float-liquid 20s ease-in-out infinite alternate;
            }

            .orb-1 { width: 50vw; height: 50vw; top: -10%; left: -10%; background: radial-gradient(circle, #7e22ce 0%, transparent 70%); animation-delay: 0s; }
            .orb-2 { width: 40vw; height: 40vw; bottom: -10%; right: -5%; background: radial-gradient(circle, #4c1d95 0%, transparent 70%); animation-delay: -5s; }
            .orb-3 { width: 30vw; height: 30vw; top: 40%; left: 30%; background: radial-gradient(circle, #3b82f6 0%, transparent 70%); opacity: 0.3; animation-delay: -10s; }

            @keyframes float-liquid {
                0% { transform: translate(0, 0) scale(1) rotate(0deg); }
                50% { transform: translate(30px, 20px) scale(1.1) rotate(10deg); }
                100% { transform: translate(-20px, 40px) scale(0.9) rotate(-5deg); }
            }

            /* --- Liquid Glass Effect --- */
            .glass-panel {
                background: rgba(255, 255, 255, 0.03);
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .glass-panel:hover {
                background: rgba(255, 255, 255, 0.06);
                border-color: rgba(168, 85, 247, 0.3); /* Purple tint on hover */
                transform: translateY(-5px);
                box-shadow: 0 30px 60px rgba(168, 85, 247, 0.15);
            }

            /* --- Hero Input Area --- */
            .hero-glass {
                background: rgba(10, 10, 10, 0.6);
                backdrop-filter: blur(40px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 50px rgba(0,0,0,0.5);
                position: relative;
                overflow: hidden;
            }

            .hero-glass::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent);
                transform: skewX(-20deg) translateX(-150%);
                transition: transform 0.5s;
                pointer-events: none;
            }

            .hero-glass:hover::before {
                transform: skewX(-20deg) translateX(150%);
                transition: transform 1.5s;
            }

            /* --- Typography Gradients --- */
            .text-glow {
                text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
            }
            
            .gradient-text {
                background: linear-gradient(135deg, #fff 0%, #d8b4fe 100%);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
        </style>
    </head>
    <body class="min-h-screen flex flex-col items-center selection:bg-purple-500/30 selection:text-white">

        <div class="liquid-bg-container">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
        </div>

        <nav class="w-full max-w-7xl px-6 py-8 flex justify-between items-center z-50">
            <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-pulse"></div>
                <span class="text-xl font-bold tracking-wide brand-font text-white">ZenTrip</span>
            </div>
            <div class="glass-panel px-4 py-1.5 rounded-full text-xs font-semibold text-white/60 uppercase tracking-widest border border-white/5">
                Beta
            </div>
        </nav>

        <main class="flex-1 w-full max-w-5xl px-6 flex flex-col items-center justify-center text-center z-10 -mt-10">
            
            <h1 class="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05]">
                <span class="gradient-text">Plan fluidly.</span><br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 text-glow">Travel calmly.</span>
            </h1>

            <p class="text-lg md:text-xl text-white/50 mb-12 max-w-2xl font-light leading-relaxed">
                The minimalist workspace for your travels. 
                <span class="text-white/80">Collaborate in real-time</span> on itineraries, docs, and packing lists. No login required.
            </p>

            <div class="w-full max-w-lg mx-auto">
                <div class="hero-glass p-2 flex items-center gap-2 group">
                    
                    <div class="pl-4 pr-2 text-purple-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    </div>

                    <div class="flex-1 flex flex-col items-start justify-center overflow-hidden">
                        <label class="text-[10px] uppercase tracking-wider font-bold text-white/30 pl-1">Your Trip ID</label>
                        <input type="text" id="tripIdInput" readonly 
                            class="w-full bg-transparent border-none text-white font-mono text-lg focus:ring-0 p-0 placeholder-white/20 truncate"
                            value="...">
                    </div>

                    <button onclick="launchTrip()" class="bg-white text-black hover:bg-purple-50 transition-colors px-6 py-3.5 rounded-xl font-bold text-base flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] shrink-0">
                        <span>Launch</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                </div>
                <p class="mt-4 text-xs text-white/30 flex items-center justify-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Secure & Private · Generated locally
                </p>
            </div>

        </main>

        <footer class="w-full max-w-7xl px-6 pb-20 z-10 mt-20">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-purple-500 transform group-hover:scale-110 duration-500">
                        <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Smart Itinerary</h3>
                    <p class="text-sm text-white/50 leading-relaxed">
                        Visual timeline with auto-sorting. Attach locations, cover images, and notes to every event.
                    </p>
                </div>

                <div class="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                     <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500 transform group-hover:scale-110 duration-500">
                        <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Docs & Maps</h3>
                    <p class="text-sm text-white/50 leading-relaxed">
                        Centralize your chaos. Add Google Maps links and attach booking documents directly to items.
                    </p>
                </div>

                <div class="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                     <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500 transform group-hover:scale-110 duration-500">
                        <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Checklists</h3>
                    <p class="text-sm text-white/50 leading-relaxed">
                        Collaborative packing lists and to-dos. Real-time sync ensures everyone is ready to go.
                    </p>
                </div>

            </div>
        </footer>

        <script>
            document.addEventListener('DOMContentLoaded', () => {
                // Instant ID Generation
                const uuid = crypto.randomUUID();
                document.getElementById('tripIdInput').value = uuid;
            });

            function launchTrip() {
                const btn = document.querySelector('button');
                const id = document.getElementById('tripIdInput').value;

                if(!id) return;

                // Animation State
                btn.innerHTML = '<svg class="animate-spin w-5 h-5 text-black" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
                
                // Content Fade Out
                document.querySelector('main').style.transition = 'all 0.5s ease';
                document.querySelector('main').style.transform = 'scale(0.95)';
                document.querySelector('main').style.opacity = '0';
                
                document.querySelector('footer').style.transition = 'all 0.5s ease 0.1s';
                document.querySelector('footer').style.transform = 'translateY(20px)';
                document.querySelector('footer').style.opacity = '0';

                setTimeout(() => {
                    window.location.href = '/' + id;
                }, 600);
            }
        </script>
    </body>
    </html>
    `;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
}