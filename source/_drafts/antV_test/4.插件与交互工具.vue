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
    插件与工具
    为辅助用户在图上探索，G6 提供了一些辅助工具，其中一部分是插件工具，另一部分是交互工具。

    本文将为 Tutorial 案例 添加缩略图插件、网格插件、节点提示框、边提示框。

    插件
    使用插件时，有三个步骤：
      Step 1: 引入插件；
      Step 2: 实例化插件；
      Step 3: 在实例化图时将插件的实例配置到图上
    
    交互工具
    交互工具是指配置到图上交互模式中的工具。使用交互工具时，有两个步骤：
      Step 1: 在实例化图时配置 modes；
      Step 2: 为交互工具定义样式。
     */
    ////////////////////////////////////////////////////////////////////////////
    // 插件
    ////////////////////////////////////////////////////////////////////////////
    //Minimap 缩略图 (Minimap) 是一种常见的用于快速预览和探索图的工具，可作为导航辅助用户探索大规模图。
    // 实例化 minimap 插件 （minimap 原理新建了一个 canvas 定位到主体画布上）
    const minimap = new G6.Minimap({
      size: [100, 200],
      className: "minimap",
      type: "delegate",
    });
    //Image Minimap 用于优化 minimap 性能  前期展示用于替代 minimap 的 image
    // 实例化 Image Minimap 插件
    // const imageMinimap = new G6.ImageMinimap({
    //   width: 200,
    //   // 用于在 minimap 位置显示的 image
    //   graphImg:
    //     "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*eD7nT6tmYgAAAAAAAAAAAABkARQnAQ",
    // });
    // 实例化 grid 插件 grid 原理新建了一个非常大的 div 背景图片为网格  定位到主体画布上 并设置 z-index -1 ）
    const grid = new G6.Grid();
    console.log("Bowen: mounted -> grid", grid);
    // 实例化图
    const graph = new G6.Graph({
      plugins: [minimap, grid], // 将 grid 实例配置到图上
      ////////////////////////////////////////////////////////////////////////////
      modes: {
        // 默认模式
        default: [
          // 拖拽节点
          "drag-node",
          // 拖拽整个画布
          "drag-canvas",
          // 放缩画布
          "zoom-canvas",
          ////////////////////////////////////////////////////////////////////////////
          // 交互工具
          ////////////////////////////////////////////////////////////////////////////
          {
            // 提示框 tooltip
            // 本质为一个 div 定位到画布上， formatText返回的内容为div中内容 同时需要给 .g6-tooltip 样式
            type: "tooltip",
            formatText(model) {
              // 提示框文本内容
              const text =
                "label: " + model.label + "<br/> class: " + model.class;
              return text;
            },
          },
        ],
        // 编辑模式
        edit: [],
      },
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
      width: 800, // 图的宽度
      height: 500, // 图的高度
    });
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
      console.log("Bowen: mounted -> clickNodes", clickNodes);
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
<style lang="scss">
/* 提示框的样式 */
.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}

// g6 主体位置
canvas {
  position: relative;
  z-index: 1;
}
// 网格位置
.g6-grid-container {
  z-index: 0 !important;
  *,
  ::before,
  ::after {
    // 覆盖 vuetify  background-repeat: no-repeat;
    background-repeat: repeat;
  }
}
</style>
