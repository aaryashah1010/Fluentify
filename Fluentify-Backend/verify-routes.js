import axios from 'axios';

const BASE_URL = 'http://localhost:5050/api/admin/users';
// Mock admin token - in a real scenario we'd need to login first, 
// but for now we'll assume we can hit it or we'll see 401 which confirms the route exists.
// Wait, the routes are protected. I need a valid token.
// Since I can't easily get a token without login flow, I will check if the server restarts successfully 
// and if the routes are registered by checking the startup logs or just hitting health check.
// Actually, I can try to hit the endpoint and expect a 401, which means the route is there.
// If the route was missing or 404, it would be different (though 404 might also be returned by auth middleware if user not found, but here it's the route itself).

async function verifyRoutes() {
    try {
        console.log("Testing GET /api/admin/users...");
        await axios.get(BASE_URL);
    } catch (error) {
        if (error.response) {
            console.log(`Response Status: ${error.response.status}`);
            console.log(`Response Data:`, error.response.data);
            if (error.response.status === 401 || error.response.status === 403) {
                console.log("✅ Route exists and is protected (Authentication working).");
            } else if (error.response.status === 404) {
                console.log("❌ Route not found (404).");
            } else {
                console.log(`⚠️ Unexpected status: ${error.response.status}`);
            }
        } else {
            console.error("Error connecting to server:", error.message);
        }
    }
}

verifyRoutes();
