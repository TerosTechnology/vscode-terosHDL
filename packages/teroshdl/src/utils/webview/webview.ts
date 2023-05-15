import * as path from 'path';

import {
  workspace as Workspace,

  Disposable,
  ExtensionContext,
  WebviewPanel,
  ViewColumn,
  window,
  WebviewPanelOnDidChangeViewStateEvent,
  Uri
} from 'vscode';

import { Invalidates, Message } from './interfaces';

export abstract class WebviewController<TBootstrap> extends Disposable {
  private panel: WebviewPanel | undefined;
  private disposablePanel: Disposable | undefined;
  private invalidateOnVisible: Invalidates;
  private readonly context: ExtensionContext;

  constructor(context: ExtensionContext) {
    // Applying dispose callback for our disposable function
    super(() => this.dispose());

    this.context = context;
  }

  dispose(): void {
    if (this.disposablePanel) {
      this.disposablePanel.dispose();
    }
  }

  async show(): Promise<void> {
    const html = await this.getHtml();

    // If panel already opened just reveal
    if (this.panel !== undefined) {
      // Replace placeholders in html content for assets and adding configurations as `window.bootstrap`
      const fullHtml = this.replaceInPanel(html);
      this.panel.webview.html = fullHtml;
      return this.panel.reveal(ViewColumn.One);
    }
    let image_path = path.join(this.context.extensionPath, 'resources');
    this.panel = window.createWebviewPanel(
      this.id,
      this.title,
      ViewColumn.One,
      {
        retainContextWhenHidden: true,
        enableFindWidget: true,
        enableCommandUris: true,
        enableScripts: true,
        localResourceRoots: [Uri.file(image_path)]
      }
    );

    // Applying listeners
    this.disposablePanel = Disposable.from(
      this.panel,
      this.panel.onDidDispose(this.onPanelDisposed, this),
      this.panel.onDidChangeViewState(this.onViewStateChanged, this),
      this.panel.webview.onDidReceiveMessage(this.onMessageReceived, this)
    );

    let mediaPath = Uri.file(path.join(this.context.extensionPath, 'resources', 'release_notes')).with({
      scheme: "vscode-resource"
    }).toString() + '/';

    let fullHtml = `<base href="${mediaPath}">`;

    // Replace placeholders in html content for assets and adding configurations as `window.bootstrap`
    fullHtml += this.replaceInPanel(html);

    this.panel.webview.html = fullHtml;
  }

  protected onMessageReceived(event: Message): void {
    if (event === null) {
      return;
    }

    console.log(`WebviewEditor.onMessageReceived: type=${event.type}, data=${JSON.stringify(event)}`);

    switch (event.type) {
      case 'saveSettings':
        // TODO: update settings
        break;
      default:
        break;
    }
  }

  private replaceInPanel(html: string): string {
    if (this.panel === undefined) {
      return '';
    }

    const banner_path = this.panel.webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 
    'release_notes', 'low_res_banner.png')).toString();

    // Replace placeholders in html content for assets and adding configurations as `window.bootstrap`
    const fullHtml = html
      .replace(/{{root}}/g, this.panel.webview.asWebviewUri(Uri.file(this.context.asAbsolutePath('./resources/release_notes'))).toString())
      .replace(/{{cspSource}}/g, this.panel.webview.cspSource)
      .replace(/{{banner}}/g, banner_path)
      .replace('\'{{bootstrap}}\'', JSON.stringify(this.getBootstrap()));

    return fullHtml;
  }

  private async getHtml(): Promise<string> {
    const doc = await Workspace
      .openTextDocument(this.context.asAbsolutePath(path.join('resources/release_notes', this.filename)));
    return doc.getText();
  }


  private onPanelDisposed(): void {
    if (this.disposablePanel) {
      this.disposablePanel.dispose();
    }

    this.panel = undefined;
  }

  private async onViewStateChanged(event: WebviewPanelOnDidChangeViewStateEvent): Promise<void> {
    console.log('WebviewEditor.onViewStateChanged', event.webviewPanel.visible);

    if (!this.invalidateOnVisible || !event.webviewPanel.visible) {
      return;
    }

    // Update the view since it can be outdated
    const invalidContext = this.invalidateOnVisible;
    this.invalidateOnVisible = undefined;

    switch (invalidContext) {
      case 'config':
        // Post the new configuration to the view
        // return this.postUpdatedConfiguration();
        return;
      default:
        return this.show();
    }
  }

  abstract get filename(): string;
  abstract get id(): string;
  abstract get title(): string;
  abstract getBootstrap(): TBootstrap;
}