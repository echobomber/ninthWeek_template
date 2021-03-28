document.addEventListener('DOMContentLoaded', function() {
    const ele = document.querySelector('.recommendation-wall');
    ele.style.cursor = 'grab';
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
});

// 以下開始撰寫 JS 程式碼
let productWrap = document.querySelector('.productWrap');
let productSelect = document.querySelector('.productSelect');
//
let keyWordSearch = document.querySelector('#keyWordSearch');
const api_path = "jordan990301";
const baseUrl = "https://hexschoollivejs.herokuapp.com";

let products = []; // 原始資料
let categoryName = [];

function getProduct() {
    let vm = this;
    // console.log(this);
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/products`;
    axios.get(url)
        .then((res) => {
            products = [...res.data.products];
            filterCategories();
            renderProduct(products);
        })
        .catch((error) => {
            console.log(error);
        })
}

function filterCategories() {
    let vm = this;
    categoryName = products.map((item) => {
        return item.category;
    })
    categoryName = categoryName.filter((element, index, self) => {
        return self.indexOf(element) === index;
    })
}
function addCart(item) {    
    // 要用 closure 才可以代入 e + 其他參數
    return function(e) {
        e.preventDefault();
        // console.log(item);
        let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
        let data = {
            "data": {
              "productId": `${item.id}`,
              "quantity": 1
            }
        }
        axios.post(url, {...data})
            .then((res) => {
                console.log(res);
                renderCart();
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
function delSingleCart(item) {
    return function(e) {
        e.preventDefault();
        let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${item.id}`;
        axios.delete(url)
            .then((res) => {
                console.log(res);
                renderCart();
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
function delAllCart(e) {
    e.preventDefault();
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
    axios.delete(url)
        .then((res) => {
            console.log(res);
            renderCart();
        })
        .catch((error) => {
            console.log(error);
        })
}
function renderCart() {
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
    let cartTable = document.querySelector('.shoppingCart-table');
    let str = `
        <caption class="section-title">我的購物車</caption>
        <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
        </tr>`;
    axios.get(url)
        .then((res) => {
            console.log(2, res);
            let data = res.data.carts;
            data.forEach((item, i) => {
                str += `
                <tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>NT$${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>NT$${item.product.price * item.quantity}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons">
                            clear
                        </a>
                    </td>
                </tr>`;
            })
            str += `
                <tr>
                    <td>
                        <a href="#" class="discardAllBtn">刪除所有品項</a>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p>總金額</p>
                    </td>
                    <td>NT$13,980</td>
                </tr>`;
            cartTable.innerHTML = str;
            data.forEach((item, i) => {
                document.querySelectorAll('.discardBtn a')[i].addEventListener('click', delSingleCart(item));
            })
            let discardAllBtn = document.querySelector('.discardAllBtn');
            discardAllBtn.addEventListener('click', delAllCart);
        })
        .catch((error) => {
            console.log(error);
        })
}
function renderProduct(targetProduct) {
    let vm = this;
    let str = '';
    targetProduct.forEach((item, i) => {
        str += `
        <li class="productCard">
            <h4 class="productType">${item.category}</h4>
            <img src="${item.images}" alt="${item.title}">
            <a href="#" id="addCardBtn">加入購物車</a>
            <h3>${item.title}</h3>
            <p class="originPrice">NT$${item.origin_price}</p>
            <p class="nowPrice">NT$${item.price}</p>
        </li>
        `
    })
    productWrap.innerHTML = str;
    targetProduct.forEach((item, i) => {
        document.querySelectorAll('#addCardBtn')[i].addEventListener('click', addCart(item));
    })
    // 
    str = `
        <option value="" disabled selected hidden>全部、找新品、限時折扣</option>
        <option value="全部">全部</option>
    `;
    categoryName.forEach((item) => {
        str += `
            <option value="${item}">${item}</option>
        `;
    })
    productSelect.innerHTML = str;
}
function productFilter(e) {
    e.preventDefault();
    let vm = this;
    if(e.target.value === "全部") {
        renderProduct(products);
    }else{
        let showProduct = products.filter((item) => {
            return item.category === e.target.value;
        })
        renderProduct(showProduct);
    }
}
function init() {
    getProduct();
    renderCart();
}
//
function keywordFilter() {
    let keyword = document.querySelector('#keyWord').value.trim();
    let showProduct = products.filter((item) => {
        return item.title.match(keyword);
    })
    renderProduct(showProduct);
}

init();

productSelect.addEventListener('change', productFilter);
keyWordSearch.addEventListener('click', keywordFilter);

// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 2],
        ['Antony 雙人床架', 3],
        ['Anty 雙人床架', 2],
        ['Charles 雙人床架', 3],
        ],
        colors:{
            "Louvre 雙人床架":"#301E5F",
            "Antony 雙人床架":"#5434A7",
            "Anty 雙人床架": "#9D7FEA",
            "Charles 雙人床架": "#6A33F8",
        }
    },
});

