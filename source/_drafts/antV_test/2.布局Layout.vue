<template>
  <v-container>
    <div id="mountNode"></div>
  </v-container>
</template>

<script>
/* eslint-disable no-undef*/
export default {
  name: "Test",
  async mounted() {
    /* 
    当数据中没有节点位置信息，或者数据中的位置信息不满足需求时，需要借助一些布局算法对图进行布局。G6 提供了 9 种一般图的布局和 4 种树图的布局：
    一般图：

    Random Layout：随机布局；
    Force Layout：经典力导向布局：

    力导向布局：一个布局网络中，粒子与粒子之间具有引力和斥力，从初始的随机无序的布局不断演变，逐渐趋于平衡稳定的布局方式称之为力导向布局。适用于描述事物间关系，比如人物关系、计算机网络关系等。

    Circular Layout：环形布局；
    Radial Layout：辐射状布局；
    MDS Layout：高维数据降维算法布局；
    Fruchterman Layout：Fruchterman 布局，一种力导布局；
    Dagre Layout：层次布局；
    Concentric Layout：同心圆布局，将重要（默认以度数为度量）的节点放置在布局中心；
    Grid Layout：格子布局，将节点有序（默认是数据顺序）排列在格子上。
    树图布局：

    Dendrogram Layout：树状布局（叶子节点布局对齐到同一层）；
    CompactBox Layout：紧凑树布局；
    Mindmap Layout：脑图布局；
    Indented Layout：缩进布局。
     */

    /* 
      配置布局
     */
    const graph = new G6.Graph({
      //////////////////////////////////////////////////////////////////////////
      // Object，可选，布局的方法及其配置项，默认为 random 布局。
      layout: {
        type: "force", // 指定为力导向布局
        preventOverlap: true, // 防止节点重叠
        linkDistance: 100, // 指定边距离为100
        // nodeSize: 30, // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
      },
      //////////////////////////////////////////////////////////////////////////
      animate: true, // 是否启用图的动画。
      // 图上行为模式的集合。由于比较复杂，按需参见：G6 中的 Mode 教程。
      modes: {
        default: [
          // 拖拽节点
          "drag-node",
          // 拖拽整个画布
          "drag-canvas",
        ],
      },
      defaultNode: {
        size: 30,
        labelCfg: {
          style: {
            fill: "#fff",
          },
        },
      },
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
        },
      },
      container: "mountNode", // 指定挂载容器
      width: 1000, // 图的宽度
      height: 1000, // 图的高度
    });

    const main = async () => {
      const response = await fetch(
        "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json"
      );
      const remoteData = await response.json();

      const nodes = remoteData.nodes;
      const edges = remoteData.edges;
      nodes.forEach((node) => {
        if (!node.style) {
          node.style = {};
        }
        node.style.lineWidth = 1;
        node.style.stroke = "#666";
        node.style.fill = "steelblue";
        switch (node.class) {
          case "c0": {
            node.type = "circle";
            break;
          }
          case "c1": {
            node.type = "rect";
            node.size = [35, 20];
            break;
          }
          case "c2": {
            node.type = "ellipse";
            node.size = [35, 20];
            break;
          }
        }
      });
      edges.forEach((edge) => {
        if (!edge.style) {
          edge.style = {};
        }
        edge.style.lineWidth = edge.weight;
        edge.style.opacity = 0.6;
        edge.style.stroke = "grey";
      });

      graph.data(remoteData);
      graph.render();
    };
    main();
  },
};
</script>
