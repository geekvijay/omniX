import { Message } from './types';
import * as commands from './commands';

const searchQuery = (text: string) => chrome.search.query({ text });

const commandsQuery = async (text: string) => commands.query(text);

const tabsQuery = async (text: string) => {
  const tabs = await chrome.tabs.query(text ? { title: text } : {});
  return tabs.map((tab) => ({
    ...tab,
    message: { type: 'TABS_HIGHLIGHT', payload: tab },
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
      message: { type: 'TABS_CREATE', payload: bookmark.url },
      type: 'bookmark',
      description: 'Bookmark',
    }));
};

const historyQuery = async (text: string) => {
  const history = await chrome.history.search({ text: text || '', maxResults: 0, startTime: 0 });
  return history.map((history) => ({
    ...history,
    message: { type: 'TABS_CREATE', payload: history.url },
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
          message: { type: 'SEARCH_QUERY', payload: text },
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
  dispatch({ type: 'TOGGLE_OMNIX' });
});

chrome.runtime.onMessage.addListener(async (message: Message) => {
  switch (message.type) {
    case 'DEFAULT_QUERY': {
      const payload = await defaultQuery(message.payload);
      dispatch({ type: 'QUERY_SUCCESS', payload });
      break;
    }
    case 'COMMANDS_QUERY': {
      const payload = await commandsQuery(message.payload);
      dispatch({ type: 'QUERY_SUCCESS', payload });
      break;
    }
    case 'BOOKMARKS_QUERY': {
      const payload = await bookmarksQuery(message.payload);
      dispatch({ type: 'QUERY_SUCCESS', payload });
      break;
    }
    case 'HISTORY_QUERY': {
      const payload = await historyQuery(message.payload);
      dispatch({ type: 'QUERY_SUCCESS', payload });
      break;
    }
    case 'TABS_QUERY': {
      const payload = await tabsQuery(message.payload);
      dispatch({ type: 'QUERY_SUCCESS', payload });
      break;
    }
    case 'REMOVE_QUERY': {
      const payload = await removeQuery(message.payload);
      dispatch({ type: 'QUERY_SUCCESS', payload });
      break;
    }
    case 'SEARCH_QUERY':
      searchQuery(message.payload);
      break;
    case 'TABS_CREATE':
      tabsCreate(message.payload);
      break;
    case 'TABS_REMOVE':
      tabsRemove(message.payload);
      break;
    case 'TABS_DUPLICATE':
      tabsDuplicate();
      break;
    case 'TABS_UPDATE_TOGGLE_PIN':
      tabsUpdateTogglePin();
      break;
    case 'TABS_UPDATE_TOGGLE_MUTE':
      tabsUpdateToggleMute();
      break;
    case 'TABS_RELOAD':
      tabsReload();
      break;
    case 'TABS_GO_BACK':
      tabsGoBack();
      break;
    case 'TABS_GO_FORWARD':
      tabsGoForward();
      break;
    case 'TABS_HIGHLIGHT':
      tabsHighlight(message.payload);
      break;
    case 'BOOKMARKS_CREATE':
      bookmarksCreate();
      break;
    case 'BOOKMARKS_REMOVE':
      bookmarksRemove(message.payload);
      break;
    case 'WINDOWS_CREATE_INCOGNITO':
      windowsCreateIncognito();
      break;
    case 'WINDOWS_REMOVE':
      windowsRemove();
      break;
    case 'BROWSING_DATA_REMOVE_ALL':
      browsingDataRemoveAll();
      break;
    case 'BROWSING_DATA_REMOVE_HISTORY':
      browsingDataRemoveHistory();
      break;
    case 'BROWSING_DATA_REMOVE_COOKIES':
      browsingDataRemoveCookies();
      break;
    case 'BROWSING_DATA_REMOVE_CACHE':
      browsingDataRemoveCache();
      break;
    case 'BROWSING_DATA_REMOVE_LOCAL_STORAGE':
      browsingDataRemoveLocalStorage();
      break;
    case 'BROWSING_DATA_REMOVE_PASSWORDS':
      browsingDataRemovePasswords();
      break;
  }
});
