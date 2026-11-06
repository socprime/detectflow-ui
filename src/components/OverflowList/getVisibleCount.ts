export interface GetVisibleCountParams {
  itemWidths: number[];
  overflowWidth: number;
  containerWidth: number;
  gap?: number;
  maxVisible?: number;
}

const sumItemsWidth = (itemWidths: number[], count: number, gap: number) => {
  if (count <= 0) {
    return 0;
  }

  let width = 0;

  for (let index = 0; index < count; index += 1) {
    width += itemWidths[index] ?? 0;

    if (index > 0) {
      width += gap;
    }
  }

  return width;
};

export const getVisibleCount = ({
  itemWidths,
  overflowWidth,
  containerWidth,
  gap = 0,
  maxVisible,
}: GetVisibleCountParams): number => {
  const total = itemWidths.length;

  if (total === 0) {
    return 0;
  }

  const cappedTotal = maxVisible === undefined ? total : Math.min(total, Math.max(maxVisible, 0));

  if (containerWidth <= 0) {
    return cappedTotal;
  }

  if (cappedTotal === total && sumItemsWidth(itemWidths, total, gap) <= containerWidth) {
    return total;
  }

  let visible = 0;

  for (let count = 1; count <= cappedTotal; count += 1) {
    const needed = sumItemsWidth(itemWidths, count, gap) + gap + overflowWidth;

    if (needed <= containerWidth) {
      visible = count;
    } else {
      break;
    }
  }

  return visible;
};
