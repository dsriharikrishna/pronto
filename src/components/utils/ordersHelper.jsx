function formatObjectToText(obj, parentKey = '') {
    let result = '';

    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            const arrayKey = `${parentKey}[${index}]`;
            if (typeof item === 'object' && item !== null) {
                result += formatObjectToText(item, arrayKey);
            } else {
                result += `${arrayKey}: ${formatValue(item)}\n`;
            }
        });
    } else if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;

            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            const value = obj[key];

            if (typeof value === 'object' && value !== null) {
                result += formatObjectToText(value, fullKey); 
            } else {
                result += `${fullKey}: ${formatValue(value)}\n`;
            }
        }
    }

    return result;
}

function formatValue(value) {
    if (typeof value === 'string') {
        return value
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return String(value);
}