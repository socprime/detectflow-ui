import type { PipelineDestination } from '@/models/providers/Types/responses/pipelines';

interface WithDestinations {
  destinations?: PipelineDestination[];
}

export function getPipelineDestinations(pipeline: WithDestinations): PipelineDestination[] {
  return pipeline.destinations ?? [];
}

export function getPipelineDestinationTopics(pipeline: WithDestinations): string[] {
  return getPipelineDestinations(pipeline).map((d) => d.topic);
}

export function destinationAcceptsUntagged(destination: PipelineDestination): boolean {
  return destination.output_mode === 'all_events' || destination.output_mode === 'unmatched_only';
}
