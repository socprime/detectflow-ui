import { getQueryParam, updateQueryParams } from '@/utils';
import { useSearchParams } from 'react-router-dom';
import { isPipelinesTabValue, PIPELINES_DEFAULT_TAB, PIPELINES_TAB_PARAM } from './constants';

export const usePipelinesTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = getQueryParam(searchParams, PIPELINES_TAB_PARAM, PIPELINES_DEFAULT_TAB);
  const activeTab = isPipelinesTabValue(tabFromUrl) ? tabFromUrl : PIPELINES_DEFAULT_TAB;

  const handleTabChange = (value: string) => {
    setSearchParams(
      (prev) =>
        updateQueryParams(prev, {
          [PIPELINES_TAB_PARAM]: value === PIPELINES_DEFAULT_TAB ? null : value,
        }),
      { replace: true },
    );
  };

  return {
    activeTab,
    handleTabChange,
  };
};
