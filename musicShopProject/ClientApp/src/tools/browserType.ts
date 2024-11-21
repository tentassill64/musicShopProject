export enum BrowserType {
    Mobile = 1,
    Desktop = 2
}

export const browserType: BrowserType = (window as any).browserType as BrowserType; 