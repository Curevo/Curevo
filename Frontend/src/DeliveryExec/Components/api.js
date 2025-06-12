const API_BASE_URL = 'http://localhost:8080/api'; // Update with your Spring Boot URL

export const fetchDashboardData = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
    }
    return response.json();
};

export const updateReadyStatus = async (status) => {
    const response = await fetch(`${API_BASE_URL}/status/ready`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update ready status');
    }
    return response.json();
};

export const updateOrderStatus = async (status) => {
    const response = await fetch(`${API_BASE_URL}/status/orders`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update order status');
    }
    return response.json();
};