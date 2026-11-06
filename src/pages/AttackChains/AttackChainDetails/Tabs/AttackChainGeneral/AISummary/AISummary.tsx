interface AISummaryProps {
  aiSummary: any[];
}

export const AISummary: React.FC<AISummaryProps> = ({ aiSummary }) => {
  return (
    <div className="flex flex-col gap-6 font-light">
      {aiSummary.map((summary: string, index: number) => (
        <p key={index} className="text-subdued">
          {summary}
        </p>
      ))}
    </div>
  );
};
