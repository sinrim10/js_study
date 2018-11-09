var area = document.querySelector('#area');
var tbody = area.querySelector('tbody');
var dataset = null;
var check_count = 0;
var check_history = [];
var shuffle = [];
var flag_count = 0;
var font_color = ["blue","green","red", "yello","pink"];

//status : -1 지뢰, 1 : 미오픈 , 2: 오픈 , 4: 깃발, 3:물음표
function getNearbyMineCount(row_index, col_index, hor, ver) {
    ++check_count;
    console.log(`hor : ${hor}, ver : ${ver}`);
    console.log(`row : ${row_index}, col : ${col_index}`);

    var row_start_index = (row_index - 1) < 0 ? row_index : (row_index - 1);
    var row_end_index = (row_index + 1) > hor -1? row_index : (row_index + 1);
    var col_start_index = (col_index - 1 )< 0 ? col_index : (col_index - 1);
    var col_end_index = (col_index + 1 )> ver -1? col_index : (col_index + 1);
    var mine_count = 0;
    var search_list = [];


    console.log(`row_start_index : ${row_start_index}, row_end_index : ${row_end_index}`);
    console.log(`col_start_index : ${col_start_index}, col_end_index : ${col_end_index}`);
    check_history.push(row_index+":"+col_index);

    for (var row = row_start_index; row <= row_end_index; row += 1) {
        for (var col = col_start_index; col <= col_end_index; col += 1) {
            //check_history.push(row +":"+col);
            if (row === row_index && col === col_index) {
                continue;
            }
            // console.log(`[${row}][${col}] : ${dataset[row][col]}`)
            if (dataset[row][col].status === -1) {
                mine_count += 1;
            } else {
                //&& [1,2].indexOf(dataset[row][col].flag) === -1
                if (dataset[row][col].status !== 2 && check_history.indexOf(row+":"+col) === -1) {
                    search_list.push({row: row, col: col, });
                    // if (check_history.indexOf(row+":"+col) === -1) {
                    //     search_list.push({row: row, col: col, });
                    //
                    // }

                    // 폭탄이 아닌곳들...
                }
            }
        }
    }


    if (dataset[row_index][col_index].status !== 2){
        openMine(row_index, col_index, mine_count);
    }


    if (mine_count === 0 ) {
        //search_list = search_list.concat(new_search_list);
        //console.log(search_list);
        //클릭한 폭탄이 0이면 주변 을 다시 검사한다..
        console.log('search_list ' , search_list);
        for (var i=0; i< search_list.length; i++) {
            //openMine(search_list[i].row, search_list[i].col, mine_count);
            var ser_row = search_list[i].row;
            var ser_col = search_list[i].col;
            //search_list.splice(i,1);

            getNearbyMineCount(parseInt(ser_row), parseInt(ser_col), hor, ver);
        }
    }
    // else {
    //     for (var i=0; i< search_list.length; i++) {
    //         if (dataset[search_list[i].row][search_list[i].col].status === 2) {
    //             check_history.push(search_list[i].row + ":" + search_list[i].col)
    //
    //         }
    //     }
    // }

}

function openMine(row, col, count){
    dataset[row][col].status = 2;
    dataset[row][col].mine = count;

    tbody.children[row].children[col].style.background = "white";

    if (count === 0) {
        tbody.children[row].children[col].textContent = count;
    } else {
        tbody.children[row].children[col].textContent = count;
        tbody.children[row].children[col].style.color = font_color[count-1];
    }

}

document.querySelector('#exec').addEventListener('click', function (e) {
    var hor = parseInt(document.querySelector('#hor').value);
    var ver = parseInt(document.querySelector('#ver').value);
    var mine = parseInt(document.querySelector('#mine').value);
    flag_count = mine;
    dataset = [];
    shuffle = [];
    tbody.innerHTML = '';
    var mine_dataset = Array(hor * ver)
        .fill() // undefined 로 체워짐
        .map(function (v, i) {
            return i;
        });



    while(mine_dataset.length > 0) {
        shuffle.push(mine_dataset.splice(Math.floor(Math.random() * mine_dataset.length), 1)[0]);

        if (shuffle.length === mine) {
            break;
        }
    }

    for (var i = 0; i < hor; i += 1) {
        dataset[i] = [];
        var tr = document.createElement('tr');
        for (var j = 0; j < ver; j += 1) {
            var td = document.createElement('td');
            td.dataset.value = 1;
            td.dataset.row = i;
            td.dataset.col = j;
            td.addEventListener('click', function(e){
                var target_data = e.currentTarget.dataset;
                var row_index = parseInt(target_data.row);
                var col_index = parseInt(target_data.col);

                if(dataset[row_index][col_index].status === -1) {
                    e.currentTarget.textContent = 'X';
                    console.log('폭탄이 펑');
                } else {
                    //주변 개수새기
                    getNearbyMineCount(row_index, col_index, hor, ver, []);
                    //e.currentTarget.textContent = count;
                    //console.log(tbody.children[0] === e.currentTarget.parentNode)
                    console.log('폭탄 없음 ', e.currentTarget);
                }
            });

            td.addEventListener('contextmenu', function(e) {
                var target_data = e.currentTarget.dataset;
                var row_index = parseInt(target_data.row);
                var col_index = parseInt(target_data.col);
                var target_status = dataset[row_index][col_index];
                e.preventDefault();
                if (flag_count === 0 && [1,2].indexOf(target_status.flag) === -1) {
                    return false;
                }

                if (target_status.status !== 2 && [1,2].indexOf(target_status.flag) === -1) {
                    target_status.flag = 1;
                    e.currentTarget.textContent = '?';
                    flag_count-=1;
                } else if (target_status.flag === 1) {
                    target_status.flag = 2;
                    e.currentTarget.textContent = '!';
                }  else if (target_status.flag === 2) {
                    target_status.flag = 0;
                    flag_count+=1;
                    e.currentTarget.textContent = '';
                }

            });
            dataset[i][j] = {status:1, mine:0};
            tr.appendChild(td);
        }

        tbody.appendChild(tr);

    }

    //shuffle = [315, 283, 195, 53, 285, 314, 73, 99, 163, 349, 336, 210, 342, 245, 322, 251, 228, 152, 75, 184];
    //shuffle = [581, 448, 463, 63, 48, 170, 618, 503, 32, 483, 452, 64, 236, 617, 30, 94, 324, 340, 95, 133, 266, 268, 23, 54, 214, 584, 539, 317, 360, 207, 253, 371, 125, 370, 377, 283, 131, 280, 589, 358, 194, 134, 293, 123, 613, 138, 575, 122, 354, 596];
    //shuffle =  [75, 40, 87, 19, 3, 13, 85, 17, 64, 80, 14, 88, 4, 27, 28, 29, 74, 32, 10, 58];
    //shuffle = [32, 348, 298, 2, 378, 204, 345, 363, 239, 12, 330, 178, 333, 66, 160, 280, 89, 273, 79, 344, 181, 385, 307, 134, 191, 206, 116, 387, 27, 76, 44, 201, 132, 393, 309, 224, 144, 30, 244, 39, 281, 62, 301, 279, 63, 35, 338, 101, 386, 394, 261, 221, 153, 61, 37, 105, 389, 88, 235, 311, 243, 143, 49, 82, 240, 84, 147, 381, 373, 198, 23, 83, 220, 71, 339, 183, 323, 196, 200, 283];
    shuffle = [606, 1104, 1114, 524, 1225, 432, 1113, 1001, 1047, 279, 1184, 695, 347, 932, 1325, 356, 1596, 1247, 1009, 502, 1073, 9, 438, 929, 594, 1425, 1197, 851, 1211, 1575, 99, 1388, 993, 1155, 1012, 718, 471, 895, 939, 142, 385, 45, 1025, 671, 1017, 1371, 640, 1213, 298, 203, 95, 154, 417, 1344, 490, 23, 971, 1378, 433, 1288];
    //지뢰심기
    for (var i = 0; i < shuffle.length ; i++) {
        var row = Math.floor(shuffle[i] / ver);
        var col = shuffle[i] % ver;
        dataset[row][col].status = -1;
        //tbody.children[row].children[col].dataset.value = 'X';
        //tbody.children[row].children[col].textContent = 'X';
    }
});
