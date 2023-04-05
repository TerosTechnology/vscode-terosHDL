import { WebviewController } from './webview';

export class ReleaseNotesWebview extends WebviewController<Record<string, unknown>> {
  get filename(): string {
    return 'release-notes.html';
  }

  get id(): string {
    return 'terosHDL.releaseNotes';
  }

  get title(): string {
    return 'TerosHDL Release Notes';
  }

  /**
   * This will be called by the WebviewController when init the view
   * passing as `window.bootstrap` to the view.
   */
  getBootstrap(): Record<string, unknown> {
    return {};
  }
}