'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function TrendChart({
  data,
  color,
  dataKey,
  label
}: {
  data: { date: string; [key: string]: string | number | boolean }[];
  color: string;
  dataKey: string;
  label: string;
}) {
  return (
    <div className="h-48 w-full">
      <p className="mb-2 text-sm font-medium">{label}</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis domain={[1, 5]} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
