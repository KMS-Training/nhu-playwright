export function currentTime(format: string = "HH:mm:ss"): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");

    const tokens: Record<string, string> = {
        YYYY: now.getFullYear().toString(),
        MM: pad(now.getMonth() + 1),
        DD: pad(now.getDate()),
        HH: pad(now.getHours()),
        mm: pad(now.getMinutes()),
        ss: pad(now.getSeconds()),
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => tokens[match]);
}
