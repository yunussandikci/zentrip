import { handleHome } from './homepage.js';
import { handleTrip } from './trip.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/' || url.pathname === '') {
            return handleHome(request);
        }

        return handleTrip(request, env);
    }
};