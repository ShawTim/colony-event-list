import dayjs from 'dayjs';

export const formatDate = (ts: number): string => dayjs(ts).format("DD MMM");