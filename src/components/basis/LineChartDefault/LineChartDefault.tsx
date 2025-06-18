import React from 'react';
import { LineChart } from '@mui/x-charts';

interface LineChartProps {
  xData: (string | number)[];
  yData: number[];
  label?: string;
  xAxisConfig?: any;
  yAxisConfig?: any;
}

export default function LineChartDefault({
  xData,
  yData,
  xAxisConfig = {},
  yAxisConfig = {},
  label = 'Métricas',
}: LineChartProps) {
  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <LineChart
        series={[{
          data: yData,
          label,
          color: '#1976d2',
        }]}
        xAxis={[{
          data: xData,
          scaleType: 'point',
          label: 'Dias da Semana',
          ...xAxisConfig,       
        }]}
        yAxis={[{
          ...yAxisConfig,
        }]}
        height={300}
      />
    </div>
  );
}
