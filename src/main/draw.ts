import { Box, Circle, Point } from './types';

type HexChar =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9;

// Color Keywords reference
// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color_keywords
export type CSSColor =
  | 'black'
  | 'white'
  | 'red'
  | 'yellow'
  | 'blue'
  | `#${HexChar}${HexChar}${HexChar}`
  | `hsl(${number}, ${number}%, ${number}%)`
  | `hsla(${number}, ${number}%, ${number}%, ${number})`
  | `rgb(${number},${number},${number})`
  | `rgba(${number},${number},${number},${number})`;

export type LoopCallback = (ops: CanvasOperations) => void;

class CanvasOperations {
  #context: CanvasRenderingContext2D;
  #canvas: HTMLCanvasElement;
  #drawingState: {
    mousePosition: { x: number; y: number };
    isMouseDown: boolean;
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    downKeys: Set<string>;
  } = {
    mousePosition: { x: 0, y: 0 },
    isMouseDown: false,
    downKeys: new Set(),
  };

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
    this.#canvas = context.canvas;

    this.#canvas.addEventListener('pointerdown', () => {
      this.#drawingState.isMouseDown = true;
    });

    this.#canvas.addEventListener('pointerup', () => {
      this.#drawingState.isMouseDown = false;
    });

    this.#canvas.addEventListener('pointermove', (e) => {
      this.#drawingState.mousePosition.x = e.clientX;
      this.#drawingState.mousePosition.y = e.clientX;
    });

    this.#canvas.addEventListener('keydown', (e) => {
      this.#drawingState.downKeys.add(e.key);
    });

    this.#canvas.addEventListener('keydown', (e) => {
      this.#drawingState.downKeys.delete(e.key);
    });
  }

  get isMouseDown(): boolean {
    return this.#drawingState.isMouseDown;
  }

  get mousePosition(): Point {
    return this.#drawingState.mousePosition;
  }

  isKeyDown(...keys: ReadonlyArray<string>): boolean {
    for (const key of keys) {
      if (!this.#drawingState.downKeys.has(key)) {
        return false;
      }
    }

    return true;
  }

  circle(shape: Circle): void {
    this.#context.beginPath();
    this.#context.ellipse(
      shape.location.x,
      shape.location.y,
      shape.radius,
      shape.radius,
      Math.PI / 4,
      0,
      2 * Math.PI,
    );
    this.#context.stroke();
    this.#context.closePath();
  }

  rect(shape: Box): void {
    this.#context.fillStyle = 'white';
    this.#context.lineWidth = 3;
    this.#context.strokeStyle = 'black';
    this.#context.strokeRect(
      shape.location.x,
      shape.location.y,
      shape.size.width,
      shape.size.height,
    );
  }

  clear(): void {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  fill(color: CSSColor): void {
    this.clear();
    this.#context.fillStyle = color;
    this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  line({
    from,
    to,
    weight,
  }: {
    from: Point;
    to: Point;
    weight?: number;
  }): void {
    this.#context.fillStyle = 'white';
    this.#context.lineWidth = weight ?? 3;
    this.#context.strokeStyle = 'black';
    this.#context.beginPath();
    this.#context.moveTo(from.x, from.y);
    this.#context.lineTo(to.x, to.y);
    this.#context.stroke();
    this.#context.closePath();
  }
}

class Sketch {
  #canvas: HTMLCanvasElement | null = null;
  #context: CanvasRenderingContext2D | null = null;
  #operations: CanvasOperations | null = null;
  #callbacks: Array<LoopCallback> = [];
  #loopID: number | null = null;

  constructor() {}

  loop(cb: LoopCallback): void {
    this.#startLoop();
    this.#callbacks.push(cb);
  }

  cancelLoop(): void {
    if (this.#loopID != null) {
      cancelAnimationFrame(this.#loopID);
      this.#loopID = null;
    }
  }

  reset(): void {
    this.cancelLoop();
    this.#callbacks = [];
  }

  #getCanvas(): HTMLCanvasElement {
    if (this.#canvas != null) {
      return this.#canvas;
    }

    this.#canvas = document.createElement('canvas');
    return this.#canvas;
  }

  #getContext(): CanvasRenderingContext2D {
    if (this.#context) {
      return this.#context;
    }

    this.#context = this.#getCanvas().getContext('2d');

    if (this.#context == null) {
      throw new Error(`Unable to get 2d context from canvas`);
    }

    return this.#context;
  }

  #startLoop(): void {
    if (this.#loopID != null) {
      return;
    }

    this.#loopID = window.requestAnimationFrame(() => {
      for (const cb of this.#callbacks) {
        cb(this.#getCanvasOperations());
      }

      // Process infinite loop
      this.#loopID = null;
      this.#startLoop();
    });
  }

  #getCanvasOperations(): CanvasOperations {
    if (this.#operations != null) {
      return this.#operations;
    }

    this.#operations = new CanvasOperations(this.#getContext());
    return this.#operations;
  }
}

export const sketch = new Sketch();
