import { Message } from './types';
import * as c from './constants';
import * as commands from './commands';

const searchQuery = (text: string) => chrome.search.query({ text });

const commandsQuery = async (text: string) => commands.query(text);

const tabsQuery = async (text: string) => {
  const tabs = await chrome.tabs.query(text ? { title: text } : {});
  return tabs.map((tab) => ({
    ...tab,
    message: { type: c.TABS_HIGHLIGHT, payload: tab },
    type: 'tab',
    description: 'Browser tab',
  }));
};

const tabsCurrent = async (): Promise<chrome.tabs.Tab> => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
};

const tabsCreate = async (url: string = 'about:blank') => {
  await chrome.tabs.create({ url });
};

const tabsRemove = async (id: number | undefined) => {
  const tab = id ? ({ id } as chrome.tabs.Tab) : await tabsCurrent();
  return tab.id && chrome.tabs.remove(tab.id);
};

const tabsDuplicate = async () => {
  const tab = await tabsCurrent();
  return tab.id && chrome.tabs.duplicate(tab.id);
};

const tabsUpdateTogglePin = async () => {
  const tab = await tabsCurrent();
  return tab.id && chrome.tabs.update(tab.id, { pinned: !tab.pinned });
};

const tabsUpdateToggleMute = async () => {
  const tab = await tabsCurrent();
  return tab.id && chrome.tabs.update(tab.id, { muted: !tab.mutedInfo?.muted });
};

const tabsReload = async () => {
  const tab = await tabsCurrent();
  return tab.id && chrome.tabs.reload(tab.id);
};

const tabsGoBack = async () => {
  const tab = await tabsCurrent();
  return tab.id && chrome.tabs.goBack(tab.id);
};

const tabsGoForward = async () => {
  const tab = await tabsCurrent();
  return tab.id && chrome.tabs.goForward(tab.id);
};

const tabsHighlight = async (tab: chrome.tabs.Tab) => {
  chrome.tabs.highlight({ tabs: tab.index, windowId: tab.windowId });
  chrome.windows.update(tab.windowId, { focused: true });
};

const bookmarksCreate = async () => {
  const tab = await tabsCurrent();
  chrome.bookmarks.create({ title: tab.title, url: tab.url });
};

const bookmarksRemove = async (id: string) => {
  chrome.bookmarks.remove(id);
};

const bookmarksQuery = async (text: string) => {
  const bookmarks = await chrome.bookmarks.search(text ? { query: text } : {});
  return bookmarks
    .filter((bookmark) => bookmark.url !== undefined)
    .map((bookmark) => ({
      ...bookmark,
      message: { type: c.TABS_CREATE, payload: bookmark.url },
      type: 'bookmark',
      description: 'Bookmark',
    }));
};

const historyQuery = async (text: string) => {
  const history = await chrome.history.search({ text: text || '', maxResults: 0, startTime: 0 });
  return history.map((history) => ({
    ...history,
    message: { type: c.TABS_CREATE, payload: history.url },
    type: 'history',
    description: history.url,
  }));
};

const windowsCreateIncognito = async () => {
  await chrome.windows.create({ incognito: true });
};

const windowsRemove = async () => {
  const tab = await tabsCurrent();
  chrome.windows.remove(tab.windowId);
};

const browsingDataRemoveAll = async () => {
  await chrome.browsingData.remove(
    { since: new Date().getTime() },
    {
      appcache: true,
      cache: true,
      cacheStorage: true,
      cookies: true,
      downloads: true,
      fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      localStorage: true,
      passwords: true,
      serviceWorkers: true,
      webSQL: true,
    },
  );
};

const browsingDataRemoveHistory = async () => {
  chrome.browsingData.removeHistory({ since: 0 });
};

const browsingDataRemoveCookies = async () => {
  chrome.browsingData.removeCookies({ since: 0 });
};

const browsingDataRemoveCache = async () => {
  chrome.browsingData.removeCache({ since: 0 });
};

const browsingDataRemoveLocalStorage = async () => {
  chrome.browsingData.removeLocalStorage({ since: 0 });
};

const browsingDataRemovePasswords = async () => {
  chrome.browsingData.removePasswords({ since: 0 });
};

const defaultQuery = async (text: string) => {
  const [tabs, commands, bookmarks] = await Promise.all([tabsQuery(text), commandsQuery(text), bookmarksQuery(text)]);
  const search = text
    ? [
        {
          id: 0,
          type: 'query',
          title: text,
          description: 'Search for a query',
          message: { type: c.SEARCH_QUERY, payload: text },
        },
      ]
    : [];
  return [...search, ...tabs, ...commands, ...bookmarks];
};

const removeQuery = async (text: string) => {
  const [tab, bookmarks] = await Promise.all([tabsQuery(text), bookmarksQuery(text)]);
  return [...tab, ...bookmarks];
};

const dispatch = async (message: Message) => {
  const tab = await tabsCurrent();
  return tab.id && chrome.tabs.sendMessage(tab.id, message);
};

chrome.action.onClicked.addListener(() => {
  dispatch({ type: c.TOGGLE_OMNIX });
});

chrome.runtime.onMessage.addListener(async (message: Message) => {
  switch (message.type) {
    case c.DEFAULT_QUERY: {
      const payload = await defaultQuery(message.payload);
      dispatch({ type: c.QUERY_SUCCESS, payload });
      break;
    }
    case c.COMMANDS_QUERY: {
      const payload = await commandsQuery(message.payload);
      dispatch({ type: c.QUERY_SUCCESS, payload });
      break;
    }
    case c.BOOKMARKS_QUERY: {
      const payload = await bookmarksQuery(message.payload);
      dispatch({ type: c.QUERY_SUCCESS, payload });
      break;
    }
    case c.HISTORY_QUERY: {
      const payload = await historyQuery(message.payload);
      dispatch({ type: c.QUERY_SUCCESS, payload });
      break;
    }
    case c.TABS_QUERY: {
      const payload = await tabsQuery(message.payload);
      dispatch({ type: c.QUERY_SUCCESS, payload });
      break;
    }
    case c.REMOVE_QUERY: {
      const payload = await removeQuery(message.payload);
      dispatch({ type: c.QUERY_SUCCESS, payload });
      break;
    }
    case c.SEARCH_QUERY:
      searchQuery(message.payload);
      break;
    case c.TABS_CREATE:
      tabsCreate(message.payload);
      break;
    case c.TABS_REMOVE:
      tabsRemove(message.payload);
      break;
    case c.TABS_DUPLICATE:
      tabsDuplicate();
      break;
    case c.TABS_UPDATE_TOGGLE_PIN:
      tabsUpdateTogglePin();
      break;
    case c.TABS_UPDATE_TOGGLE_MUTE:
      tabsUpdateToggleMute();
      break;
    case c.TABS_RELOAD:
      tabsReload();
      break;
    case c.TABS_GO_BACK:
      tabsGoBack();
      break;
    case c.TABS_GO_FORWARD:
      tabsGoForward();
      break;
    case c.TABS_HIGHLIGHT:
      tabsHighlight(message.payload);
      break;
    case c.BOOKMARKS_CREATE:
      bookmarksCreate();
      break;
    case c.BOOKMARKS_REMOVE:
      bookmarksRemove(message.payload);
      break;
    case c.WINDOWS_CREATE_INCOGNITO:
      windowsCreateIncognito();
      break;
    case c.WINDOWS_REMOVE:
      windowsRemove();
      break;
    case c.BROWSING_DATA_REMOVE_ALL:
      browsingDataRemoveAll();
      break;
    case c.BROWSING_DATA_REMOVE_HISTORY:
      browsingDataRemoveHistory();
      break;
    case c.BROWSING_DATA_REMOVE_COOKIES:
      browsingDataRemoveCookies();
      break;
    case c.BROWSING_DATA_REMOVE_CACHE:
      browsingDataRemoveCache();
      break;
    case c.BROWSING_DATA_REMOVE_LOCAL_STORAGE:
      browsingDataRemoveLocalStorage();
      break;
    case c.BROWSING_DATA_REMOVE_PASSWORDS:
      browsingDataRemovePasswords();
      break;
  }
});
