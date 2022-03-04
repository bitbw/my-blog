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
    交互行为 Behavior
    G6 中的交互行为。G6 内置了一系列交互行为，用户可以直接使用。简单地理解，就是可以一键开启这些交互行为：

    drag-canvas：拖拽画布；
    zoom-canvas：缩放画布。

    交互管理 Mode
    Mode 是 G6 交互行为的管理机制，一个 mode 是多种行为 Behavior 的组合，允许用户通过切换不同的模式进行交互行为的管理。由于该概念较为复杂，在本入门教程中，读者不需要对该机制深入理解。如有需求，参见 交互模式 Mode。

    交互状态 State
    状态 State 是 G6 中的状态机制。用户可以为图中的元素（节点/边）设置不同的状态及不同状态下的样式。在状态发生变化时，G6 自动更新元素的样式。例如，可以为节点设置状态 'click' 为 true 或 false，并为节点设置 'click' 的样式为加粗节点边框。当 'click' 状态被切换为 true 时，节点的边框将会被加粗，'click' 状态被切换为 false 时，节点的样式恢复到默认。在下面的使用方法中，将会有具体例子。
     */

    const graph = new G6.Graph({
      //////////////////////////////////////////////////////////////////////////
      //  交互管理 Mode
      //////////////////////////////////////////////////////////////////////////
      modes: {
        // 默认模式
        default: [
          // 拖拽节点
          "drag-node",
          // 拖拽整个画布
          "drag-canvas",
          // 放缩画布
          "zoom-canvas",
        ],
        // 编辑模式
        edit: [],
      },
      //////////////////////////////////////////////////////////////////////////
      // 交互状态 State
      //////////////////////////////////////////////////////////////////////////
      // 节点不同状态下的样式集合
      nodeStateStyles: {
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          fill: "lightsteelblue",
        },
        // 鼠标点击节点，即 click 状态为 true 时的样式
        click: {
          stroke: "#000",
          lineWidth: 3,
        },
      },
      // 边不同状态下的样式集合
      edgeStateStyles: {
        // 鼠标点击边，即 click 状态为 true 时的样式
        click: {
          stroke: "steelblue",
        },
      },
      //////////////////////////////////////////////////////////////////////////

      // Object，可选，布局的方法及其配置项，默认为 random 布局。
      layout: {
        type: "force", // 指定为力导向布局
        preventOverlap: true, // 防止节点重叠
        linkDistance: 100, // 指定边距离为100
        // nodeSize: 30, // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
      },
      animate: true, // 是否启用图的动画。

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
    /* 
    监听事件并切换元素状态
    G6 中所有元素监听都挂载在图实例上，如下代码中的 graph 对象是 G6.Graph 的实例，graph.on()  函数监听了某元素类型（node / edge）的某种事件（click / mouseenter / mouseleave / ... 所有事件参见：Event API）。
    // 在图实例 graph 上监听
    graph.on('元素类型:事件名', (e) => {
      // do something
    });
     */
    //////////////////////////////////////////////////////////////////////////
    // 监听事件并切换元素状态
    //////////////////////////////////////////////////////////////////////////
    // 鼠标进入节点
    graph.on("node:mouseenter", (e) => {
      const nodeItem = e.item; // 获取鼠标进入的节点元素对象
      graph.setItemState(nodeItem, "hover", true); // 设置当前节点的 hover 状态为 true
    });

    // 鼠标离开节点
    graph.on("node:mouseleave", (e) => {
      const nodeItem = e.item; // 获取鼠标离开的节点元素对象
      graph.setItemState(nodeItem, "hover", false); // 设置当前节点的 hover 状态为 false
    });

    // 点击节点
    graph.on("node:click", (e) => {
      // 先将所有当前是 click 状态的节点置为非 click 状态
      const clickNodes = graph.findAllByState("node", "click");
      console.log("Bowen: mounted -> clickNodes", clickNodes)
      clickNodes.forEach((cn) => {
        graph.setItemState(cn, "click", false);
      });
      const nodeItem = e.item; // 获取被点击的节点元素对象
      graph.setItemState(nodeItem, "click", true); // 设置当前节点的 click 状态为 true
    });

    // 点击边
    graph.on("edge:click", (e) => {
      // 先将所有当前是 click 状态的边置为非 click 状态
      const clickEdges = graph.findAllByState("edge", "click");
      clickEdges.forEach((ce) => {
        graph.setItemState(ce, "click", false);
      });
      const edgeItem = e.item; // 获取被点击的边元素对象
      graph.setItemState(edgeItem, "click", true); // 设置当前边的 click 状态为 true
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
