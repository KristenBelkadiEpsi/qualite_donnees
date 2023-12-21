export function removeStopsWithNumericSuffix(data: any[]): any[] {
    return data.filter(stop => !/[0-9]+$/.test(stop.stop_id));
}
