import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Play, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/demo-video")({
  head: () => ({
    meta: [
      { title: "Générateur de vidéo de démo — Superconnect" },
      {
        name: "description",
        content:
          "Générez une vidéo animée 16:9 de démonstration de Superconnect à publier sur LinkedIn ou YouTube.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DemoVideoPage,
});

type Scene = {
  duration: number; // seconds
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void;
};

// ---- Helpers ----
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function bg(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  const shift = Math.sin(t * 0.5) * 0.1;
  g.addColorStop(0, `hsl(${240 + shift * 20}, 40%, 8%)`);
  g.addColorStop(1, `hsl(${280 + shift * 20}, 50%, 12%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // subtle grid
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  const step = 80;
  for (let x = 0; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color = "#fff",
  weight = "600",
  align: CanvasTextAlign = "center"
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function badge(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(139, 92, 246, 0.15)";
  ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
  ctx.lineWidth = 1;
  const w = 320;
  const h = 44;
  const r = 22;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
  ctx.fill();
  ctx.stroke();
  drawText(ctx, text, x, y, 16, "#c4b5fd", "500");
  ctx.restore();
}

// ---- Scenes ----
const SCENES: Scene[] = [
  // 1. Hook
  {
    duration: 3,
    draw: (ctx, t, w, h) => {
      bg(ctx, w, h, t);
      const a1 = Math.min(1, easeOut(t / 0.6));
      const a2 = Math.min(1, easeOut(Math.max(0, (t - 0.4) / 0.6)));
      const a3 = Math.min(1, easeOut(Math.max(0, (t - 1.2) / 0.6)));

      ctx.save();
      ctx.globalAlpha = a1;
      badge(ctx, "✦  SUPERCONNECT", w / 2, h / 2 - 180, 1);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = a2;
      const y = h / 2 - 40 + (1 - a2) * 30;
      ctx.translate(0, y - (h / 2 - 40));
      drawText(ctx, "Trop de meetings.", w / 2, h / 2 - 40, 96, "#fff", "700");
      drawText(ctx, "Pas assez de bons.", w / 2, h / 2 + 60, 96, "#a78bfa", "700");
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = a3;
      drawText(ctx, "On a une solution.", w / 2, h / 2 + 200, 32, "#94a3b8", "400");
      ctx.restore();
    },
  },
  // 2. Solution
  {
    duration: 3.5,
    draw: (ctx, t, w, h) => {
      bg(ctx, w, h, t);
      const p = Math.min(1, easeOut(t / 0.8));

      // orb
      ctx.save();
      ctx.globalAlpha = p;
      const cx = w / 2;
      const cy = h / 2 - 80;
      const pulse = 1 + Math.sin(t * 2) * 0.03;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180 * pulse);
      grad.addColorStop(0, "rgba(167, 139, 250, 0.9)");
      grad.addColorStop(0.5, "rgba(139, 92, 246, 0.5)");
      grad.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 180 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "700 64px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AI", cx, cy);
      ctx.restore();

      const a2 = Math.min(1, easeOut(Math.max(0, (t - 1) / 0.7)));
      ctx.save();
      ctx.globalAlpha = a2;
      drawText(ctx, "Un agent IA qui vous connecte", w / 2, h / 2 + 160, 56, "#fff", "600");
      drawText(
        ctx,
        "aux bonnes personnes, au bon moment.",
        w / 2,
        h / 2 + 220,
        32,
        "#cbd5e1",
        "400"
      );
      ctx.restore();
    },
  },
  // 3. Features
  {
    duration: 4,
    draw: (ctx, t, w, h) => {
      bg(ctx, w, h, t);
      drawText(ctx, "Ce que votre agent fait pour vous", w / 2, 140, 42, "#fff", "600");

      const items = [
        { icon: "🎯", title: "Matchs pertinents", sub: "Analyse profils & objectifs" },
        { icon: "💬", title: "Conversations auto", sub: "Négocie l'intro à votre place" },
        { icon: "📅", title: "Meetings qualifiés", sub: "Vous ne rencontrez que le bon" },
      ];

      const cardW = 380;
      const cardH = 320;
      const gap = 40;
      const totalW = cardW * 3 + gap * 2;
      const startX = (w - totalW) / 2;
      const cardY = h / 2 - cardH / 2 + 40;

      items.forEach((item, i) => {
        const delay = i * 0.25;
        const p = Math.min(1, easeOut(Math.max(0, (t - delay) / 0.6)));
        if (p <= 0) return;
        const x = startX + i * (cardW + gap);
        const offsetY = (1 - p) * 40;

        ctx.save();
        ctx.globalAlpha = p;
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.strokeStyle = "rgba(167, 139, 250, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, cardY + offsetY, cardW, cardH, 24);
        ctx.fill();
        ctx.stroke();

        ctx.font = "80px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.icon, x + cardW / 2, cardY + offsetY + 90);
        drawText(ctx, item.title, x + cardW / 2, cardY + offsetY + 190, 26, "#fff", "600");
        drawText(ctx, item.sub, x + cardW / 2, cardY + offsetY + 232, 18, "#94a3b8", "400");
        ctx.restore();
      });
    },
  },
  // 4. Numbers
  {
    duration: 3,
    draw: (ctx, t, w, h) => {
      bg(ctx, w, h, t);
      const stats = [
        { n: 87, suffix: "%", label: "de matchs pertinents" },
        { n: 12, suffix: "x", label: "moins de temps perdu" },
        { n: 3, suffix: " min", label: "pour setup votre agent" },
      ];
      const stepX = w / 4;
      stats.forEach((s, i) => {
        const delay = i * 0.3;
        const p = Math.min(1, easeInOut(Math.max(0, (t - delay) / 0.8)));
        if (p <= 0) return;
        const val = Math.round(s.n * p);
        const x = stepX * (i + 1);
        ctx.save();
        ctx.globalAlpha = p;
        drawText(ctx, `${val}${s.suffix}`, x, h / 2 - 20, 96, "#a78bfa", "700");
        drawText(ctx, s.label, x, h / 2 + 60, 22, "#cbd5e1", "400");
        ctx.restore();
      });
    },
  },
  // 5. CTA
  {
    duration: 3,
    draw: (ctx, t, w, h) => {
      bg(ctx, w, h, t);
      const p = Math.min(1, easeOut(t / 0.6));
      ctx.save();
      ctx.globalAlpha = p;
      drawText(ctx, "Créez votre agent", w / 2, h / 2 - 60, 88, "#fff", "700");
      drawText(ctx, "en 3 minutes.", w / 2, h / 2 + 40, 88, "#a78bfa", "700");
      ctx.restore();

      const p2 = Math.min(1, easeOut(Math.max(0, (t - 1) / 0.6)));
      ctx.save();
      ctx.globalAlpha = p2;
      const btnW = 300;
      const btnH = 64;
      const bx = w / 2 - btnW / 2;
      const by = h / 2 + 140;
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.roundRect(bx, by, btnW, btnH, 32);
      ctx.fill();
      drawText(ctx, "superconnect.app", w / 2, by + btnH / 2, 22, "#1e1b4b", "600");
      ctx.restore();
    },
  },
];

const TOTAL_DURATION = SCENES.reduce((s, sc) => s + sc.duration, 0);
const WIDTH = 1920;
const HEIGHT = 1080;

function renderFrame(ctx: CanvasRenderingContext2D, elapsed: number) {
  let acc = 0;
  for (const scene of SCENES) {
    if (elapsed < acc + scene.duration) {
      scene.draw(ctx, elapsed - acc, WIDTH, HEIGHT);
      return;
    }
    acc += scene.duration;
  }
  SCENES[SCENES.length - 1].draw(ctx, SCENES[SCENES.length - 1].duration, WIDTH, HEIGHT);
}

function DemoVideoPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("video/webm");

  // preview loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderFrame(ctx, 0);
  }, []);

  function tick() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const elapsed = (performance.now() - startRef.current) / 1000;
    const clamped = Math.min(elapsed, TOTAL_DURATION);
    setProgress(clamped / TOTAL_DURATION);
    renderFrame(ctx, clamped);
    if (elapsed < TOTAL_DURATION) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setPlaying(false);
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
    }
  }

  function play() {
    if (playing) return;
    setVideoUrl(null);
    setPlaying(true);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPlaying(false);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  }

  async function record() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof (canvas as any).captureStream !== "function") {
      toast.error("Votre navigateur ne supporte pas l'enregistrement canvas. Essayez Chrome ou Edge.");
      return;
    }
    const stream = (canvas as any).captureStream(30) as MediaStream;

    const candidates = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4",
    ];
    const supported = candidates.find((m) => MediaRecorder.isTypeSupported(m));
    if (!supported) {
      toast.error("Aucun format vidéo supporté par ce navigateur.");
      return;
    }
    setMimeType(supported);

    const recorder = new MediaRecorder(stream, {
      mimeType: supported,
      videoBitsPerSecond: 8_000_000,
    });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: supported });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setRecording(false);
      toast.success("Vidéo prête à télécharger !");
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
    play();
  }

  function download() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    const ext = mimeType.includes("mp4") ? "mp4" : "webm";
    a.download = `superconnect-demo.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Générateur de vidéo de démo</h1>
          <p className="text-sm text-muted-foreground">
            Une vidéo motion 16:9 (1920×1080) prête à publier sur LinkedIn, YouTube ou X.
            Lancez la prévisualisation, puis enregistrez pour exporter.
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="block h-auto w-full"
          />
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-primary transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={play} disabled={playing} variant="secondary">
            <Play className="mr-2 h-4 w-4" /> Prévisualiser
          </Button>
          <Button onClick={record} disabled={recording || playing}>
            {recording ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement…
              </>
            ) : (
              <>
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                Enregistrer &amp; exporter
              </>
            )}
          </Button>
          {(playing || recording) && (
            <Button onClick={stop} variant="outline">
              <Square className="mr-2 h-4 w-4" /> Stop
            </Button>
          )}
          {videoUrl && (
            <Button onClick={download} variant="default">
              <Download className="mr-2 h-4 w-4" /> Télécharger la vidéo
            </Button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            Durée : {TOTAL_DURATION.toFixed(1)}s · Format : {mimeType.includes("mp4") ? "MP4" : "WebM"}
          </span>
        </div>

        {videoUrl && (
          <div className="rounded-xl border border-white/10 bg-card p-4">
            <div className="mb-2 text-sm font-medium">Aperçu du fichier exporté</div>
            <video src={videoUrl} controls className="w-full rounded-lg" />
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-card/50 p-4 text-xs text-muted-foreground">
          <strong className="text-foreground">Astuce :</strong> gardez cet onglet actif pendant
          l'enregistrement (les navigateurs ralentissent les onglets en arrière-plan).
          Chrome / Edge donnent les meilleurs résultats. Le fichier WebM peut être converti en
          MP4 avec un outil comme CloudConvert si votre plateforme l'exige.
        </div>
      </div>
    </main>
  );
}
