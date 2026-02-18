interface ConditionalContentProps {
  loading: boolean;
  loadingContent: React.ReactNode;
  loadedContent: React.ReactNode;
}

export const ConditionalContent: React.FC<ConditionalContentProps> = ({
  loading,
  loadingContent,
  loadedContent,
}) => {
  return loading ? loadingContent : loadedContent;
};
