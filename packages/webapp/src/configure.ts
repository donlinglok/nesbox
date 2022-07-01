import { updateStore } from '@mantou/gem';
import { isMac, getDisplayKey } from 'duoyun-ui/lib/hotkeys';
import { Modify } from 'duoyun-ui/lib/types';
import { createCacheStore } from 'duoyun-ui/lib/utils';

import { LoginMutation } from 'src/generated/guestgraphql';
import { localStorageKeys } from 'src/constants';
import type { ThemeName } from 'src/theme';
import { GetAccountQuery } from 'src/generated/graphql';

export const defaultKeybinding = {
  Up: 'w',
  Left: 'a',
  Down: 's',
  Right: 'd',
  A: 'j',
  B: 'k',
  Select: 'u',
  Start: 'i',

  Up_2: 'arrowup',
  Left_2: 'arrowleft',
  Down_2: 'arrowdown',
  Right_2: 'arrowright',
  A_2: '5',
  B_2: '6',
};

const defaultVolume = {
  notification: 1,
};

export type Settings = {
  keybinding: typeof defaultKeybinding;
  volume: typeof defaultVolume;
};

export type User = Modify<LoginMutation['login']['user'], { settings: Settings }>;

export const parseAccount = (account: GetAccountQuery['account']): User => {
  const settings = JSON.parse(account.settings || '{}');
  return {
    ...account,
    settings: {
      ...settings,
      keybinding: { ...defaultKeybinding, ...settings.keybinding },
      volume: { ...defaultVolume, ...settings.volume },
    },
  };
};

export interface Profile {
  token: string;
  exp: number;
  nickname: string;
  username: string;
}

interface Shortcut {
  win: string[];
  mac: string[];
}

interface Configure {
  user?: User;
  profile?: Profile;
  screencastMode?: boolean;
  friendListState?: boolean;
  settingsState?: boolean;
  searchState?: boolean;
  friendChatState?: number;
  usedRelease?: number;
  openNesFile?: File;
  theme: ThemeName;
  shortcuts: {
    OPEN_SEARCH: Shortcut;
    OPEN_SETTINGS: Shortcut;
  };
}

export const [configure] = createCacheStore<Configure>(
  localStorageKeys.CONFIGURE_LOCAL_STORAGE_KEY,
  {
    theme: 'default',
    shortcuts: {
      OPEN_SEARCH: {
        win: ['ctrl', 'k'],
        mac: ['command', 'k'],
      },
      OPEN_SETTINGS: {
        win: ['esc'],
        mac: ['esc'],
      },
    },
  },
  { cacheExcludeKeys: ['openNesFile'] },
);

export function getShortcut(command: keyof Configure['shortcuts'], isDisplay = false) {
  const keys = configure.shortcuts[command][isMac ? 'mac' : 'win'];
  if (isDisplay) return keys.map((key) => getDisplayKey(key)).join('+');
  return keys.join('+');
}

export const deleteUser = () => {
  updateStore(configure, { user: undefined, profile: undefined });
};

export const toggoleScreencaseMode = () => {
  updateStore(configure, { screencastMode: !configure.screencastMode });
};

export const toggoleFriendListState = () => {
  updateStore(configure, { friendListState: !configure.friendListState });
};

export const toggoleFriendChatState = (id?: number) => {
  updateStore(configure, { friendChatState: id });
};

export const toggoleSettingsState = () => {
  updateStore(configure, { settingsState: !configure.settingsState });
};

export const toggoleSearchState = () => {
  updateStore(configure, { searchState: !configure.searchState });
};

export const setNesFile = (file?: File) => {
  updateStore(configure, { openNesFile: file });
};
