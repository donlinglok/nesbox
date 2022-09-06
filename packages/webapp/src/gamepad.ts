import { isNotNullish } from 'duoyun-ui/lib/types';
import { Button } from '@mantou/nes';
import { Toast } from 'duoyun-ui/elements/toast';
import { hotkeys } from 'duoyun-ui/lib/hotkeys';

import { events } from 'src/constants';

// https://w3c.github.io/gamepad/#remapping
const buttonMap: Record<Button, Button[]> = {
  12: [Button.Joypad1Up, Button.Joypad2Up, Button.Joypad3Up, Button.Joypad4Up],
  14: [Button.Joypad1Left, Button.Joypad2Left, Button.Joypad3Left, Button.Joypad4Left],
  13: [Button.Joypad1Down, Button.Joypad2Down, Button.Joypad3Down, Button.Joypad4Down],
  15: [Button.Joypad1Right, Button.Joypad2Right, Button.Joypad3Right, Button.Joypad4Right],
  0: [Button.Joypad1A, Button.Joypad2A, Button.Joypad3A, Button.Joypad4A],
  1: [Button.Joypad1TurboA, Button.Joypad2TurboA, Button.Joypad3TurboA, Button.Joypad4TurboA],
  2: [Button.Joypad1B, Button.Joypad2B, Button.Joypad3B, Button.Joypad4B],
  3: [Button.Joypad1TurboB, Button.Joypad2TurboB, Button.Joypad3TurboB, Button.Joypad4TurboB],
  8: [Button.Select],
  9: [Button.Start],
  16: [Button.Reset],
};

const pressedButton = new Set<number>();

function dispatchReleaseEvent(index: number, padIndex = 0) {
  const btn = buttonMap[index]?.[padIndex];
  dispatchEvent(new CustomEvent(events.RELEASE_BUTTON_INDEX, { detail: index }));
  if (btn) dispatchEvent(new CustomEvent(events.RELEASE_BUTTON, { detail: btn }));
}

function dispatchPressEvent(index: number, padIndex = 0) {
  const btn = buttonMap[index]?.[padIndex];
  dispatchEvent(new CustomEvent(events.PRESS_BUTTON_INDEX, { detail: index }));
  if (btn) dispatchEvent(new CustomEvent(events.PRESS_BUTTON, { detail: btn }));
}

function readGamepad() {
  const gamepads = navigator
    .getGamepads()
    .filter(isNotNullish)
    .filter((e) => e.connected);

  gamepads.forEach((gamepad, padIndex) => {
    gamepad.buttons.forEach((button, index) => {
      if (pressedButton.has(index)) {
        if (!button.pressed) {
          pressedButton.delete(index);
          dispatchReleaseEvent(index, padIndex);
        }
      } else {
        if (button.pressed) {
          pressedButton.add(index);
          dispatchPressEvent(index, padIndex);
        }
      }
    });
  });

  if (gamepads.length > 0) {
    window.requestAnimationFrame(readGamepad);
  }
}

export const listener = () => {
  if ([...navigator.getGamepads()].find((e) => e?.connected)) {
    readGamepad();
  } else {
    addEventListener('gamepadconnected', () => {
      Toast.open('default', 'Gamepad connected!');
      readGamepad();
    });
  }
};

export const startKeyboardSimulation = () => {
  addEventListener(
    'keydown',
    hotkeys({
      w: () => dispatchPressEvent(12),
      a: () => dispatchPressEvent(14),
      s: () => dispatchPressEvent(13),
      d: () => dispatchPressEvent(15),
      j: () => dispatchPressEvent(2),
      k: () => dispatchPressEvent(0),
      4: () => dispatchPressEvent(4),
      5: () => dispatchPressEvent(5),
      6: () => dispatchPressEvent(6),
      7: () => dispatchPressEvent(7),
    }),
  );
  addEventListener(
    'keyup',
    hotkeys({
      w: () => dispatchReleaseEvent(12),
      a: () => dispatchReleaseEvent(14),
      s: () => dispatchReleaseEvent(13),
      d: () => dispatchReleaseEvent(15),
      j: () => dispatchReleaseEvent(2),
      k: () => dispatchReleaseEvent(0),
      4: () => dispatchReleaseEvent(4),
      5: () => dispatchReleaseEvent(5),
      6: () => dispatchReleaseEvent(6),
      7: () => dispatchReleaseEvent(7),
    }),
  );
};
