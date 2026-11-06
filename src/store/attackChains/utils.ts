import type {
  AttackChainDetailResponse,
  AttackChainGraph,
  Technique,
} from '@/models/providers/Types/responses/attackChains';

const buildCodeOrderMap = (chainGraph: AttackChainGraph[]): Map<string, number> =>
  new Map(chainGraph.map((item, index) => [item.code, index]));

const compareTechniquesByChainGraph = (
  a: Technique,
  b: Technique,
  codeOrder: Map<string, number>,
): number => {
  const orderA = codeOrder.get(a.code) ?? Number.MAX_SAFE_INTEGER;
  const orderB = codeOrder.get(b.code) ?? Number.MAX_SAFE_INTEGER;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return a.code.localeCompare(b.code, undefined, { numeric: true });
};

export const normalizeAttackChainDetail = (
  detail: AttackChainDetailResponse,
): AttackChainDetailResponse => {
  const codeOrder = buildCodeOrderMap(detail.chain_graph ?? []);

  return {
    ...detail,
    techniques: [...(detail.techniques ?? [])].sort((a, b) =>
      compareTechniquesByChainGraph(a, b, codeOrder),
    ),
  };
};
