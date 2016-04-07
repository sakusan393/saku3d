function hsva(h, s, v, a) {
    if (s > 1 || v > 1 || a > 1) {
        return;
    }
    var th = h % 360;
    var i = Math.floor(th / 60);
    var f = th / 60 - i;
    var m = v * (1 - s);
    var n = v * (1 - s * f);
    var k = v * (1 - s * (1 - f));
    var color = new Array();
    if (!s > 0 && !s < 0) {
        color.push(v, v, v, a);
    } else {
        var r = new Array(v, n, m, m, k, v);
        var g = new Array(k, v, v, n, m, m);
        var b = new Array(m, m, k, v, v, n);
        color.push(r[i], g[i], b[i], a);
    }
    return color;
}

function sphere(row, column, rad, color) {
    var pos = new Array(), nor = new Array(),
        col = new Array(), st = new Array(), idx = new Array();
    for (var i = 0; i <= row; i++) {
        var r = Math.PI / row * i;
        var ry = Math.cos(r);
        var rr = Math.sin(r);
        for (var ii = 0; ii <= column; ii++) {
            var tr = Math.PI * 2 / column * ii;
            var tx = rr * rad * Math.cos(tr);
            var ty = ry * rad;
            var tz = rr * rad * Math.sin(tr);
            var rx = rr * Math.cos(tr);
            var rz = rr * Math.sin(tr);
            if (color) {
                var tc = color;
            } else {
                tc = hsva(360 / row * i, 1, 1, 1);
            }
            pos.push(tx, ty, tz);
            nor.push(rx, ry, rz);
            col.push(tc[0], tc[1], tc[2], tc[3]);
            st.push(1 - 1 / column * ii, 1 / row * i);
        }
    }
    r = 0;
    for (i = 0; i < row; i++) {
        for (ii = 0; ii < column; ii++) {
            r = (column + 1) * i + ii;
            idx.push(r, r + 1, r + column + 2);
            idx.push(r, r + column + 2, r + column + 1);
        }
    }

    var all = [];
    var pStride = 3;
    var nStride = 3;
    var tStride = 2;
    var dataLength = pos.length / 3;
    for (i = 0; i < dataLength; i++) {
        all.push(pos[(i * pStride) + 0])
        all.push(pos[(i * pStride) + 1])
        all.push(pos[(i * pStride) + 2])
        all.push(nor[(i * nStride) + 0])
        all.push(nor[(i * nStride) + 1])
        all.push(nor[(i * nStride) + 2])
        all.push(st[(i * tStride) + 0])
        all.push(st[(i * tStride) + 1])
    }

    return {p: pos, n: nor, c: col, t: st, i: idx, a: all};
}


function cube(side, color) {
    var tc, hs = side * 0.5;
    var pos = [
        -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs,
        -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs,
        -hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs,
        -hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs,
        hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs,
        -hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs
    ];
    var nor = [
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
    ];
    var col = new Array();
    for (var i = 0; i < pos.length / 3; i++) {
        if (color) {
            tc = color;
        } else {
            tc = hsva(360 / pos.length / 3 * i, 1, 1, 1);
        }
        col.push(tc[0], tc[1], tc[2], tc[3]);
    }
    var st = [
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
    ];
    var idx = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];
    return {p: pos, n: nor, c: col, t: st, i: idx};
}
function plane(side, color) {
    var tc, hs = side * 0.5;
    var pos = [
        -hs, -hs, 0, hs, -hs, 0, hs, hs, 0, -hs, hs, 0
    ];
    var nor = [
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0
    ];
    var col = new Array();
    for (var i = 0; i < pos.length / 3; i++) {
        if (color) {
            tc = color;
        } else {
            tc = hsva(360 / pos.length / 3 * i, 1, 1, 1);
        }
        col.push(tc[0], tc[1], tc[2], tc[3]);
    }
    var st = [
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
    ];
    var idx = [
        0, 1, 2, 0, 2, 3
    ];
    return {p: pos, n: nor, c: col, t: st, i: idx};
}

function beam(side, color) {
    var tc, hs = 1 * 0.5;
    var pos = [
        -hs, -hs, hs,
        hs, -hs, hs,
        hs, hs, hs,
        -hs, hs, hs,
        -hs, -hs, -hs,
        -hs, hs, -hs,
        hs, hs, -hs,
        hs, -hs, -hs,
        -hs, hs, -hs,
        -hs, hs, hs,
        hs, hs, hs,
        hs, hs, -hs,
        -hs, -hs, -hs,
        hs, -hs, -hs,
        hs, -hs, hs,
        -hs, -hs, hs,
        hs, -hs, -hs,
        hs, hs, -hs,
        hs, hs, hs,
        hs, -hs, hs,
        -hs, -hs, -hs,
        -hs, -hs, hs,
        -hs, hs, hs,
        -hs, hs, -hs
    ];
    var nor = [
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
    ];
    var col = new Array();
    for (var i = 0; i < pos.length / 3; i++) {
        if (color) {
            tc = color;
        } else {
            tc = hsva(360 / pos.length / 3 * i, 1, 1, 1);
        }
        col.push(tc[0], tc[1], tc[2], tc[3]);
    }
    var st = [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ];
    var idx = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];
    return {p: pos, n: nor, c: col, t: st, i: idx};
}

function star() {
    var pos = [];
    ratio = 80;
    for (var i = 0; i < 50; i++) {
        pos.push(ratio * (Math.random() - 0.5), ratio * (Math.random()) + 1, ratio * (Math.random() - 0.5))
    }
    return {p: pos};
}
function funnel(color) {
    var tc;
    var pos = [];
    pos.push(-15, 35, -60) //0
    pos.push(15, 35, -60) //1
    pos.push(20, 15, -100) //2
    pos.push(-20, 15, -100) //3
    pos.push(-10, 15, 100) //4
    pos.push(10, 15, 100) //5

    pos.push(-20, -15, -100) //6
    pos.push(20, -15, -100) //7
    pos.push(15, -35, -60) //8
    pos.push(-15, -35, -60) //9
    pos.push(-10, -15, 100) //10
    pos.push(10, -15, 100) //11

    pos.push(-20, 15, -90) //12
    pos.push(20, 15, -90) //13
    pos.push(20, -15, -90) //14
    pos.push(-20, -15, -90) //15

    pos.push(10, 15, 100) //16(5)
    pos.push(-10, 15, 100) //17(4)
    pos.push(10, -15, 100) //18(11)
    pos.push(-10, -15, 100) //19(10)
    pos.push(-20, 15, -90) //20(12)
    pos.push(-20, -15, -90) //21(15)
    pos.push(-10, 15, 100) //22(4)
    pos.push(10, 15, 100) //23(5)
    pos.push(-10, -15, 100) //24(10)
    pos.push(10, -15, 100) //25(11)
    //console.log(pos.length)


    var nor = [];
    for (var i = 0, l = pos.length; i < l; i++) {
        pos[i] *= 0.01
        nor.push(0)
    }

    var col = new Array();
    for (var i = 0; i < pos.length / 3; i++) {
        if (color) {
            tc = color;
        } else {
            tc = hsva(360 / pos.length / 3 * i, 1, 1, 1);
        }
        col.push(tc[0], tc[1], tc[2], tc[3]);
    }
    var st = [];
    st.push(1 / 4, 1 / 5);//0
    st.push(2 / 4, 1 / 5);//1
    st.push(2 / 4, 2 / 5);//2
    st.push(1 / 4, 2 / 5);//3

    st.push(1 / 4, 0);//4
    st.push(2 / 4, 0);//5

    st.push(1 / 4, 3 / 5);//6
    st.push(2 / 4, 3 / 5);//7
    st.push(2 / 4, 4 / 5);//8
    st.push(1 / 4, 4 / 5);//9

    st.push(1 / 4, 1);//10
    st.push(2 / 4, 1);//11

    st.push(1, 2 / 5);//12
    st.push(3 / 4, 2 / 5);//13
    st.push(3 / 4, 3 / 5);//14
    st.push(1, 3 / 5);//15

    st.push(3 / 4, 1 / 5);//16
    st.push(1, 1 / 5);//17
    st.push(3 / 4, 4 / 5);//18
    st.push(1, 4 / 5);//19
    st.push(0, 2 / 5);//20
    st.push(0, 3 / 5);//21

    //
    st.push(0, 2 / 5);//22
    st.push(3 / 4, 2 / 5);//23
    st.push(0, 3 / 5);//24
    st.push(3 / 4, 3 / 5);//25


    var idx = [];
    addRectangleIndices(idx, 0, 1, 2, 3);
    addTriangleIndices(idx, 1, 23, 2);
    addRectangleIndices(idx, 1, 0, 4, 5);
    addTriangleIndices(idx, 0, 3, 22);
    addRectangleIndices(idx, 16, 17, 12, 13);

    addRectangleIndices(idx, 3, 2, 7, 6);
    addRectangleIndices(idx, 2, 13, 14, 7);
    addRectangleIndices(idx, 13, 12, 15, 14);
    addRectangleIndices(idx, 20, 3, 6, 21);

    addRectangleIndices(idx, 6, 7, 8, 9);
    addTriangleIndices(idx, 7, 25, 8);
    addRectangleIndices(idx, 9, 8, 11, 10);
    addTriangleIndices(idx, 6, 9, 24);
    addRectangleIndices(idx, 14, 15, 19, 18);


    function addRectangleIndices(idx, number0, number1, number2, number3) {
        idx.push(number0, number1, number3);
        idx.push(number3, number1, number2);
    }

    function addTriangleIndices(idx, number0, number1, number2) {
        idx.push(number0, number1, number2);
    }

    function vec3Normalize(v, d) {
        var e, dig;
        var n = [0.0, 0.0, 0.0];
        var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (l > 0) {
            if (!d) {
                dig = 5;
            } else {
                dig = d;
            }
            e = 1.0 / l;
            n[0] = Number((v[0] * e).toFixed(dig));
            n[1] = Number((v[1] * e).toFixed(dig));
            n[2] = Number((v[2] * e).toFixed(dig));
        }
        return n;
    }

    function faceNormal(v0, v1, v2) {
        var n = [];
        var vec1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
        var vec2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
        n[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
        n[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
        n[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
        return vec3Normalize(n);
    }

    function setNormal(id, fNormal) {
        if (fNormals[id] != undefined) {
            fNormals[id] = vec3Add(fNormals[id], fNormal)
        } else {
            fNormals[id] = fNormal
        }
    }

    function vec3Add(a, b) {
        var v = []
        v[0] = Number(a[0]) + Number(b[0]);
        v[1] = Number(a[1]) + Number(b[1])
        v[2] = Number(a[2]) + Number(b[2])
        //console.log(v)

        return vec3Normalize(v)
    }

    var i, j, k, l;
    var fNormal;

    //面の数
    j = idx.length;
    var fNormals = new Array();
    for (i = 0; i < j; i += 3) {
        //console.log("□a:",idx[i] ," ",pos[idx[i]*3],pos[idx[i]*3+1],pos[idx[i]*3+2])
        //console.log("◎b:",idx[i+1] ," ",pos[idx[i+1]*3],pos[idx[i+1]*3+1],pos[idx[i+1]*3+2])
        //console.log("▼c:",idx[i+2] ," ",pos[idx[i+2]*3],pos[idx[i+2]*3+1],pos[idx[i+2]*3+2])
        var positionA = [pos[idx[i + 0] * 3], pos[idx[i + 0] * 3 + 1], pos[idx[i + 0] * 3 + 2]]
        var positionB = [pos[idx[i + 1] * 3], pos[idx[i + 1] * 3 + 1], pos[idx[i + 1] * 3 + 2]]
        var positionC = [pos[idx[i + 2] * 3], pos[idx[i + 2] * 3 + 1], pos[idx[i + 2] * 3 + 2]]
        var fNormal = faceNormal(positionA, positionB, positionC);

        setNormal(idx[i + 0], fNormal)
        setNormal(idx[i + 1], fNormal)
        setNormal(idx[i + 2], fNormal)

        //fNormals[idx[i+0]] = fNormal
        //fNormals[idx[i+1]] = fNormal
        //fNormals[idx[i+2]] = fNormal
    }
    nor = []
    for (var i = 0; i < fNormals.length; i++) {
        //console.log("fNormals.length : ", fNormals[i])
        for (var j = 0; j < fNormals[i].length; j++) {
            nor.push(Number(fNormals[i][j]))
        }
    }
    //console.log("nor : ", nor)


    //for(i = 0; i < pos.length; i++){
    //    a = [0.0, 0.0, 0.0];
    //    b = vertex[i].faceIndex;
    //    k = b.length;
    //    for(j = 0; j < k; j++){
    //        a[0] += parseFloat(fNormal[b[j]][0]);
    //        a[1] += parseFloat(fNormal[b[j]][1]);
    //        a[2] += parseFloat(fNormal[b[j]][2]);
    //    }
    //    nor.push(vec3Normalize(a));
    //}

    var all = [];
    var pStride = 3;
    var nStride = 3;
    var tStride = 2;
    var dataLength = pos.length / 3;
    for (i = 0; i < dataLength; i++) {
        all.push(pos[(i * pStride) + 0])
        all.push(pos[(i * pStride) + 1])
        all.push(pos[(i * pStride) + 2])
        all.push(nor[(i * nStride) + 0])
        all.push(nor[(i * nStride) + 1])
        all.push(nor[(i * nStride) + 2])
        all.push(st[(i * tStride) + 0])
        all.push(st[(i * tStride) + 1])
    }

    return {a: all, p: pos, n: nor, c: col, t: st, i: idx};
}

