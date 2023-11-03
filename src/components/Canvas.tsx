import React, { useEffect, useRef } from 'react';
import PrivateKeyArt from '../PrivateKeyArt';

interface Props {
  drawing: PrivateKeyArt;
  setDrawing: (drawing: PrivateKeyArt) => void;
  scale: number;
}

const Canvas: React.FC<Props> = ({ drawing, setDrawing, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = 16;
  const isDrawingRef = useRef(false);
  const isErasingRef = useRef(false);

  const drawPixel = (event: MouseEvent, context: CanvasRenderingContext2D, isErasing: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / scale);
    const y = Math.floor((event.clientY - rect.top) / scale);

    drawing.setPixel(x, y, !isErasing);
    const newDrawing = new PrivateKeyArt(drawing.toPrivateKey());
    setDrawing(newDrawing);

    context.fillStyle = isErasing ? 'white' : 'black';
    context.fillRect(x * scale, y * scale, scale, scale);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const data = drawing.getData();
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        context.fillStyle = data[y][x] ? 'black' : 'white';
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    const startDrawing = (event: MouseEvent) => {
      isDrawingRef.current = true;
      isErasingRef.current = event.button === 2;
      drawPixel(event, context, isErasingRef.current);
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawingRef.current) return;
      drawPixel(event, context, isErasingRef.current);
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (!isDrawingRef.current) return;
      drawPixel(event, context, isErasingRef.current);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [drawing, setDrawing, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={size * scale}
      height={size * scale}
      style={{ width: size * scale, height: size * scale, border: `1px solid gray` }}
    />
  );
};

export default Canvas;
