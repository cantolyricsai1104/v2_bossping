import React from 'react';
import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2";
import "@copilotkit/react-ui/v2/styles.css";
import { CopilotChartAgent } from '../components/generative-ui/CopilotChart';
import { CopilotFormAgent } from '../components/generative-ui/CopilotForm';

export default function CopilotHackathonPage() {
  return (
    <div className="flex h-full w-full bg-slate-50 p-6">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-indigo-600 text-white font-bold">
          CopilotKit Hackathon Demo
        </div>
        
        <div className="flex-1 relative h-[600px]">
          <CopilotKit runtimeUrl="/api/copilotkit">
            {/* The Chat Interface */}
            <CopilotChat
              labels={{
                title: "Your Copilot Assistant",
                initial: "Hello! I am your CopilotKit agent. Ask me to show a chart or generate a form!",
              }}
            />
            
            {/* Registering our Agents/Components */}
            <CopilotChartAgent />
            <CopilotFormAgent />
          </CopilotKit>
        </div>
      </div>
    </div>
  );
}
