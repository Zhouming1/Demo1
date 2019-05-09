var canvas = document.getElementById("canvas");
cxt = canvas.getContext("2d");

var leval;
if (parseInt(window.location.href.split("#")[1])) {
    leval = parseInt(window.location.href.split("#")[1]);
} else {
    leval = 0;
}

var arcX = 300;//大球圆心x坐标
var arcY = 280;//大球圆心y坐标
var arcr = 50;//大球半径
var data = [
    {initNum: 2, waitNum: 9, speed: 200},
    {initNum: 4, waitNum: 6, speed: 180},
    {initNum: 5, waitNum: 6, speed: 160},
    {initNum: 5, waitNum: 6, speed: 120},
    {initNum: 4, waitNum: 5, speed: 60},
    {initNum: 8, waitNum: 3, speed: 50},
    {initNum: 10, waitNum: 3, speed: 100}
];

//绘制大球
function bigball() {
    cxt.save();
    cxt.beginPath();
    cxt.arc(arcX, arcY, arcr, 0, Math.PI * 2);
    cxt.fillStyle = "black";
    cxt.fill();
    cxt.stroke();
    cxt.beginPath();

    if (leval === data.length) {
        leval = data.length - 1;
    }
    var txt = (leval + 1) + "";
    cxt.textAlign = "center";
    cxt.textBaseline = "middle";
    cxt.font = "80px 楷体";
    cxt.strokeStyle = "#cccccc";
    cxt.fillStyle = "white";
    cxt.fillText(txt, arcX, arcY);
    cxt.strokeText(txt, arcX, arcY);
    cxt.restore();
}


//绘制旋转球
var ballr = 10;//小球的半径
var balls = [];
var balldata = data[leval].initNum;
var line = 130;
//旋转球的角度
for (var i = 0; i < balldata; i++) {
    var angle = (360 / balldata) * (i + 1);
    balls.push({"angle": angle, "numStr": ""});
}

// console.log(balls);

function smallball(deg) {
    balls.forEach(function (e) {
        // console.log(e);
        cxt.save();
        cxt.globalCompositeOperation = "destination-over";
        e.angle = e.angle + deg;
        // console.log(e.angle);
        if (e.angle >= 360) {
            e.angle = 0;
        }
        cxt.moveTo(arcX, arcY);
        var rad = 2 * Math.PI * e.angle / 360;
        var x = arcX + line * Math.cos(rad);
        var y = arcY + line * Math.sin(rad);
        // console.log(x,y);
        cxt.strokeStyle = "black";
        cxt.lineTo(x, y);
        cxt.stroke();
        cxt.restore();

        cxt.beginPath();
        cxt.arc(x, y, ballr, 0, Math.PI * 2);
        cxt.closePath();
        cxt.fillStyle = "black";
        cxt.fill();

        //旋转球上的数字
        if (e.numStr !== "") {
            cxt.textAlign = "center";
            cxt.textBaseline = "middle";
            cxt.font = "20px 楷体";
            // cxt.strokeStyle = "#cccccc";
            cxt.fillStyle = "white";
            cxt.fillText(e.numStr, x, y);
            cxt.strokeText(e.numStr, x, y);
        }
    })
}

//等待球
var waitballs = [];
var waitdata = data[leval].waitNum;
var waitline = 300;
//旋转球的角度
for (var j = waitdata; j > 0; j--) {
    waitballs.push({"angle": "", "numStr": j});
}
console.log(waitballs);
var waitx = arcX;
var waity = waitline + line;

function drawwait() {
    cxt.clearRect(0, 400, 900, 800);
    waitballs.forEach(function (e) {
        cxt.beginPath();
        cxt.arc(waitx, waity, ballr, 0, Math.PI * 2);
        cxt.fillStyle = "black";
        cxt.fill();
        cxt.closePath();

        //等待球上的数字
        cxt.textAlign = "center";
        cxt.textBaseline = "middle";
        cxt.font = "20px 楷体";
        cxt.strokeStyle = "#cccccc";
        cxt.fillStyle = "white";
        cxt.fillText(e.numStr, waitx, waity);
        cxt.strokeText(e.numStr, waitx, waity);
        waity += 3 * ballr;
    })
}


//初始化
function init(deg) {
    cxt.clearRect(0, 0, 700, 800);
    bigball();
    smallball(deg);
    drawwait();
}
init(0);
//旋转计时器
setInterval(function () {
    cxt.clearRect(0, 0, 700, 420);
    bigball();
    smallball(20);
}, data[leval].speed);

var state;
//点击
document.onclick = function () {
    if (waitballs.length === 0) return;
    var ball = waitballs.shift();//删除等待求的数量
    // console.log(ball);
    ball.angle = 90;//移除等待球的角度

    var faild = true;
    balls.forEach(function (e,index) {
        // console.log(e,index);
        if (!faild) return;
        if (line*Math.sin(Math.PI*2*(Math.abs(e.angle-ball.angle)/2)/360)<ballr){
            state = 0;
            return false;
        }else if(index === balls.length-1
                    && waitballs.length === 0){
            state = 1;
            return false;

        }
    });
    balls.push(ball);
    waity = line+waitline+26;
    drawwait();
    smallball(0);
    if (state===0){
        alert("闯关失败！重新玩此关");
        window.location.href = "./index.html#"+leval;
    }else if(state ===1){
        alert("进入下一关");
        leval++;
        window.location.href = "./index.html#"+leval;
        if (leval === 7){
            alert("闯关完毕！");
            leval = 0;
        }
    }
};




