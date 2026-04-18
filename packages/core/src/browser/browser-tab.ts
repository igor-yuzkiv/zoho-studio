export type BrowserTabId = number

export type BrowserTab = {
    id: BrowserTabId;
    title: string;
    url: string;
    is_active: boolean,
}
