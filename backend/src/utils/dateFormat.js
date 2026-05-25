export const toMySQLDatetime = (isoString) => {
    if (!isoString) return null;
    return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
    // "2025-06-01T00:00:00Z" → "2025-06-01 00:00:00"
};