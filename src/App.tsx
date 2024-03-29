import React from "react";
import СomparisonApproach from "./components/1-СomparisonApproach"
import Observables from "./components/2-Observables"
import Operators from "./components/3-Operators"
import { Tree, TreeDataNode } from "antd";
import {
  DownOutlined,
} from '@ant-design/icons';
import './app.scss'

const App: React.FC = () =>  {
  const treeData: TreeDataNode[] = [
    { 
      title: 'Сomparison Approach', 
      key: '0',
      children: [
        {
          title: '',
          key: '0-1',
          icon: <СomparisonApproach />,
        },
      ],
    },
    { 
      title: 'Observables', 
      key: '1',
      children: [
        {
          title: '',
          key: '1-1',
          icon: <Observables />,
        },
      ],
    },
    { 
      title: 'Operators', 
      key: '2',
      children: [
        {
          title: '',
          key: '2-1',
          icon: <Operators />,
        },
      ],
    },
  ];

  return (
    <>
      <Tree
        showIcon
        switcherIcon={<DownOutlined />}
        treeData={treeData}
      />
    </>
  )
}

export default App
