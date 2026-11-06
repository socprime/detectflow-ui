import type { MatchingUpdateFormData } from '../useMatchingUpdate';

export const validateDastination = {
  topic: (value: string | undefined, formValues: MatchingUpdateFormData) => {
    const topic = value?.trim();
    if (!topic) {
      return 'Destination topic is required';
    }
    const topics = formValues.destinations.map((d) => d.topic.trim());
    if (topics.filter((t) => t === topic).length > 1) {
      return 'Destination topic must be unique';
    }
    const sourceTopics = formValues.source_topics ?? [];
    if (sourceTopics.includes(topic)) {
      return 'Destination topic cannot be one of the source topics';
    }
    return true;
  },
};
