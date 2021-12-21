
export function removeBraces(source: string): string {
    return source.replace(/['"]+/g, '');
}
