import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updateLastNodeValue } from "../../Redux/Slices/authSlice";
import { useReactFlow } from "reactflow";
import useToasterHook from "../useToasterHook";

const useAddNodesAutomation = () => {
  const pushNotification = useToasterHook();
  const lastNodeId = useSelector(
    (state) => state.authentication.lastNodesValue
  );
  const dispatch = useDispatch();
  const { setNodes, setEdges, getNodes } = useReactFlow();
  const addNodesInAutomationList = (nodeType, sourceId, currentNodeType) => {
    // const checkVAliadtionFor100Nodes=.filter(data=> data?.type==='delay')

    // Function to count total length excluding a specific value
    const countTotalLengthExcludingValue = () => {
      return getNodes().reduce((acc, obj) => {
        if (obj.type !== "delayNode") {
          acc++;
        }
        return acc;
      }, 0);
    };

    if (countTotalLengthExcludingValue() > 100) {
      pushNotification("error", "Node limit exceeded (>100)");
      return;
    }

    let targetId = `${lastNodeId + 1}`;

    if (currentNodeType === "ifElseNode") {
      let target = lastNodeId + 1;
      let nodesData = [];
      let edgesDAta = [];
      for (let index = 0; index < nodeType.length; index++) {
        let targetNode = {
          id: `${target + index}`,
          data: { label: `Node ${target + index}` },
          position: { x: 0, y: 0 }, // no need to pass a position as it is computed by the layout hook
          type: nodeType[index]?.next_action,
          if_else_condition: nodeType[index],
          style: { opacity: 0 },
          width: 125,
          height: 41,
        };

        let connectingEdge = {
          id: `${sourceId}->${target + index}`,
          source: sourceId,
          target: `${target + index}`,
          style: { opacity: 0 },
        };
        nodesData.push(targetNode);
        edgesDAta.push(connectingEdge);

        target = target + index;
        targetId = target + 1;
      }
      setNodes((nodes) => nodes.concat([...nodesData]));
      setEdges((edges) => edges.concat([...edgesDAta]));
      dispatch(updateLastNodeValue(targetId));
    } else {
      const delayNode = {
        id: targetId,
        data: { label: `Node ${targetId}` },
        position: { x: 0, y: 0 }, // no need to pass a position as it is computed by the layout hook
        type: "delayNode",
        delay_data: {
          trigger_by: "hour",
          interval_value: 0,
          delay_type: "nurturing",
        },
        style: { opacity: 0 },
        width: 58,
        height: 20,
      };

      const delayEdge = {
        id: `${sourceId}->${targetId}`,
        source: sourceId,
        target: targetId,
        style: { opacity: 0 },
      };
      const targetNode = {
        id: `${lastNodeId + 2}`,
        data: { label: `Node ${lastNodeId + 2}` },
        position: { x: 0, y: 0 }, // no need to pass a position as it is computed by the layout hook
        type: nodeType,
        style: { opacity: 0 },
        width: 125,
        height: 41,
      };

      const connectingEdge = {
        id: `${targetId}->${lastNodeId + 2}`,
        source: targetId,
        target: `${lastNodeId + 2}`,
        style: { opacity: 0 },
      };
      setNodes((nodes) => nodes.concat([delayNode, targetNode]));
      setEdges((edges) => edges.concat([delayEdge, connectingEdge]));
      dispatch(updateLastNodeValue(lastNodeId + 2));
    }
  };

  return addNodesInAutomationList;
};

export default useAddNodesAutomation;
