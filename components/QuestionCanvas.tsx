"use client";

import { useEffect, useRef } from "react";

interface Props {
  question: string;
  maxWidth?: number; // ancho máximo antes de hacer salto de línea
  fontSize?: number;
}

interface Segment {
  text: string;
  bold: boolean;
  isBreak?: boolean; // 🔹 nuevo flag para saltos de línea
}

export default function QuestionCanvas({
  question,
  maxWidth = 600,
  fontSize = 16,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🔹 Parser: convierte <b>texto</b> en segmentos y maneja \n como <br>
  function parseHtmlToSegments(text: string): Segment[] {
    const segments: Segment[] = [];
    const regex = /(<b>|<\/b>|\n)/gi;
    const parts = text.split(regex);

    let bold = false;
    for (const part of parts) {
      if (part.toLowerCase() === "<b>") {
        bold = true;
      } else if (part.toLowerCase() === "</b>") {
        bold = false;
      } else if (part === "\n") {
        segments.push({ text: "", bold, isBreak: true }); // 🔹 salto de línea
      } else if (part.trim() !== "") {
        segments.push({ text: part, bold });
      }
    }
    return segments;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lineHeight = fontSize * 1.4;
    const padding = 10;

    // 🔹 Parsear HTML -> segmentos
    const segments = parseHtmlToSegments(question);

    // 🔹 Armar líneas considerando saltos y maxWidth
    const lines: Segment[][] = [];
    let currentLine: Segment[] = [];
    let currentText = "";

    const pushLine = () => {
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [];
        currentText = "";
      }
    };

    for (const seg of segments) {
      if (seg.isBreak) {
        pushLine(); // 🔹 fuerza un salto de línea
        continue;
      }

      const words = seg.text.split(" ");
      for (const word of words) {
        const testLine = currentText ? currentText + " " + word : word;

        ctx.font = `${seg.bold ? "bold " : ""}${fontSize}px Arial`;
        const width = ctx.measureText(testLine).width;

        if (width > maxWidth && currentText !== "") {
          pushLine();
          currentLine.push({ text: word, bold: seg.bold });
          currentText = word;
        } else {
          currentLine.push({ text: word, bold: seg.bold });
          currentText = testLine;
        }
      }
    }
    if (currentLine.length > 0) lines.push(currentLine);

    // 🔹 Ajustar tamaño del canvas
    canvas.width = maxWidth + padding * 2;
    canvas.height = lines.length * lineHeight + padding * 2;

    // 🔹 Redibujar
    ctx.textBaseline = "top";
    ctx.fillStyle = "#111827"; // Tailwind gray-900

    lines.forEach((line, i) => {
      let x = padding;
      line.forEach((seg, j) => {
        ctx.font = `${seg.bold ? "bold " : ""}${fontSize}px Arial`;
        const text = j === 0 ? seg.text : " " + seg.text;
        ctx.fillText(text, x, i * lineHeight + padding);
        x += ctx.measureText(text).width;
      });
    });
  }, [question, maxWidth, fontSize]);

  return <canvas ref={canvasRef} className="select-none" />;
}
