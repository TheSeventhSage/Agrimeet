export const login = async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 500));
    if (!email || !password) throw new Error('Email and password required');
    return { user: { id: 'u1', name: 'Seller Jane', email } };
};

export const register = async ({ name, email, password }) => {
    await new Promise(r => setTimeout(r, 600));
    if (!name || !email || !password) throw new Error('All fields required');
    return { ok: true };
};

export const requestReset = async ({ email }) => {
    await new Promise(r => setTimeout(r, 500));
    if (!email) throw new Error('Email required');
    return { ok: true };
};

export const verifyOtp = async ({ email, code }) => {
    await new Promise(r => setTimeout(r, 500));
    if (!email || !code || code.replace(/\D/g, '').length < 6) {
        throw new Error('Invalid code');
    }
    return { ok: true };
};
