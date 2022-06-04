import * as Utils from '../main/utils';
import * as Assert from 'node:assert';

Assert.equal(
  Utils.contains(
    {
      location: {
        x: 0,
        y: 0,
      },
      size: {
        width: 200,
        height: 200,
      },
    },
    { x: 150, y: 100 },
  ),
  true,
  'Quadrant should contain point',
);

Assert.equal(
  Utils.contains(
    {
      location: {
        x: 100,
        y: 100,
      },
      size: {
        width: 200,
        height: 200,
      },
    },
    { x: 150, y: 100 },
  ),
  true,
  'Quadrant should contain point',
);

Assert.equal(
  Utils.contains(
    {
      location: {
        x: 100,
        y: 100,
      },
      size: {
        width: 200,
        height: 200,
      },
    },
    { x: 50, y: 100 },
  ),
  false,
  'Quadrant should not contain point',
);
