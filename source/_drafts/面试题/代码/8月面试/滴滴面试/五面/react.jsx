
// 使用react实现一个 拖拽方块 不使用drag
class Drag extends ReactComponent {

    constructor(prop) {
        super(prop)
        this.left = 0
    }
    
    rander() {
        <div></div>
        let dropBle = document.querySelector(".dropBle")
        if(dropBle){
            document.onmousemove = (e)=>{
                e.target
                // 判断鼠标移动到方块的边框
                // 获取方块的长宽高 到屏幕上端的距离  到屏幕左端的距离
                dropBle.get
                
            }   
        }
        return (
            <div className="drop" >

            </div>
        )
    }
}