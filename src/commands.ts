import * as c from './constants';
import { Command } from './types';

export const query = async (text: string) => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  const commands: Command[] = [
    {
      title: 'New tab',
      description: 'Open a new tab',
      message: { type: c.TABS_CREATE },
    },
    {
      title: 'Bookmark',
      description: 'Bookmark the current page',
      message: { type: c.BOOKMARKS_CREATE },
    },
    {
      title: tab.pinned ? 'Unpin tab' : 'Pin tab',
      description: tab.pinned ? 'Unpin the current tab' : 'Pin the current tab',
      message: { type: c.TABS_UPDATE_TOGGLE_PIN },
    },
    {
      title: 'Fullscreen',
      description: 'Make the current window fullscreen',
      message: { type: c.BROWSER_FULLSCREEN },
    },
    {
      title: tab.mutedInfo?.muted ? 'Unmute' : 'Mute',
      description: tab.mutedInfo?.muted ? 'Unmute the current tab' : 'Mute the current tab',
      message: { type: c.TABS_UPDATE_TOGGLE_MUTE },
    },
    {
      title: 'Reload',
      description: 'Reload the current tab',
      message: { type: c.TABS_RELOAD },
    },
    {
      title: 'Help',
      description: 'Get help with OmniX',
      message: { type: c.TABS_CREATE, payload: 'https://github.com/geekvijay/omnix' },
    },
    {
      title: 'Compose Email',
      description: 'Compose a new email',
      message: { type: c.TABS_CREATE, payload: 'mailto:' },
    },
    {
      title: 'Print',
      description: 'Print the current page',
      message: { type: c.BROWSER_PRINT },
    },
    {
      title: 'New Notion Page',
      description: 'Create a new Notion page',
      message: { type: c.TABS_CREATE, payload: 'https://notion.new' },
    },
    {
      title: 'New Google Sheet',
      description: 'Create a new Google Sheet',
      message: { type: c.TABS_CREATE, payload: 'https://sheets.new' },
    },
    {
      title: 'New Google Doc',
      description: 'Create a new Google Doc',
      message: { type: c.TABS_CREATE, payload: 'https://docs.new' },
    },
    {
      title: 'New Google Slides',
      description: 'Create a new Google Slides',
      message: { type: c.TABS_CREATE, payload: 'https://slides.new' },
    },
    {
      title: 'New Google Form',
      description: 'Create a new Google Form',
      message: { type: c.TABS_CREATE, payload: 'https://forms.new' },
    },
    {
      title: 'New Medium Story',
      description: 'Create a new Medium story',
      message: { type: c.TABS_CREATE, payload: 'https://story.new' },
    },
    {
      title: 'New Github Repository',
      description: 'Create a new Github repository',
      message: { type: c.TABS_CREATE, payload: 'https://github.new' },
    },
    {
      title: 'New Github Gist',
      description: 'Create a new Github gist',
      message: { type: c.TABS_CREATE, payload: 'https://gist.new' },
    },
    {
      title: 'New Codepen',
      description: 'Create a new Codepen',
      message: { type: c.TABS_CREATE, payload: 'https://pen.new' },
    },
    {
      title: 'New Excel Spreadsheet',
      description: 'Create a new Excel Spreadsheet',
      message: { type: c.TABS_CREATE, payload: 'https://excel.new' },
    },
    {
      title: 'New PowerPoint Presentation',
      description: 'Create a new PowerPoint Presentation',
      message: { type: c.TABS_CREATE, payload: 'https://powerpoint.new' },
    },
    {
      title: 'New Word Document',
      description: 'Create a new Word Document',
      message: { type: c.TABS_CREATE, payload: 'https://word.new' },
    },
    {
      title: 'Create a whiteboard',
      description: 'Create a new whiteboard',
      message: { type: c.TABS_CREATE, payload: 'https://whiteboard.new' },
    },
    {
      title: 'Create a recording',
      description: 'Create a new recording',
      message: { type: c.TABS_CREATE, payload: 'https://recording.new' },
    },
    {
      title: 'New Figma Project',
      description: 'Create a new Figma project',
      message: { type: c.TABS_CREATE, payload: 'https://figma.new' },
    },
    {
      title: 'New Figma Jam',
      description: 'Create a new Figma Jam',
      message: { type: c.TABS_CREATE, payload: 'https://figjam.new' },
    },
    {
      title: 'New Product Hunt Post',
      description: 'Create a new Product Hunt post',
      message: { type: c.TABS_CREATE, payload: 'https://www.producthunt.com/posts/new' },
    },
    {
      title: 'New X (Twitter) Post',
      description: 'Create a new X (Twitter) post',
      message: { type: c.TABS_CREATE, payload: 'https://x.com/intent/post' },
    },
    {
      title: 'New Spotify Playlist',
      description: 'Create a new Spotify playlist',
      message: { type: c.TABS_CREATE, payload: 'https://playlist.new' },
    },
    {
      title: 'New Canva design',
      description: 'Create a new Canva design',
      message: { type: c.TABS_CREATE, payload: 'https://canva.new' },
    },
    {
      title: 'New Podcast Episode',
      description: 'Create a new Podcast Episode',
      message: { type: c.TABS_CREATE, payload: 'https://episode.new' },
    },
    {
      title: 'Edit Photo',
      description: 'Edit the photo with Adobe Photoshop',
      message: { type: c.TABS_CREATE, payload: 'https://photo.new' },
    },
    {
      title: 'Convert to PDF',
      description: 'Convert a file to PDF',
      message: { type: c.TABS_CREATE, payload: 'https://pdf.new' },
    },
    {
      title: 'Scan a QR code',
      description: 'Scan a QR code with your camera',
      message: { type: c.TABS_CREATE, payload: 'https://scan.new' },
    },
    {
      title: 'Add a task to Asana',
      description: 'Create a new task in Asana',
      message: { type: c.TABS_CREATE, payload: 'https://task.new' },
    },
    {
      title: 'New Linear issue',
      description: 'Create a new Linear issue',
      message: { type: c.TABS_CREATE, payload: 'https://linear.new' },
    },
    {
      title: 'Add a task to WIP',
      description: 'Create a new task in WIP',
      message: { type: c.TABS_CREATE, payload: 'https://todo.new' },
    },
    {
      title: 'New Google Calendar event',
      description: 'Create a new event on Google Calendar',
      message: { type: c.TABS_CREATE, payload: 'https://cal.new' },
    },
    {
      title: 'New Google Keep note',
      description: 'Create a new note in Google Keep',
      message: { type: c.TABS_CREATE, payload: 'https://note.new' },
    },
    {
      title: 'New Google Meet',
      description: 'Create a new Google Meet meeting',
      message: { type: c.TABS_CREATE, payload: 'https://meet.new' },
    },
    {
      title: 'Browsing history',
      description: 'Browse your browsing history',
      message: { type: c.TABS_CREATE, payload: 'chrome://history' },
    },
    {
      title: 'Incognito mode',
      description: 'Open a new incognito window',
      message: { type: c.WINDOWS_CREATE_INCOGNITO },
    },
    {
      title: 'Downloads',
      description: 'Browse your downloads',
      message: { type: c.TABS_CREATE, payload: 'chrome://downloads' },
    },
    {
      title: 'Extensions',
      description: 'Manage your Chrome Extensions',
      message: { type: c.TABS_CREATE, payload: 'chrome://extensions' },
    },
    {
      title: 'Settings',
      description: 'Manage your Chrome settings',
      message: { type: c.TABS_CREATE, payload: 'chrome://settings' },
    },
    {
      title: 'Scroll to bottom',
      description: 'Scroll to the bottom of the page',
      message: { type: c.BROWSER_SCROLL_TO_BOTTOM },
    },
    {
      title: 'Scroll to top',
      description: 'Scroll to the top of the page',
      message: { type: c.BROWSER_SCROLL_TO_TOP },
    },
    {
      title: 'Go back',
      description: 'Go back in history for the current tab',
      message: { type: c.TABS_GO_BACK },
    },
    {
      title: 'Go forward',
      description: 'Go forward in history for the current tab',
      message: { type: c.TABS_GO_FORWARD },
    },
    {
      title: 'Duplicate tab',
      description: 'Duplicate the current tab',
      message: { type: c.TABS_DUPLICATE },
    },
    {
      title: 'Close tab',
      description: 'Close the current tab',
      message: { type: c.TABS_REMOVE },
    },
    {
      title: 'Close window',
      description: 'Close the current window',
      message: { type: c.WINDOWS_REMOVE },
    },
    {
      title: 'Manage browsing data',
      description: 'Manage your browsing data',
      message: { type: c.TABS_CREATE, payload: 'chrome://settings/clearBrowserData' },
    },
    {
      title: 'Clear all browsing data',
      description: 'Clear all of your browsing data',
      message: { type: c.BROWSING_DATA_REMOVE_ALL },
    },
    {
      title: 'Clear browsing history',
      description: 'Clear all of your browsing history',
      message: { type: c.BROWSING_DATA_REMOVE_HISTORY },
    },
    {
      title: 'Clear cookies',
      description: 'Clear all of your cookies',
      message: { type: c.BROWSING_DATA_REMOVE_COOKIES },
    },
    {
      title: 'Clear cache',
      description: 'Clear all of your cache',
      message: { type: c.BROWSING_DATA_REMOVE_CACHE },
    },
    {
      title: 'Clear local storage',
      description: 'Clear all of your local storage',
      message: { type: c.BROWSING_DATA_REMOVE_LOCAL_STORAGE },
    },
    {
      title: 'Clear passwords',
      description: 'Clear all of your passwords',
      message: { type: c.BROWSING_DATA_REMOVE_PASSWORDS },
    },
  ];

  return commands;
};
