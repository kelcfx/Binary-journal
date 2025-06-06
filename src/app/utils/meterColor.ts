export function getMeterColor(progress: number, profit: number): string {
    if (profit < 0) return 'bg-red-500';
    if (progress >= 100) return 'bg-green-500';
    if (progress > 0) return 'bg-gray-500'; // Changed from blue to gray
    return 'bg-gray-400';
}

export const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B'];