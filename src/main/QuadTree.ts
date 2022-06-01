import { Quadrant, Unit } from './types';
import { contains } from './utils';

export class QuadTree<T> {
  #container: Quadrant;
  #items: Array<Unit<T>> = [];
  #isLeaf: boolean = true;

  constructor(container: Quadrant) {
    this.#container = container;
  }

  add(point: Unit<T>): void {
    if (contains(this.#container, point)) {
      if (this.#items.length < 4) {
        this.#items.push(point);
        return;
      } else if (this.#isLeaf) {
        this.#split();
      }
    }
  }

  #split(): void {
    this.#isLeaf = false;
  }
}
