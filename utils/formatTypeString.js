function formatString(str) {
    return str
        .replace(/_/g, ' ')                  // reemplaza _ por espacio
        .replace(/\b\w/g, c => c.toUpperCase()); // capitaliza cada palabra
}

module.exports = formatString;