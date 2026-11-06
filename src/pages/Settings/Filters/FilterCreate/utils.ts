const placeholderIndent = '\u00A0';

export const pipelineFilterPlaceholder = [
  '# detection:',
  `# ${placeholderIndent.repeat(2)}condition: selection`,
  `# ${placeholderIndent.repeat(2)}selection:`,
  `# ${placeholderIndent.repeat(4)}EventID: 4624`,
  `# ${placeholderIndent.repeat(4)}LogonType: 3`,
].join('\n');

const ruleFilterPlaceholders: Record<string, string> = {
  'sentinel-kql-rule': 'Computer == "ad-server-1" OR Computer == "ad-server-2"',
};

export const getRuleFilterPlaceholder = (platform?: string) => {
  if (!platform) {
    return 'Select a platform to enter a filter condition';
  }

  return ruleFilterPlaceholders[platform] || pipelineFilterPlaceholder;
};
