import React from "react";
import DashboardLayout from "./layout/DashboardLayout";
import { LayoutSettingProvider } from "./store/contexts/LayoutSetting";
import { TopProvider } from "./store/contexts/TopContext";
import { DashboardDataProvider } from "./store/contexts/DashboardDataContext";
import { ReactFlowProvider } from "reactflow";
function App() {
  return (
    <div className="App">
      <ReactFlowProvider>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <TopProvider>
              <DashboardLayout />
            </TopProvider>
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
