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

  const innerOffset = 10;

  return (
    <div
      className="App"
      style={{ '--appOffset': `${innerOffset}px` } as React.CSSProperties}
    >
      <button onClick={handleSwitchTree} className="Button">
        change tree type
      </button>
      {treeKind === 'custom' ? (
        <CustomTree
          items={mockData}
          height={window.innerHeight - innerOffset * 2}
        />
      ) : (
        <NativeTree items={mockData} />
      )}
    </div>
  );
}

export default App;
