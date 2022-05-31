import React from 'react';

import { CustomTree } from './CustomTree';
import { NativeTree } from './NativeTree';
import { getMockData } from './utils/getMockData';
import { mockItems } from './mocks/mock';

import './App.css';

function App() {
  const [treeKind, setTreeKind] = React.useState<'custom' | 'native'>('custom');

  const handleSwitchTree = () => {
    const treeKindUpdated = treeKind === 'custom' ? 'native' : 'custom';

    setTreeKind(treeKindUpdated);
  };

  const mockData = React.useMemo(() => getMockData(1000), []);

  return (
    <div className="App">
      <button
        onClick={handleSwitchTree}
        style={{ position: 'fixed', top: 50, right: 50 }}
      >
        сменить вид дерева
      </button>
      {treeKind === 'custom' ? (
        <CustomTree items={mockData} />
      ) : (
        <NativeTree items={mockData} />
      )}
    </div>
  );
}

export default App;
