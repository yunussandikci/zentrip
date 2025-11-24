const R2_KEY = (tripId) => `trip_${tripId}.json`;

async function getTripData(env, tripId) {
    const object = await env.BUCKET.get(R2_KEY(tripId));
    const defaultData = { itinerary: [], checklists: [] };
    return object ? await object.json() : defaultData;
}

async function saveTripData(env, tripId, data) {
    await env.BUCKET.put(R2_KEY(tripId), JSON.stringify(data));
}

export async function handleTrip(request, env) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(p => p.length > 0);
    const method = request.method;

    const tripId = pathSegments[0];
    const isApiCall = pathSegments.length === 2 && pathSegments[1] === 'data';

    if (!isApiCall) {
        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }

    if (method === 'GET') {
        const data = await getTripData(env, tripId);
        return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();
    const { context = 'itinerary', tripId: _, ...entryData } = body;
    const { id, done, listId, listTitle, listIcon, itemText } = body;

    let data = await getTripData(env, tripId);

    if (context === 'itinerary') {
        let itinerary = data.itinerary;
        if (method === 'POST') {
            itinerary.push({ ...entryData, id: crypto.randomUUID(), done: false });
        } else if (method === 'PUT') {
            const index = itinerary.findIndex(i => i.id === id);
            if (index !== -1) {
                itinerary[index] = { ...itinerary[index], ...entryData };
            }
        } else if (method === 'DELETE') {
            itinerary = itinerary.filter(i => i.id !== id);
        }
        data.itinerary = itinerary;
    } else if (context === 'checklists') {
        let lists = data.checklists;
        if (method === 'POST') {
            if (!listId) {
                lists.push({ id: crypto.randomUUID(), icon: listIcon, title: listTitle, items: [] });
            } else {
                const list = lists.find(l => l.id === listId);
                if (list) {
                    list.items.push({ id: crypto.randomUUID(), text: itemText, done: false });
                }
            }
        } else if (method === 'PUT') {
            const list = lists.find(l => l.id === listId);
            if (list) {
                if (id) {
                    const itemIndex = list.items.findIndex(i => i.id === id);
                    if (itemIndex !== -1) {
                        list.items[itemIndex].done = done;
                    }
                } else {
                    list.title = listTitle || list.title;
                    list.icon = listIcon || list.icon;
                }
            }
        } else if (method === 'DELETE') {
            if (id) {
                const list = lists.find(l => l.id === listId);
                if (list) {
                    list.items = list.items.filter(i => i.id !== id);
                }
            } else {
                lists = lists.filter(l => l.id !== listId);
            }
        }
        data.checklists = lists;
    }

    await saveTripData(env, tripId, data);
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
}

const htmlContent = `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ZenTrip - Peaceful Trip Planner</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        * { -ms-overflow-style: none; scrollbar-width: none; }
        ::-webkit-scrollbar { display: none; }
        
        :root {
            --bg-depth: #050505;
        }

        body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background-color: var(--bg-depth);
            color: #fff; 
            overflow-x: hidden;
        }
        
        h1, h2, h3, .brand-font { font-family: 'Outfit', sans-serif; }
        .overflow-hidden { overflow: hidden; }

        /* --- Aurora Background (Synced with Homepage) --- */
        .aurora-container {
            position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden;
        }
        .aurora-blob {
            position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.5;
            transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, #059669 0%, transparent 70%); animation: breath 12s infinite alternate; }
        .blob-2 { bottom: -10%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, #7c3aed 0%, transparent 70%); animation: breath 15s infinite alternate-reverse; }
        .blob-3 { top: 40%; left: 30%; width: 35vw; height: 35vw; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%); opacity: 0.3; animation: rotateBlob 25s infinite linear; }

        @keyframes breath { 0% { opacity: 0.3; scale: 1; } 100% { opacity: 0.5; scale: 1.1; } }
        @keyframes rotateBlob { from { transform: rotate(0deg) translate(30px) rotate(0deg); } to { transform: rotate(360deg) translate(30px) rotate(-360deg); } }


        /* --- UI Components --- */
        .nav-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; height: 70px; display: flex; align-items: flex-end; justify-content: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(5, 5, 5, 0.4); backdrop-filter: blur(20px); }
        .nav-inner { width: 100%; max-width: 42rem; padding: 0 20px 10px; display: flex; align-items: center; justify-content: space-between; }

        .sticky-header { position: sticky; top: 70px; z-index: 40; padding: 16px 24px 12px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 16px; background: rgba(5, 5, 5, 0.1); backdrop-filter: blur(15px); }
        
        .glass-input { width: 100%; height: 50px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; color: white; font-size: 17px; padding: 0 16px; outline: none; box-sizing: border-box; min-width: 0; transition: all 0.2s; }
        .glass-input:focus { border-color: #34d399; background: rgba(255, 255, 255, 0.12); }
        .glass-input.textarea { height: auto; padding-top: 12px; padding-bottom: 12px; min-height: 100px; resize: none; }
        
        .checkbox-ios { appearance: none; width: 24px; height: 24px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; background: transparent; cursor: pointer; }
        .checkbox-ios:checked { background-color: #34d399; border-color: #34d399; background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); }
 
        .nav-pill { 
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 60; display: flex; padding: 6px; border-radius: 99px;
            background: rgba(30, 30, 30, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .nav-pill-item { 
            padding: 8px 16px; border-radius: 99px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; 
            color: rgba(255, 255, 255, 0.6); 
            transition: all 0.3s ease; 
            border: 1px solid transparent;
        }

        .nav-pill-item.active { 
            color: #fff;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .modal-container { z-index: 70 !important; }
        
        /* Updated iOS Liquid Glass Style */
        .liquid-glass { 
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        .pill-btn { padding: 4px 10px; border-radius: 99px; font-weight: 600; font-size: 13px; transition: background-color 0.1s; display: inline-flex; align-items: center; justify-content: center; }
        .pill-btn.edit.glass { color: #D1D1D6; background-color: rgba(142, 142, 147, 0.2); }
        .pill-btn.add.glass { color: #34d399; background-color: rgba(16, 185, 129, 0.2); }
        .pill-btn.delete.glass { color: #FF453A; background-color: rgba(255, 69, 58, 0.2); }

        .gradient-dim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.3) 100%); }
        .gradient-separator { height: 1px; width: 100%; background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%); margin: 12px 0; }
        

        @keyframes pulse-emerald {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .time-indicator-dot { animation: pulse-emerald 2s infinite; }
    </style>
</head>
<body x-data="app()" x-init="initData()" :class="{'overflow-hidden': modalOpen}" class="min-h-screen pb-40">

    <div class="aurora-container">
        <div class="aurora-blob blob-1"></div>
        <div class="aurora-blob blob-2"></div>
        <div class="aurora-blob blob-3"></div>
    </div>

    <nav class="nav-bar">
        <div class="nav-inner">
            <div class="flex items-center">
                <span class="text-2xl mr-2">🧘</span>
                <h1 class="text-xl font-bold tracking-wide text-white brand-font">ZenTrip</h1>
                <div x-show="isFetching" class="ml-3 w-3 h-3 border-2 border-white/30 border-l-emerald-500 rounded-full animate-spin"></div>
            </div>
            <button @click="openAddModal()" class="pill-btn add glass liquid-glass !text-sm !px-4 !py-1.5">Add</button>
        </div>
    </nav>
    
    <div class="nav-pill">
        <div @click="page = 'itinerary'" class="nav-pill-item" :class="{'active': page === 'itinerary'}">
            <span class="text-xl">🌏</span> Itinerary
        </div>
        <div @click="page = 'checklists'" class="nav-pill-item" :class="{'active': page === 'checklists'}">
            <span class="text-xl">📝</span> Checklists
        </div>
    </div>

    <div x-show="modalOpen" 
         x-transition:enter="transition duration-300" 
         x-transition:enter-start="opacity-0" 
         x-transition:enter-end="opacity-100" 
         x-transition:leave="transition duration-200" 
         x-transition:leave-start="opacity-100" 
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 flex items-end justify-center pointer-events-none modal-container">
        
        <div x-show="modalOpen" @click="modalOpen = false" class="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"></div>
        
        <div x-show="modalOpen" 
             x-transition:enter="transition ease-[cubic-bezier(0.19,1,0.22,1)] duration-500" 
             x-transition:enter-start="translate-y-full opacity-0" 
             x-transition:enter-end="translate-y-0 opacity-100" 
             x-transition:leave="transition ease-in duration-300" 
             x-transition:leave-start="translate-y-0 opacity-100" 
             x-transition:leave-end="translate-y-full opacity-0"
             class="w-full max-w-2xl liquid-glass rounded-t-3xl border-b-0 p-4 sm:p-6 pb-10 max-h-[95vh] min-h-[40vh] overflow-y-auto relative shadow-2xl pointer-events-auto">
            
            <div class="flex justify-between items-center mb-6">
                <button @click="modalOpen = false" class="text-white/60 text-base">Cancel</button>
                <span class="text-white font-bold text-base" x-text="getModalTitle()"></span>
                <button @click="submitCurrentForm()" class="text-emerald-400 font-bold text-base" :class="{'opacity-50': !isFormValid()}" x-text="isEditing ? 'Done' : 'Add'"></button>
            </div>

            <div x-show="modalContext === 'itinerary'" class="space-y-5">
                <div class="flex gap-3">
                    <div class="w-[70px] shrink-0">
                        <label class="text-xs text-white/40 pl-2 mb-1 block">Emoji</label>
                        <input type="text" maxlength="2" x-model="form.emoji" class="glass-input text-center text-3xl !px-0">
                    </div>
                    <div class="flex-1 min-w-0">
                        <label class="text-xs text-white/40 pl-2 mb-1 block">Title</label>
                        <input type="text" x-model="form.title" class="glass-input" placeholder="e.g. Flight">
                    </div>
                </div>
                <div>
                    <label class="text-xs text-white/40 pl-2 mb-1 block">Description</label>
                    <textarea x-model="form.desc" class="glass-input textarea" placeholder="Details..."></textarea>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="min-w-0">
                        <label class="text-xs text-white/40 pl-2 mb-1 block">Date</label>
                        <input type="date" x-model="form.date" class="glass-input w-full max-w-full appearance-none [color-scheme:dark]">
                    </div>
                    <div class="min-w-0">
                        <label class="text-xs text-white/40 pl-2 mb-1 block">Time</label>
                        <input type="time" x-model="form.time" class="glass-input w-full max-w-full appearance-none [color-scheme:dark]">
                    </div>
                </div>
                <div>
                    <label class="text-xs text-white/40 pl-2 mb-1 block">Cover Image URL</label>
                    <input type="text" x-model="form.bgImage" class="glass-input" placeholder="https://...">
                </div>
                <div>
                    <label class="text-xs text-white/40 pl-2 mb-1 block">Map Link</label>
                    <input type="text" x-model="form.locationUrl" class="glass-input" placeholder="Google Maps URL">
                </div>
                <div class="pt-2">
                    <div class="flex justify-between items-center mb-3 pl-1">
                        <label class="text-xs text-white/40">Documents</label>
                        <button @click="addItemDoc" type="button" class="text-xs text-emerald-400 font-bold">+ Add File</button>
                    </div>
                    <div class="space-y-3">
                        <template x-for="(doc, index) in form.docs" :key="index">
                            <div class="flex gap-2">
                                <input type="text" x-model="doc.name" placeholder="Name" class="glass-input !h-10 !text-sm w-1/3">
                                <input type="text" x-model="doc.url" placeholder="URL" class="glass-input !h-10 !text-sm w-2/3">
                                <button @click="removeItemDoc(index)" type="button" class="text-red-500 px-2">✕</button>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div x-show="modalContext === 'checklists'" class="space-y-5">
                <div class="flex gap-3">
                    <div class="w-[70px] shrink-0">
                        <label class="text-xs text-white/40 pl-2 mb-1 block">Icon</label>
                        <input type="text" maxlength="2" x-model="form.listIcon" class="glass-input text-center text-3xl !px-0">
                    </div>
                    <div class="flex-1 min-w-0">
                        <label class="text-xs text-white/40 pl-2 mb-1 block">Title</label>
                        <input type="text" x-model="form.listTitle" class="glass-input" placeholder="e.g. Packing List">
                    </div>
                </div>
            </div>
            <div x-show="modalContext === 'checklist_item'" class="space-y-5">
                <div class="flex flex-col">
                    <label class="text-xs text-white/40 pl-2 mb-1 block">Item Text</label>
                    <input type="text" x-model="form.itemText" class="glass-input" placeholder="e.g. Toothbrush">
                </div>
                <p class="text-white/50 text-sm">Adding item to list: <span class="font-bold text-white" x-text="form.listTitle"></span></p>
            </div>
        </div>
    </div>

    <div class="pt-[70px] w-full max-w-2xl mx-auto">
        
        <div x-show="page === 'itinerary'" 
             x-transition:enter="transition ease-out duration-300 delay-100" 
             x-transition:enter-start="opacity-0 translate-y-4" 
             x-transition:enter-end="opacity-100 translate-y-0"
             class="relative">
            
            <div x-show="itinerary.length > 0">
                <template x-for="(group, dateKey) in groupedItinerary" :key="dateKey">
                    <div>
                        <div class="sticky-header flex justify-between items-center rounded-b-2xl">
                            <h2 class="text-lg font-bold text-emerald-400 tracking-wide brand-font" x-text="formatDate(dateKey)"></h2>
                            <span x-show="dateKey === currentDateString" class="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Today</span>
                        </div>

                        <div class="pl-2 pr-3 relative">
                            <template x-for="(item, index) in group" :key="item.id">
                                <div class="relative w-full pb-8 pl-6">
                                    
                                    <div x-show="index !== group.length - 1" 
                                         class="absolute left-[7px] top-6 bottom-[-24px] w-[2px] bg-white/10 z-0">
                                    </div>

                                    <template x-if="dateKey === currentDateString && index === 0 && currentTimeString < item.time">
                                        <div class="absolute left-[-2px] -top-6 z-20">
                                            <div class="w-5 h-5 rounded-full bg-emerald-500 border-4 border-black time-indicator-dot shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                                        </div>
                                    </template>

                                    <div class="absolute top-6 left-[1px] w-3.5 h-3.5 rounded-full bg-zinc-800 border-2 border-white/30 z-10"
                                         :class="{'!bg-emerald-500 !border-emerald-500': item.done}"></div>

                                    <div class="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg bg-zinc-900/80 backdrop-blur-md transition-all duration-300" 
                                         :class="{'!border-emerald-500/50': item.done}">
                                        <div class="absolute inset-0 z-0">
                                            <template x-if="item.bgImage">
                                                <img :src="item.bgImage" class="w-full h-full object-cover" :class="{'grayscale blur-sm': item.done}">
                                            </template>
                                            <div class="gradient-dim"></div>
                                        </div>

                                        <div class="relative z-10 p-4 flex flex-col h-full">
                                            <div class="flex justify-between items-start">
                                                <span class="text-3xl font-bold text-white tracking-wide" x-text="item.time"></span>
                                                <div class="flex items-center gap-2">
                                                    <button @click="openEditItineraryModal(item)" class="pill-btn edit glass liquid-glass">Edit</button>
                                                    <button @click="deleteItineraryItem(item.id)" class="pill-btn delete glass liquid-glass">Delete</button>
                                                </div>
                                            </div>
                                            
                                            <div class="gradient-separator"></div>

                                            <div class="flex items-start space-x-3">
                                                <div class="text-4xl w-10 flex justify-center pt-1 shrink-0" x-text="item.emoji"></div>
                                                <div class="flex-1 pt-1 min-w-0">
                                                    <h3 class="text-xl font-bold text-white leading-none mb-1" x-text="item.title"></h3>
                                                    <p class="text-sm text-white/80 whitespace-pre-wrap" x-text="item.desc"></p>
                                                </div>
                                            </div>
                                            
                                            <div class="gradient-separator"></div>
                                            
                                            <div class="flex items-center justify-between mt-auto pt-1">
                                                <div class="flex flex-wrap gap-2">
                                                    <a x-show="item.locationUrl" :href="item.locationUrl" target="_blank" class="flex items-center gap-1.5 pill-btn add glass !px-3 !py-1 liquid-glass">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                        <span>Directions</span>
                                                    </a>
                                                    <template x-for="doc in item.docs" :key="doc.url">
                                                        <a :href="doc.url" target="_blank" class="flex items-center gap-1.5 pill-btn edit glass liquid-glass !text-xs !py-1 !px-3">
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                                                            <span x-text="doc.name"></span>
                                                        </a>
                                                    </template>
                                                </div>
                                                <div @click="toggleDoneItineraryItem(item.id)" class="cursor-pointer pl-4 shrink-0">
                                                    <input type="checkbox" :checked="item.done" class="checkbox-ios !w-9 !h-9 pointer-events-none">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <template x-if="dateKey === currentDateString && currentTimeString >= item.time && (index === group.length - 1 || currentTimeString < group[index+1].time)">
                                        <div class="absolute left-[-2px] z-20" 
                                             :class="index === group.length - 1 ? 'top-6' : 'bottom-[-10px]'">
                                            <div class="w-5 h-5 rounded-full bg-emerald-500 border-4 border-black time-indicator-dot shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                                        </div>
                                    </template>

                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
            
            <div x-show="itinerary.length === 0" class="flex flex-col items-center justify-center h-[60vh] text-white/30">
                <div class="text-6xl mb-4">🌏</div>
                <p class="text-lg font-medium">No itinerary items</p>
            </div>
        </div>

        <div x-show="page === 'checklists'" 
             x-transition:enter="transition ease-out duration-300 delay-100" 
             x-transition:enter-start="opacity-0 translate-y-4" 
             x-transition:enter-end="opacity-100 translate-y-0"
             class="relative">
            <div x-show="checklists.length > 0">
                <div class="px-4 space-y-8">
                    <template x-for="list in checklists" :key="list.id">
                        <div class="w-full liquid-glass border border-white/10 rounded-2xl p-4 shadow-xl">
                            <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                                <div @click="openEditChecklistModal(list)" class="flex items-center gap-3 cursor-pointer group">
                                    <span class="text-3xl shrink-0" x-text="list.icon || '🎒'"></span>
                                    <h3 class="text-xl font-bold text-white" x-text="list.title"></h3>
                                </div>
                                <div class="flex items-center gap-2 shrink-0">
                                    <button @click="openAddChecklistItemModal(list.id, list.title)" type="button" class="pill-btn add glass liquid-glass">Add</button>
                                    <button @click="deleteChecklist(list.id)" type="button" class="pill-btn delete glass liquid-glass">Delete</button>
                                </div>
                            </div>
                            <div class="space-y-2 pt-2">
                                <template x-for="item in list.items" :key="item.id">
                                    <div class="flex items-center justify-between bg-black/20 p-3 rounded-lg transition-all duration-300 hover:bg-black/30" 
                                         :class="{'opacity-50 line-through text-white/50': item.done}">
                                        <div class="flex items-center gap-3 flex-1 min-w-0">
                                            <div @click="toggleDoneChecklistItem(list.id, item.id, item.done)" class="cursor-pointer shrink-0">
                                                <input type="checkbox" :checked="item.done" class="checkbox-ios w-5 h-5 pointer-events-none">
                                            </div>
                                            <span x-text="item.text" class="text-white flex-1 min-w-0 pr-4 break-words"></span>
                                        </div>
                                        <button @click="deleteChecklistItem(list.id, item.id)" type="button" class="pill-btn delete glass liquid-glass !text-xs !py-1 !px-3 shrink-0">Delete</button>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div x-show="checklists.length === 0" class="flex flex-col items-center justify-center h-[60vh] text-white/30">
                <div class="text-6xl mb-4">🎒</div>
                <p class="text-lg font-medium">No checklists</p>
            </div>
        </div>
    </div>

    <script>
        function app() {
            const defaultItineraryForm = () => ({
                id: null, emoji: '📍', title: '', desc: '', 
                date: new Date().toISOString().split('T')[0], 
                time: '09:00', bgImage: '', locationUrl: '', docs: []
            });
            const defaultChecklistForm = () => ({ listId: null, listIcon: '🎒', listTitle: '' });
            const defaultChecklistItemForm = (listId = null, listTitle = '') => ({ listId: listId, itemText: '', listTitle: listTitle });

            return {
                isFetching: true,
                tripId: '',
                page: 'itinerary',
                itinerary: [],
                checklists: [],
                now: new Date(),
                
                modalOpen: false,
                modalContext: 'itinerary',
                isEditing: false,
                form: defaultItineraryForm(),

                async initData() {
                    this.tripId = window.location.pathname.substring(1).split('/')[0];
                    setInterval(() => { this.now = new Date(); }, 30000);
                    this.isFetching = true;
                    await this.fetchData();
                    this.isFetching = false;
                    setInterval(() => this.fetchData(), 10000);
                },
                
                get currentDateString() {
                    const y = this.now.getFullYear();
                    const m = String(this.now.getMonth() + 1).padStart(2, '0');
                    const d = String(this.now.getDate()).padStart(2, '0');
                    return \`\${y}-\${m}-\${d}\`;
                },

                get currentTimeString() {
                    const h = String(this.now.getHours()).padStart(2, '0');
                    const m = String(this.now.getMinutes()).padStart(2, '0');
                    return \`\${h}:\${m}\`;
                },

                get groupedItinerary() {
                    return this.itinerary.sort((a, b) => {
                        return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
                    }).reduce((acc, item) => {
                        (acc[item.date] = acc[item.date] || []).push(item);
                        return acc;
                    }, {});
                },

                formatDate(str) {
                    const d = new Date(str);
                    const day = d.getDate();
                    const month = d.toLocaleDateString('en-US', { month: 'long' });
                    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
                    return \`\${day} \${month}, \${weekday}\`;
                },
                
                isFormValid() {
                    if(this.modalContext === 'itinerary') return !!this.form.title;
                    if(this.modalContext === 'checklists') return !!this.form.listTitle;
                    if(this.modalContext === 'checklist_item') return !!this.form.itemText;
                    return false;
                },

                getModalTitle() {
                    if(this.modalContext === 'itinerary') return this.isEditing ? 'Edit Activity' : 'New Activity';
                    if(this.modalContext === 'checklist_item') return 'Add Item to List';
                    return this.isEditing ? 'Edit Checklist' : 'New Checklist';
                },

                openAddModal() { this.openModal(this.page); },
                
                openModal(context, data = null) { 
                    this.modalContext = context;
                    this.isEditing = !!data;
                    if (context === 'itinerary') {
                        this.form = data ? { ...data } : defaultItineraryForm();
                    } else if (context === 'checklists') {
                        this.form = data ? { listId: data.id, listIcon: data.icon, listTitle: data.title } : defaultChecklistForm();
                    }
                    this.modalOpen = true; 
                },
                
                openAddChecklistItemModal(listId, listTitle) {
                    this.modalContext = 'checklist_item';
                    this.isEditing = false;
                    this.form = defaultChecklistItemForm(listId, listTitle);
                    this.modalOpen = true;
                },
                
                openEditItineraryModal(item) { this.openModal('itinerary', item); },
                openEditChecklistModal(list) { this.openModal('checklists', list); },
                addItemDoc() { this.form.docs.push({ name: '', url: '' }); },
                removeItemDoc(i) { this.form.docs.splice(i, 1); },
                
                submitCurrentForm() {
                    if (this.modalContext === 'itinerary') return this.submitItineraryForm();
                    if (this.modalContext === 'checklists') return this.submitChecklistForm();
                    if (this.modalContext === 'checklist_item') return this.submitChecklistItemForm();
                },

                async submitItineraryForm() {
                    if(!this.form.title) return;
                    const method = this.isEditing ? 'PUT' : 'POST';
                    const payload = { ...this.form, tripId: this.tripId, context: 'itinerary' }; 
                    await this.apiCall(method, payload);
                    this.modalOpen = false;
                    await this.fetchData();
                },

                async toggleDoneItineraryItem(id) {
                    const item = this.itinerary.find(i => i.id === id);
                    if(item) {
                        const newDoneState = !item.done;
                        item.done = newDoneState;
                        await this.apiCall('PUT', { id: item.id, done: newDoneState, tripId: this.tripId, context: 'itinerary' });
                    }
                },

                async deleteItineraryItem(id) {
                    if(!confirm('Delete this itinerary item?')) return;
                    await this.apiCall('DELETE', { id, tripId: this.tripId, context: 'itinerary' });
                    await this.fetchData();
                },
                
                async submitChecklistForm() {
                    if(!this.form.listTitle) return;
                    const method = this.isEditing ? 'PUT' : 'POST';
                    const payload = { ...this.form, tripId: this.tripId, context: 'checklists' };
                    await this.apiCall(method, payload);
                    this.modalOpen = false;
                    await this.fetchData();
                },
                
                async submitChecklistItemForm() {
                    if (!this.form.itemText) return;
                    await this.apiCall('POST', { tripId: this.tripId, context: 'checklists', listId: this.form.listId, itemText: this.form.itemText });
                    this.modalOpen = false;
                    await this.fetchData();
                },

                async toggleDoneChecklistItem(listId, itemId, currentState) {
                    const list = this.checklists.find(l => l.id === listId);
                    if (list) {
                        const item = list.items.find(i => i.id === itemId);
                        if (item) item.done = !currentState;
                    }
                    await this.apiCall('PUT', { tripId: this.tripId, context: 'checklists', listId: listId, id: itemId, done: !currentState });
                },
                
                async deleteChecklistItem(listId, itemId) {
                    if(!confirm('Delete this checklist item?')) return;
                    await this.apiCall('DELETE', { tripId: this.tripId, context: 'checklists', listId: listId, id: itemId });
                    await this.fetchData();
                },

                async deleteChecklist(listId) {
                    if(!confirm('Delete this entire checklist?')) return;
                    await this.apiCall('DELETE', { tripId: this.tripId, context: 'checklists', listId: listId });
                    await this.fetchData();
                },

                async apiCall(method, body) {
                    this.isFetching = true;
                    await fetch(\`/\${this.tripId}/data\`, {
                        method, headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    this.isFetching = false;
                },

                async fetchData() {
                    this.isFetching = true;
                    try {
                        const res = await fetch(\`/\${this.tripId}/data\`);
                        if (res.ok) {
                            const newData = await res.json();
                            if (JSON.stringify(this.itinerary) !== JSON.stringify(newData.itinerary) ||
                                JSON.stringify(this.checklists) !== JSON.stringify(newData.checklists)) {
                                this.itinerary = newData.itinerary || [];
                                this.checklists = newData.checklists || [];
                            }
                        }
                    } catch (e) { console.error("Fetch error", e); }
                    this.isFetching = false;
                }
            }
        }
    </script>
</body>
</html>
`;