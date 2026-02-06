import { getIncomers, getOutgoers, useReactFlow } from "reactflow";

const useRemoveNodesAutomation = () => {
  const { getNodes, getEdges, deleteElements, getNode } = useReactFlow();

  function removeTreeOfOutGoers(sourceId) {
    const outGoers = getOutgoers({ id: sourceId }, getNodes(), getEdges());

    deleteElements({ nodes: [getNode(sourceId)] });
    if (outGoers.length) {
      deleteElements({ nodes: outGoers });

      // we loop through the outgoers and try to remove any outgoers of our outgoers
      outGoers.forEach((outgoer) => {
        removeTreeOfOutGoers(outgoer.id);
      });
    }
  }
  function removeTreeOfOutGoersofIOutGoers(sourceId) {
    const outGoers = getOutgoers({ id: sourceId }, getNodes(), getEdges());
    if (outGoers.length) {
      deleteElements({ nodes: outGoers });
      // we loop through the outgoers and try to remove any outgoers of our outgoers
      outGoers.forEach((outgoer) => {
        removeTreeOfOutGoers(outgoer.id);
      });
    }
  }
  function removeTreeOfOutGoersOfNurturing(sourceId) {
    const outGoers = getOutgoers({ id: sourceId }, getNodes(), getEdges());

    const outGoersOfOutGoers = getOutgoers(
      { id: outGoers[0]?.id },
      getNodes(),
      getEdges()
    );

    if (outGoersOfOutGoers.length) {
      outGoersOfOutGoers.forEach((outgoer) => {
        removeTreeOfOutGoers(outgoer.id);
      });
    }
  }

  function removeDelay(sourceId) {
    const incomers = getIncomers({ id: sourceId }, getNodes(), getEdges());

    if (incomers[0].type !== "ifElseNode") {
      deleteElements({ nodes: incomers });
    }
  }

  return {
    removeTreeOfOutGoers,
    removeDelay,
    removeTreeOfOutGoersOfNurturing,
    removeTreeOfOutGoersofIOutGoers,
  };
};

export default useRemoveNodesAutomation;
