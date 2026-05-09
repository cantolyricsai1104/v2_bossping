import { z } from "zod";
import { useComponent } from "@copilotkit/react-core/v2";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

export const ChartProps = z.object({
  title: z.string(),
  data: z.array(z.object({ label: z.string(), value: z.number() })),
});

export function Chart({ title, data }: z.infer<typeof ChartProps>) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mt-4 w-full shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// You can render this component anywhere inside <CopilotKit> 
// and the AI will automatically be able to use it.
export function CopilotChartAgent() {
  useComponent({
    name: "showChart",
    description: "Populate data and show the user a chart",
    parameters: ChartProps,
    render: Chart
  });

  return null;
}
