import * as React from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  type CardProps,
} from '@/components/ui/card';

export interface TestimonialCardProps extends CardProps {
  name: string;
  quote: string;
  season: string;
  verified?: boolean;
  rating?: number;
  avatar?: React.ReactNode;
}

const MAX_RATING = 5;

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  (
    {
      className,
      name,
      quote,
      season,
      verified = false,
      rating = MAX_RATING,
      avatar,
      ...props
    },
    ref,
  ) => (
    <Card ref={ref} variant="testimonial" className={cn('', className)} {...props}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {avatar && <span aria-hidden="true">{avatar}</span>}
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[length:var(--text-body-sm)] font-semibold text-foreground">
                  {name}
                </span>
                {verified && (
                  <BadgeCheck
                    aria-label="Verified"
                    className="size-4 shrink-0 text-gold-primary"
                  />
                )}
              </div>
              <span
                role="img"
                aria-label={`${rating} out of 5 stars`}
                className="flex items-center gap-0.5 text-gold-primary"
              >
                {Array.from({ length: MAX_RATING }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={cn(
                      'size-3.5',
                      i < rating ? 'fill-current' : 'opacity-30',
                    )}
                  />
                ))}
              </span>
            </div>
          </div>
          <span className="shrink-0 text-[length:var(--text-micro)] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-dark">
            {season}
          </span>
        </div>
        <p className="text-[length:var(--text-body)] italic leading-relaxed text-espresso-light">
          &ldquo;{quote}&rdquo;
        </p>
      </CardContent>
    </Card>
  ),
);
TestimonialCard.displayName = 'TestimonialCard';

export { TestimonialCard };
