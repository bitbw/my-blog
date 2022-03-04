<template>
  <v-container>
    <!--步骤.1 容器 -->
    <div id="mountNode"></div>
  </v-container>
</template>

<script>
/* eslint-disable no-undef*/
export default {
  name: "Test",
  async mounted() {
    console.log(G6.Global.version, G6);

    /*
    ## 步骤.2 数据准备
    引入 G6 的数据源为 JSON 格式的对象。该对象中需要有节点（nodes）和边（edges）字段，分别用数组表示：
     */

    const response = await fetch(
      "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json"
    );
    const initData = await response.json();
    // 将请求返回的数据遍历 设置每个节点的样式
    const nodes = initData.nodes;
    nodes.forEach((node) => {
      if (!node.style) {
        node.style = {};
      }
      switch (
        node.class // 根据节点数据中的 class 属性配置图形
      ) {
        case "c0": {
          node.type = "circle"; // class = 'c0' 时节点图形为 circle
          break;
        }
        case "c1": {
          node.type = "rect"; // class = 'c1' 时节点图形为 rect
          node.size = [35, 20]; // class = 'c1' 时节点大小
          break;
        }
        case "c2": {
          node.type = "ellipse"; // class = 'c2' 时节点图形为 ellipse
          node.size = [35, 20]; // class = 'c2' 时节点大小
          break;
        }
      }
    });
    // 遍历边数据  设置每个边的样式
    const edges = initData.edges;
    edges.forEach((edge) => {
      if (!edge.style) {
        // 边的样式会覆盖全局样式 所以需要把全局样式挪到这里
        edge.style = {
          stroke: "grey", // 边描边颜色
          opacity: 0.6, // 边透明度
        };
      }
      edge.style.lineWidth = edge.weight; // 边的粗细映射边数据中的 weight 属性数值
    });
    // 初始化数据
    // const initData = {
    //   // 点集 （节点集合）
    //   nodes: [
    //     /*
    //     元素的属性
    //     不论是节点还是边，它们的属性分为两种：

    //     样式属性 style：对应 Canvas 中的各种样式，在元素状态 State 发生变化时，可以被改变；
    //     其他属性：例如图形类型（ type）、id（id ）一类在元素状态 State 发生变化时不能被改变的属性。
    //     例如，G6 设定 hover 或 click 节点，造成节点状态的改变，只能自动改变节点的样式属性（如 fill、stroke 等），其他属性（如 type  等）不能被改变。如果需要改变其他属性，要通过  graph.updateItem 手动配置。样式属性是一个名为  style  的对象， style 字段与其他属性并行。
    //      */
    //     // 以节点元素为例，其属性的数据结构如下：
    //     {
    //       id: "node0", // 元素的 id
    //       x: 0, // 节点横坐标
    //       y: 0, // 节点纵坐标
    //       type: "rect", // 元素的图形
    //       size: 40, // 元素的大小
    //       label: "node0", // 标签文字
    //       visible: true, // 控制初次渲染显示与隐藏，若为 false，代表隐藏。默认不隐藏
    //       // 标签配置属性
    //       labelCfg: {
    //         positions: "left", // 标签的属性，标签在元素中的位置
    //         // 包裹标签样式属性的字段 style 与标签其他属性在数据结构上并行
    //         style: {
    //           fontSize: 12, // 标签的样式属性，文字字体大小
    //           // ...            // 标签的其他样式属性
    //         },
    //       },
    //       // ...,               // 其他属性
    //       // 包裹样式属性的字段 style 与其他属性在数据结构上并行
    //       style: {
    //         fill: "#000", // 样式属性，元素的填充色
    //         stroke: "#888", // 样式属性，元素的描边色
    //         // ...              // 其他样式属性
    //       },
    //     },
    //     {
    //       id: "node1", // 节点的唯一标识
    //       x: 100, // 节点横坐标
    //       y: 200, // 节点纵坐标
    //       label: "起始点", // 节点文本
    //     },
    //     {
    //       id: "node2",
    //       x: 300,
    //       y: 200,
    //       label: "目标点",
    //     },
    //   ],
    //   // 边集
    //   edges: [
    //     /*
    //     边元素的属性数据结构与节点元素相似，只是其他属性中多了 source 和 target 字段，代表起始和终止节点的 id。
    //      */
    //     // 表示一条从 node0 节点连接到 node1 节点的边
    //     {
    //       source: "node0", // 起始点 id
    //       target: "node1", // 目标点 id
    //       label: "我是连线", // 边的文本
    //     },
    //     // 表示一条从 node1 节点连接到 node2 节点的边
    //     {
    //       source: "node1", // 起始点 id
    //       target: "node2", // 目标点 id
    //       label: "我是连线", // 边的文本
    //     },
    //   ],
    // };
    /*
    ## 步骤.3 图实例化
    图实例化时，至少需要为图设置容器、宽、高：
     */
    const graph = new G6.Graph({
      fitView: true, // 设置是否将图适配到画布中
      fitViewPadding: [0, 0, 0, 10], // 画布上四周的留白宽度。
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
      // 节点默认的属性，包括节点的一般属性和样式属性（style）
      defaultNode: {
        size: 30, // 节点大小
        /*
          type node节点图形类型
          G6 支持以下图形：
          - circle：圆；
          - rect：矩形；
          - ellipse：椭圆；
          - polygon：多边形；
          - image：图片；
          - marker：标记；
          - path：路径；
          - text：文本；
          - dom(svg)：DOM（图渲染方式 renderer 为 'svg' 时可用）。
         */
        // type: "circle",
        // color: "#ff00ff",
        // 节点样式配置 文档 https://g6.antv.vision/zh/docs/api/shapeProperties#%E9%80%9A%E7%94%A8%E5%B1%9E%E6%80%A7
        style: {
          //////////////////////////////////////////////////////////////////////
          //通用属性
          //////////////////////////////////////////////////////////////////////
          // 图形名称标识，G6 3.3 版本以上必须配置。
          name: "bitbw",
          // 设置用于填充绘画的颜色(RGB 或 16 进制)、渐变或模式，对应 Canvas 属性 fillStyle 。取值示例：rgb(18, 150, 231)，#c193af，l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff， r(0.5, 0.5, 0.1) 0:#ffffff 1:#1890ff。
          fill: "steelblue",
          // 节点描边色
          stroke: "#666",
          // 边宽度
          lineWidth: 6,
          // 描边虚线，Number[] 类型中数组元素分别代表实、虚长度。
          lineDash: [1, 1],
          // 设置用于阴影的颜色。
          shadowColor: "#000000",
          // 设置用于阴影的模糊级别，数值越大，越模糊。 (扩散范围)
          shadowBlur: 20,
          // 设置阴影距形状的水平距离。(x 轴偏移量)
          shadowOffsetX: 10,
          // 设置阴影距形状的垂直距离。(Y 轴偏移量)
          shadowOffsetY: 10,
          // 设置绘图的当前 alpha 或透明值，范围 [0, 1]，对应 Canvas 属性 globalAlpha。
          opacity: 0.3,
          // 设置填充的 alpha 或透明值，优先级高于 opacity，范围 [0, 1]。
          fillOpacity: 0.9,
          // 设置描边的 alpha 或透明值，优先级高于 opacity，范围 [0, 1]。
          strokeOpacity: 0.9,
          // 鼠标在该节点上时的鼠标样式，CSS 的 cursor 选项都支持。
          cursor: "help",
          //////////////////////////////////////////////////////////////////////
          // 各个图形属性  见文档
          //////////////////////////////////////////////////////////////////////
        },
        // 节点上的标签文本配置
        labelCfg: {
          // 节点上的标签文本样式配置
          style: {
            fill: "#fff", // 节点标签文字颜色
          },
        },
      },
      // 边默认的属性，包括边的一般属性和样式属性（style）
      defaultEdge: {
        type: "polyline",
        color: "#ffff00",
        // ...                 // 边的其他配置
        // 边样式配置
        style: {
          opacity: 0.6, // 边透明度
          stroke: "grey", // 边描边颜色
        },
        // 边上的标签文本配置
        labelCfg: {
          autoRotate: true, // 边上的标签文本根据边的方向旋转
        },
      },
      // 边在除默认状态外，其他状态下的样式属性（style）。例如鼠标放置（hover）、选中（select）等状态
      nodeStateStyles: {
        hover: {},
        select: {},
      },
      container: "mountNode", // 指定挂载容器
      width: 1000, // 图的宽度
      height: 1000, // 图的高度
    });
    /*
    ## 步骤.4 图的渲染
    数据的加载和图的渲染是两个步骤，可以分开进行。
     */

    graph.data(initData); // 加载数据

    graph.render(); // 渲染 调用 graph.render() 方法之后，G6 引擎会根据加载的数据进行图的绘制。
  },
};
</script>
