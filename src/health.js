function health() {
  return { status: 'ok', service: 'social-campaign-publisher', timestamp: new Date().toISOString() };
}
module.exports = { health };
