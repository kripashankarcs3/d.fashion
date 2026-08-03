import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface EmptyAnalysisStateProps {
  title?: string;
  description?: string;
}

export function EmptyAnalysisState({
  title = 'No report yet',
  description = 'Upload a selfie to reveal your colour season and personal palette.',
}: EmptyAnalysisStateProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex items-end gap-2" aria-hidden="true">
        {['#F5F0E8', '#D4AF71', '#B8974A', '#8B6B56', '#2C1810'].map(
          (colour, i) => (
            <span
              key={colour}
              className="h-8 w-8 rounded-sm"
              style={{
                backgroundColor: colour,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                opacity: 1 - i * 0.12,
              }}
            />
          ),
        )}
      </div>
      <h2 className="font-serif text-[length:var(--text-h3)] text-cream-primary">
        {title}
      </h2>
      <p className="max-w-md text-[length:var(--text-body)] text-cream-primary/80">
        {description}
      </p>
      <Link href="/upload" className="mt-2">
        <Button variant="primary" size="lg">
          Analyse My Colours
        </Button>
      </Link>
    </div>
  );
}
