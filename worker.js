import homeHtml from './pages/home.html';
import tripHtml from './pages/trip.html';

const html = (content) => new Response(content, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
const json = (data) => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
const key = (id) => `trip_${id}.json`;
const defaultData = { itinerary: [], checklists: [] };

async function getData(env, tripId) {
    const obj = await env.BUCKET.get(key(tripId));
    return obj ? await obj.json() : defaultData;
}

async function saveData(env, tripId, data) {
    await env.BUCKET.put(key(tripId), JSON.stringify(data));
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const segments = path.split('/');

        if (path === '/' || path === '') return html(homeHtml);
        if (segments.length === 2 && segments[1]) return html(tripHtml);
        if (segments[1] !== 'api' || segments[2] !== 'trip') return new Response('Not Found', { status: 404 });

        const tripId = segments[3];
        const resource = segments[4];
        const id = segments[5];
        const method = request.method;

        let data = await getData(env, tripId);
        let body = {};
        if (method === 'POST' || method === 'PATCH') {
            try { body = await request.json(); } catch (e) {}
        }

        if (method === 'GET' && !resource) return json(data);

        if (resource === 'itinary') {
            if (method === 'POST') {
                data.itinerary.push({ ...body, id: crypto.randomUUID(), done: false });
                await saveData(env, tripId, data);
                return new Response(null, { status: 201 });
            }
            if (method === 'PATCH' && id) {
                data.itinerary = data.itinerary.map(i => i.id === id ? { ...i, ...body } : i);
                await saveData(env, tripId, data);
                return new Response(null, { status: 200 });
            }
            if (method === 'DELETE' && id) {
                data.itinerary = data.itinerary.filter(i => i.id !== id);
                await saveData(env, tripId, data);
                return new Response(null, { status: 204 });
            }
        }

        if (resource === 'checklist') {
            if (method === 'POST') {
                data.checklists.push({ id: crypto.randomUUID(), icon: body.listIcon, title: body.listTitle, items: [] });
                await saveData(env, tripId, data);
                return new Response(null, { status: 201 });
            }
            if (method === 'PATCH' && id) {
                const list = data.checklists.find(l => l.id === id);
                if (list) {
                    if (body.deleteItem && body.itemId) {
                        list.items = list.items.filter(i => i.id !== body.itemId);
                    } else if (body.itemText) {
                        list.items.push({ id: crypto.randomUUID(), text: body.itemText, done: false });
                    } else if (body.itemId) {
                        const item = list.items.find(i => i.id === body.itemId);
                        if (item) Object.assign(item, body);
                    } else {
                        if (body.listTitle) list.title = body.listTitle;
                        if (body.listIcon) list.icon = body.listIcon;
                    }
                    await saveData(env, tripId, data);
                    return new Response(null, { status: 200 });
                }
            }
            if (method === 'DELETE' && id) {
                data.checklists = data.checklists.filter(l => l.id !== id);
                await saveData(env, tripId, data);
                return new Response(null, { status: 204 });
            }
        }

        return new Response('Not Found', { status: 404 });
    }
};
