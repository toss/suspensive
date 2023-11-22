import { createElement } from 'react'
import type { FunctionComponent } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

/**
 * Loads an image from the given source URL.
 * @param src - The source URL of the image to load.
 * @returns A Promise that resolves to the loaded image.
 * @throws Will reject the promise if the image fails to load.
 */
export const load = (src: HTMLImageElement['src']) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject()
    image.src = src
  })

type LoadSrc = Parameters<typeof load>[0]

type LoadState<TLoadSrc extends LoadSrc> = {
  src: TLoadSrc
  promise?: Promise<unknown>
  error?: unknown
}

type Notify = (...args: unknown[]) => unknown
class LoadClient {
  private loadCache = new Map<LoadSrc, LoadState<LoadSrc>>()
  private notifiesMap = new Map<LoadSrc, Notify[]>()

  attach(src: LoadSrc, notify: Notify) {
    const notifies = this.notifiesMap.get(src)
    this.notifiesMap.set(src, [...(notifies ?? []), notify])

    return {
      detach: () => this.detach(src, notify),
    }
  }

  detach(src: LoadSrc, notify: Notify) {
    const notifies = this.notifiesMap.get(src)
    if (notifies) {
      this.notifiesMap.set(
        src,
        notifies.filter((item) => item !== notify)
      )
    }
  }

  load<TLoadSrc extends LoadSrc>(src: TLoadSrc) {
    const loadState = this.loadCache.get(src)

    if (loadState?.error) {
      throw loadState.error
    }
    if (loadState?.src) {
      return loadState as LoadState<TLoadSrc>
    }
    if (loadState?.promise) {
      throw loadState.promise
    }

    const newLoadState: LoadState<TLoadSrc> = {
      src,
      promise: load(src)
        .then((image) => (newLoadState.src = image.src as TLoadSrc))
        .catch(() => (newLoadState.error = `${src}: load error`)),
    }

    this.loadCache.set(src, newLoadState)
    throw newLoadState.promise
  }

  private notify(src: LoadSrc) {
    const notifies = this.notifiesMap.get(src)
    if (notifies) {
      for (const notify of notifies) {
        notify()
      }
    }
  }
}

const loadClient = new LoadClient()

type UseLoadOptions<TLoadSrc extends LoadSrc> = {
  src: TLoadSrc
}
export const useLoad = <TLoadSrc extends LoadSrc>(options: UseLoadOptions<TLoadSrc>) =>
  useSyncExternalStore(
    (onStoreChange) => loadClient.attach(options.src, onStoreChange).detach,
    () => loadClient.load<TLoadSrc>(options.src),
    () => loadClient.load<TLoadSrc>(options.src)
  )

type LoadProps<TLoadSrc extends LoadSrc> = {
  src: TLoadSrc
  children: FunctionComponent<LoadState<TLoadSrc>>
}
export const Load = <TLoadSrc extends LoadSrc>({ src, children }: LoadProps<TLoadSrc>) =>
  createElement(children, useLoad({ src }))
