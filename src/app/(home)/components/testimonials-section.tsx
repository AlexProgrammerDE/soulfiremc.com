import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: { quote: string; author: string; authorNote?: string }[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">What Users Say</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <Card key={`${t.author}:${t.quote}`} className="p-5 gap-3">
            <Quote className="h-5 w-5 text-muted-foreground/50" />
            <blockquote className="text-muted-foreground italic">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{t.author}</p>
              {t.authorNote && (
                <p className="text-xs text-muted-foreground">{t.authorNote}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
