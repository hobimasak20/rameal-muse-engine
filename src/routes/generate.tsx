import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2, Flame, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { generateIdeas } from "@/lib/generate.functions";
import { IdeaCard, type Idea } from "@/components/IdeaCard";
import { cn } from "@/lib/utils";

const TONES = ["Honest", "Sarcastic", "Confused", "Mindblown", "Frustrated", "Comedy", "Twist", "Informative"] as const;
type Tone = (typeof TONES)[number];

const generateSearchSchema = z.object({
  topic: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/generate")({
  validateSearch: zodValidator(generateSearchSchema),
  head: () => ({
    meta: [
      { title: "Generate · RameAL" },
      { name: "description", content: "Generate Wandy POV scripts for Reels & TikTok in seconds." },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const fn = useServerFn(generateIdeas);
  const { topic: initialTopic } = Route.useSearch();
  const [topic, setTopic] = useState(initialTopic);
  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);
  const [tone, setTone] = useState<Tone>("Honest");
  const [count, setCount] = useState(3);
  const [durationSec, setDurationSec] = useState(30);
  const [viralBoost, setViralBoost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ctx, setCtx] = useState<{ topic: string; tone: Tone; viralBoost: boolean; durationSec: number } | null>(null);

  async function onGenerate() {
    if (!topic.trim()) {
      toast.error("Tulis topic dulu");
      return;
    }
    setLoading(true);
    setIdeas([]);
    try {
      const res = await fn({ data: { topic: topic.trim(), tone, count, viralBoost, durationSec } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setIdeas(res.ideas);
      setCtx({ topic: res.topic, tone: res.tone as Tone, viralBoost: res.viralBoost, durationSec: res.durationSec });
    } catch (e) {
      toast.error("Generation failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Generate</h1>
        <p className="text-sm text-muted-foreground">
          Topic + tone → script in Wandy POV voice.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-border/60 bg-card p-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Topic
          </label>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="contoh: harga groceries di Sydney vs Jakarta, atau random thought tentang antri di MRT"
            rows={3}
            className="mt-1 resize-none border-border/60 bg-background/40"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Tone
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  tone === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Number of ideas
            </label>
            <span className="text-sm font-semibold">{count}</span>
          </div>
          <Slider
            value={[count]}
            onValueChange={(v) => setCount(v[0])}
            min={1}
            max={10}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> Script duration
            </label>
            <span className="text-sm font-semibold">
              {durationSec < 60 ? `${durationSec}s` : `${Math.floor(durationSec / 60)}m${durationSec % 60 ? ` ${durationSec % 60}s` : ""}`}
            </span>
          </div>
          <Slider
            value={[durationSec]}
            onValueChange={(v) => setDurationSec(v[0])}
            min={10}
            max={120}
            step={5}
            className="mt-2"
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {[15, 30, 60, 90, 120].map((d) => (
              <button
                key={d}
                onClick={() => setDurationSec(d)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                  durationSec === d
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                )}
              >
                {d < 60 ? `${d}s` : `${d / 60}m`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Flame
              className={cn("h-4 w-4", viralBoost ? "text-primary" : "text-muted-foreground")}
            />
            <div>
              <div className="text-sm font-medium">Viral boost</div>
              <div className="text-[11px] text-muted-foreground">
                Stronger curiosity, edgier tension
              </div>
            </div>
          </div>
          <Switch checked={viralBoost} onCheckedChange={setViralBoost} />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading}
          className="h-11 w-full rounded-xl text-sm font-semibold"
          style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Generate {count} idea{count > 1 ? "s" : ""}
            </>
          )}
        </Button>
      </section>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl border border-border/60 bg-card/50" />
          ))}
        </div>
      )}

      {!loading && ideas.length > 0 && (
        <section className="space-y-3">
          {ideas.map((i, idx) => (
            <IdeaCard key={idx} idea={i} context={ctx ?? undefined} />
          ))}
        </section>
      )}
    </div>
  );
}
