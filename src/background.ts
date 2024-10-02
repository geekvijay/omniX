import { Action } from './types';
import { TOGGLE_OMNIX } from './constants';

const dispatch = async (action: Action) => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id, action);
  return response;
};

chrome.action.onClicked.addListener((tab) => {
  dispatch({ type: TOGGLE_OMNIX, payload: { tab } });
});
