import { Link } from 'wouter';

interface EmptyAnalysisStateProps {
  title?: string;
  description?: string;
}

export function EmptyAnalysisState({
  title = 'No analysis yet',
  description = 'Upload a selfie to unlock this feature.',
}: EmptyAnalysisStateProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-4xl">✦</p>
      <h2 className="font-serif text-2xl">{title}</h2>
      <p className="text-muted-foreground font-accent max-w-md">{description}</p>
      <Link
        href="/upload"
        className="bg-foreground text-background px-6 py-3 rounded-full font-accent text-sm"
      >
        Analyze Your Style →
      </Link>
    </div>
  );
}