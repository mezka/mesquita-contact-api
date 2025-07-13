const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

function renderTemplate(templateName, data) {
  const filePath = path.join(__dirname, '../templates', templateName);
  const template = fs.readFileSync(filePath, 'utf8');
  return Mustache.render(template, data);
}

module.exports = renderTemplate;