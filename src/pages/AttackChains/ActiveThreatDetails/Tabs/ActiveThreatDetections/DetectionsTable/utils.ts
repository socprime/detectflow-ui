import { RuleCheckResults } from '@/models/providers/Types/responses/attackChains';

export const buildRuleIssuesMap = (ruleCheckResults?: RuleCheckResults): Map<string, string> => {
  const issuesMap = new Map<string, string>();

  if (!ruleCheckResults) {
    return issuesMap;
  }

  ruleCheckResults.unsupported_rules.forEach((rule) => {
    if (rule.description) {
      issuesMap.set(rule.rule_id, rule.description);
    }
  });

  ruleCheckResults.not_connected_rules.forEach((rule) => {
    if (rule.description) {
      issuesMap.set(rule.rule_id, rule.description);
    }
  });

  ruleCheckResults.disabled_rules.forEach((rule) => {
    const pipelineNames = rule.pipelines.map((pipeline) => pipeline.name).join(', ');
    const description =
      rule.description ??
      `This detection has been disabled in the following pipelines: ${pipelineNames}`;

    issuesMap.set(rule.rule_id, description);
  });

  return issuesMap;
};
