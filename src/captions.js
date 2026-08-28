const fragments = {
  shared: 'Clear, useful, trustworthy brand voice.',
  instagram: 'Visual-first, concise, community-friendly. Add a few relevant hashtags.',
  x: 'Concise, direct, conversation-ready. Keep the link prominent.',
};

function composeCaption({ platform, title, summary, url }) {
  if (!fragments[platform]) throw new Error(`Unsupported platform: ${platform}`);
  return `${title}\n\n${summary}\n\n${url}\n\n${fragments.shared} ${fragments[platform]}`;
}

module.exports = { fragments, composeCaption };
