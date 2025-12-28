export function isRouteName(name: unknown, allowedNames: string[]): boolean {
    return typeof name === 'string' && allowedNames.includes(name)
}
