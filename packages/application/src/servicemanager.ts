import { ServerConnection, SettingManager } from '@jupyterlab/services';
import type {
  ServiceManager,
  Session,
  KernelSpec,
  Setting,
  Builder,
  Contents,
  Terminal,
  Workspace,
  NbConvert,
} from '@jupyterlab/services';
import { ISignal, Signal } from '@lumino/signaling';

/**
 * A Quetz services manager
 */
export class QuetzServiceManager implements ServiceManager.IManager {
  /**
   * Construct a new services provider
   */
  constructor() {
    this.settings = new SettingManager({
      serverSettings: this.serverSettings,
    });
  }

  /**
   * A signal emitted when there is a connection failure with the kernel.
   */
  get connectionFailure(): ISignal<this, Error> {
    return this._connectionFailure;
  }

  /**
   * Test whether the service manager is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * The server settings of the manager.
   */
  get serverSettings(): ServerConnection.ISettings {
    return ServerConnection.makeSettings();
  }

  /**
   * Get the session manager instance.
   */
  readonly sessions: Session.IManager;

  /**
   * Get the session manager instance.
   */
  readonly kernelspecs: KernelSpec.IManager;

  /**
   * Get the setting manager instance.
   */
  readonly settings: Setting.IManager;

  /**
   * The builder for the manager.
   */
  readonly builder: Builder.IManager;

  /**
   * Get the contents manager instance.
   */
  readonly contents: Contents.IManager;

  /**
   * Get the terminal manager instance.
   */
  readonly terminals: Terminal.IManager;

  /**
   * Get the workspace manager instance.
   */
  readonly workspaces: Workspace.IManager;

  /**
   * Get the nbconvert manager instance.
   */
  readonly nbconvert: NbConvert.IManager;

  /**
   * Test whether the manager is ready.
   */
  get isReady(): boolean {
    return true;
  }

  /**
   * A promise that fulfills when the manager is ready.
   */
  get ready(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Dispose of the resources used by the manager.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }

    this._isDisposed = true;
    Signal.clearData(this);
  }

  private _isDisposed = false;
  private _connectionFailure = new Signal<this, Error>(this);
}
